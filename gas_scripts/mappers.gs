/**
 * mappers.gs
 * payload(JSON) → 予約一覧に保存する1行(Array)へ変換する
 *
 * 重要:
 * - 返す配列の列数は RESERVATION_HEADERS.length（=41）と一致させること
 * - 予約一覧には参加者列を持たない（参加者は別シートへ）
 */

/**
 * payload を予約一覧の rowData に変換
 * @param {Object} payload
 * @param {string} reservationId
 * @returns {Array} rowData（RESERVATION_HEADERS と同じ順番・同じ列数）
 */
function convertPayloadToRow(payload, reservationId) {
  const now = new Date();
  const receivedDateTime = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

  // 商品名/ピックアップ名
  const productName = getProductName_(payload.productId);
  const pickupPlaceName = getPickupPlaceName_(payload?.pickup?.placeId);

  // オプション数量
  const optionQuantities = mapOptionQuantities_(payload.options || []);

  // オプション合計
  const optionTotal = (payload.options || []).reduce((sum, opt) => {
    const qty = Number(opt?.qty || 0);
    const unitPrice = Number(opt?.unitPrice || 0);
    return sum + (qty * unitPrice);
  }, 0);

  // 弁当
  const bentoEnabled = Boolean(payload?.bento?.enabled);
  const bentoQty = bentoEnabled ? Number(payload?.bento?.qty || 0) : 0;
  const bentoUnitPrice = bentoEnabled ? Number(payload?.bento?.unitPrice || 0) : 0;
  const bentoTotal = bentoEnabled ? bentoQty * bentoUnitPrice : 0;

  // 人数
  const adults = Number(payload?.people?.adults || 0);
  const children = Number(payload?.people?.children || 0);
  const infants = Number(payload?.people?.infants || 0);
  const totalPeople = Number(payload?.people?.totalPeople || 0);

  // 交通手段（表示用）
  const transportName =
    payload.transportType === 'PLAN_WITH_BOAT' ? '船付きプラン' : 'チケットのみ';

  // 到着時間帯（表示用）
  const arrivalSlot =
    payload.arrivalSlot === 'AM' ? '午前' :
    payload.arrivalSlot === 'PM' ? '午後' : '';

  // ピックアップ（表示用）
  const pickupRequired = Boolean(payload?.pickup?.required);
  const pickupRequiredText = pickupRequired ? 'はい' : 'いいえ';
  const pickupPlaceId = pickupRequired ? (payload?.pickup?.placeId || '') : '';
  const pickupFee = pickupRequired ? Number(payload?.pickup?.fee || 0) : 0;

  // 弁当（表示用）
  const bentoText = bentoEnabled ? 'あり' : 'なし';

  // 見積もり合計
  const totalClientCalc = Number(payload?.totals?.totalClientCalc || 0);

  // ===== 運用列（先頭7列）初期値 =====
  const ops = [
    INITIAL_MAIL_STATUS,     // メール状態
    '',                      // メール送信日時
    '',                      // メールエラー
    INITIAL_CALENDAR_STATUS, // カレンダー状態
    '',                      // カレンダーイベントID
    '',                      // カレンダー作成日時
    '',                      // カレンダーエラー
  ];

  // ===== 予約データ本体（後ろ34列）=====
  const base = [
    reservationId,           // 予約ID
    receivedDateTime,        // 受信日時
    payload?.leader?.name || '',     // 代表者名
    payload?.leader?.phone || '',    // 電話番号
    payload?.leader?.email || '',    // メールアドレス
    payload?.reservationDate || '',  // 予約日
    transportName,           // 交通手段
    payload?.productId || '',// 商品ID
    productName,             // 商品名
    arrivalSlot,             // 到着時間帯
    adults,                  // 大人人数
    children,                // 子供人数
    infants,                 // 乳幼児人数
    totalPeople,             // 合計人数
    pickupRequiredText,      // ピックアップ必要
    pickupPlaceId,           // ピックアップ場所ID
    pickupPlaceName || '',   // ピックアップ場所名
    pickupFee,               // ピックアップ料金

    optionQuantities['OPT_SNORKEL_SET'] || 0,         // シュノーケルセット数量
    optionQuantities['OPT_BANANA_BOAT'] || 0,         // バナナボート数量
    optionQuantities['OPT_UNDERWATER_SCOOTER'] || 0,  // 水中スクーター数量
    optionQuantities['OPT_MARBLE'] || 0,              // マーブル数量
    optionQuantities['OPT_BIG_MARBLE'] || 0,          // ビッグマーブル数量
    optionQuantities['OPT_JET_SKI'] || 0,             // ジェットスキー数量
    optionQuantities['OPT_JET_SNORKELING'] || 0,      // ジェットシュノーケリング数量
    optionQuantities['OPT_WAKEBOARD'] || 0,           // ウェイクボード数量
    optionQuantities['OPT_FLOAT_RING'] || 0,          // 浮き輪数量

    optionTotal,              // オプション合計金額
    bentoText,                // 弁当有無
    bentoQty,                 // 弁当数量
    bentoUnitPrice,           // 弁当単価
    bentoTotal,               // 弁当合計金額
    payload?.message || '',   // メッセージ
    totalClientCalc,          // 見積もり合計金額
  ];

  const rowData = ops.concat(base);

  // 最終安全チェック（列ズレ防止）
  if (rowData.length !== RESERVATION_HEADERS.length) {
    throw new Error(
      `convertPayloadToRow: 列数が一致しません rowData=${rowData.length} / headers=${RESERVATION_HEADERS.length}`
    );
  }

  return rowData;
}

/** オプション数量を optionId → qty にする */
function mapOptionQuantities_(options) {
  const map = {};
  (options || []).forEach(opt => {
    const id = opt?.optionId;
    const qty = Number(opt?.qty || 0);
    if (id) map[id] = qty;
  });
  return map;
}

/** 商品名マスタ（必要に応じて追加） */
function getProductName_(productId) {
  const productMap = {
    'PLAN_WAKUWAKU': 'わくわくプラン',
    'PLAN_MANZOKU': 'まんぞくプラン',
    'PLAN_ASOBIHOUDAI': '遊び放題プラン',
    'PLAN_IKUDAKE': '行くだけプラン',
    'TICKET_ASOBIHOUDAI': '遊び放題チケット',
    'TICKET_UMIGAME': 'うみがめ探しツアー',
  };
  return productMap[productId] || (productId || '');
}

/** ピックアップ場所マスタ（必要に応じて追加） */
function getPickupPlaceName_(placeId) {
  if (!placeId) return '';
  const placeMap = {
    'PICK_EEF': 'イーフビーチ',
    'PICK_KUME_ISLAND': '久米アイランド',
    'PICK_CYPRESS': 'サイプレス',
    'PICK_LATIDA': 'ラティーダ',
    'PICK_OTHER': 'その他',
  };
  return placeMap[placeId] || placeId;
}
