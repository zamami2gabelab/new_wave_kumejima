// mail_template.gs
/**
 * 予約内容を「簡潔」にまとめたメールテンプレート
 * - HTMLは使わずプレーンテキスト（スマホで読みやすい）
 * - 必要な情報だけを列挙
 */

/**
 * 件名
 * @param {Object} info buildReservationInfoFromRow_ で作った情報
 */
function buildMailSubject_(info) {
  return `【予約確認】${info.reservationDate} / ${info.productName}（${info.reservationId}）`;
}

/**
 * 本文（簡潔版）
 * @param {Object} info buildReservationInfoFromRow_ で作った情報
 */
function buildMailBody_(info) {
  const lines = [];

  lines.push(`${info.leaderName} 様`);
  lines.push('');
  lines.push('ご予約ありがとうございます。以下の内容で承りました。');
  lines.push('');

  lines.push(`予約ID: ${info.reservationId}`);
  lines.push(`予約日: ${info.reservationDate}`);
  lines.push(`到着: ${info.arrivalSlot || '指定なし'}`);
  lines.push(`商品: ${info.productName}`);
  lines.push(`人数: 合計 ${info.totalPeople} 名（大人${info.adults} / 子供${info.children} / 乳幼児${info.infants}）`);

  // ピックアップ
  if (info.pickupRequired === 'はい') {
    lines.push(`ピックアップ: 必要 / ${info.pickupPlaceName || ''}（¥${Number(info.pickupFee || 0).toLocaleString()}）`);
  } else {
    lines.push('ピックアップ: 不要');
  }

  // オプション
  const optionSummary = (info.optionSummary && info.optionSummary.length)
    ? info.optionSummary.join(', ')
    : 'なし';
  lines.push(`オプション: ${optionSummary}（合計 ¥${Number(info.optionTotal || 0).toLocaleString()}）`);

  // 弁当
  if (info.bento === 'あり') {
    lines.push(`弁当: あり（${info.bentoQty}個 / ¥${Number(info.bentoTotal || 0).toLocaleString()}）`);
  } else {
    lines.push('弁当: なし');
  }

  // 合計
  lines.push(`見積合計: ¥${Number(info.grandTotal || 0).toLocaleString()}`);

  // メッセージ
  if (info.message && String(info.message).trim()) {
    lines.push('');
    lines.push('メッセージ:');
    lines.push(String(info.message).trim());
  }

  lines.push('');
  lines.push('※このメールは管理画面操作により送信されています。');
  lines.push('New Wave久米島');

  return lines.join('\n');
}

/**
 * 数量列から「オプション×数量」だけを抽出して簡潔にまとめる
 * @param {Array} row 1行のデータ配列
 * @param {Object} idx ヘッダー→列番号マップ
 * @returns {Array<string>}
 */
function buildOptionSummaryFromRow_(row, idx) {
  const defs = [
    ['シュノーケルセット数量', 'シュノーケル'],
    ['バナナボート数量', 'バナナボート'],
    ['水中スクーター数量', '水中スクーター'],
    ['マーブル数量', 'マーブル'],
    ['ビッグマーブル数量', 'ビッグマーブル'],
    ['ジェットスキー数量', 'ジェットスキー'],
    ['ジェットシュノーケリング数量', 'ジェットシュノーケル'],
    ['ウェイクボード数量', 'ウェイクボード'],
    ['浮き輪数量', '浮き輪'],
  ];

  const out = [];
  for (const [col, label] of defs) {
    if (idx[col] == null) continue;
    const qty = Number(row[idx[col]] || 0);
    if (qty > 0) out.push(`${label}×${qty}`);
  }
  return out;
}

/**
 * 予約一覧の1行から、テンプレに必要な情報をまとめて取り出す
 * @param {Array} row
 * @param {Object} idx
 */
function buildReservationInfoFromRow_(row, idx) {
  const info = {
    reservationId: String(row[idx['予約ID']] || ''),
    leaderName: String(row[idx['代表者名']] || ''),
    email: String(row[idx['メールアドレス']] || ''),
    reservationDate: String(row[idx['予約日']] || ''),
    productName: String(row[idx['商品名']] || ''),
    arrivalSlot: String(row[idx['到着時間帯']] || ''),
    adults: Number(row[idx['大人人数']] || 0),
    children: Number(row[idx['子供人数']] || 0),
    infants: Number(row[idx['乳幼児人数']] || 0),
    totalPeople: Number(row[idx['合計人数']] || 0),

    pickupRequired: String(row[idx['ピックアップ必要']] || ''),
    pickupPlaceName: String(row[idx['ピックアップ場所名']] || ''),
    pickupFee: Number(row[idx['ピックアップ料金']] || 0),

    optionTotal: Number(row[idx['オプション合計金額']] || 0),

    bento: String(row[idx['弁当有無']] || ''),
    bentoQty: Number(row[idx['弁当数量']] || 0),
    bentoTotal: Number(row[idx['弁当合計金額']] || 0),

    grandTotal: Number(row[idx['見積もり合計金額']] || 0),
    message: String(row[idx['メッセージ']] || ''),
  };

  info.optionSummary = buildOptionSummaryFromRow_(row, idx);
  return info;
}

/**
 * ヘッダー行から index map を作る
 * @param {Array} headerRow
 */
function buildHeaderIndex_(headerRow) {
  const map = {};
  for (let i = 0; i < headerRow.length; i++) {
    const h = String(headerRow[i] || '').trim();
    if (h) map[h] = i;
  }
  return map;
}
