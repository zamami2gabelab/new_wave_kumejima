/**
 * validators.gs
 * payload（予約データ）のバリデーション
 *
 * 役割:
 * - doPost から呼ばれて「保存して良いデータか？」を判定する
 * - NGなら { valid:false, error:"..." } を返す
 *
 * 注意:
 * - 現状は JSON payload 前提（あなたの既存コード通り）
 * - 参加者は最大99名まで許可（要件）
 */

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'payloadが不正です' };
  }

  // ===== 代表者情報（必須） =====
  if (!payload.leader || typeof payload.leader !== 'object') {
    return { valid: false, error: '代表者情報が不足しています' };
  }
  if (!payload.leader.name) {
    return { valid: false, error: '代表者名が不足しています' };
  }
  if (!payload.leader.email) {
    return { valid: false, error: '代表者メールアドレスが不足しています' };
  }
  if (!payload.leader.phone) {
    return { valid: false, error: '代表者電話番号が不足しています' };
  }

  // ===== 予約日（必須） =====
  if (!payload.reservationDate) {
    return { valid: false, error: '予約日が指定されていません' };
  }

  // ===== 商品情報（必須） =====
  if (!payload.transportType) {
    return { valid: false, error: '交通手段が指定されていません' };
  }
  if (!payload.productId) {
    return { valid: false, error: '商品IDが指定されていません' };
  }

  // ===== 人数情報（必須） =====
  if (!payload.people || typeof payload.people !== 'object') {
    return { valid: false, error: '人数情報が不足しています' };
  }

  const totalPeople = Number(payload.people.totalPeople);
  if (!Number.isFinite(totalPeople) || totalPeople <= 0) {
    return { valid: false, error: '合計人数が不正です' };
  }

  // ===== 参加者（最大99名） =====
  // 参加者を別シートに保存する前提でも、受け取る配列が99を超えたら弾く
  if (payload.participants != null) {
    if (!Array.isArray(payload.participants)) {
      return { valid: false, error: '参加者情報(participants)の形式が不正です' };
    }
    if (payload.participants.length > 99) {
      return { valid: false, error: '参加者は最大99名まで受付可能です' };
    }
  }

  // ===== メールアドレス形式（簡易） =====
  const email = String(payload.leader.email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'メールアドレスの形式が正しくありません' };
  }

  // ===== 電話番号形式（簡易） =====
  // 数字のみ（ハイフン・スペースは許容して除去）、10〜15桁想定
  const phone = String(payload.leader.phone).replace(/[-\s]/g, '');
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: '電話番号の形式が正しくありません' };
  }

  // ===== オプションの整合性（軽め・任意） =====
  // optionsがあるなら配列、qty/unitPriceは数値化できること（厳密にしすぎると運用で詰まるので最低限）
  if (payload.options != null) {
    if (!Array.isArray(payload.options)) {
      return { valid: false, error: 'オプション(options)の形式が不正です' };
    }
    for (let i = 0; i < payload.options.length; i++) {
      const opt = payload.options[i];
      if (!opt || typeof opt !== 'object') {
        return { valid: false, error: 'オプション(options)の中身が不正です' };
      }
      if (!opt.optionId) {
        return { valid: false, error: 'オプションID(optionId)が不足しています' };
      }
      const qty = Number(opt.qty);
      const unitPrice = Number(opt.unitPrice);
      if (!Number.isFinite(qty) || qty < 0) {
        return { valid: false, error: 'オプション数量(qty)が不正です' };
      }
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return { valid: false, error: 'オプション単価(unitPrice)が不正です' };
      }
    }
  }

  // ===== ピックアップの整合性（軽め・任意） =====
  // pickup.required が true の時、fee が数値化できること（placeIdは空でも運用上許容するならここでは必須にしない）
  if (payload.pickup != null) {
    if (typeof payload.pickup !== 'object') {
      return { valid: false, error: 'ピックアップ(pickup)の形式が不正です' };
    }
    if (payload.pickup.required === true) {
      const fee = Number(payload.pickup.fee);
      if (!Number.isFinite(fee) || fee < 0) {
        return { valid: false, error: 'ピックアップ料金が不正です' };
      }
    }
  }

  // ===== 弁当の整合性（軽め・任意） =====
  if (payload.bento != null) {
    if (typeof payload.bento !== 'object') {
      return { valid: false, error: '弁当(bento)の形式が不正です' };
    }
    if (payload.bento.enabled === true) {
      const qty = Number(payload.bento.qty);
      const unitPrice = Number(payload.bento.unitPrice);
      if (!Number.isFinite(qty) || qty < 0) {
        return { valid: false, error: '弁当数量が不正です' };
      }
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return { valid: false, error: '弁当単価が不正です' };
      }
    }
  }

  return { valid: true };
}
