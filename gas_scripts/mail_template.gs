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
  lines.push(`商品: ${info.productName}`);
  lines.push(`人数: 合計 ${info.totalPeople} 名（大人${info.adults} / 子供${info.children} / 乳幼児${info.infants}）`);
  if (info.phone) {
    lines.push(`電話番号: ${info.phone}`);
  }

  // ピックアップ
  if (info.pickupRequired === 'はい') {
    lines.push(`ピックアップ: 必要 / ${info.hotelName || '未入力'}`);
  } else {
    lines.push('ピックアップ: 不要');
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
 * 予約一覧の1行から、テンプレに必要な情報をまとめて取り出す
 * @param {Array} row
 * @param {Object} idx
 */
function buildReservationInfoFromRow_(row, idx) {
  const info = {
    reservationId: String(row[idx['予約ID']] || ''),
    leaderName: String(row[idx['代表者名']] || ''),
    phone: String(row[idx['電話番号']] || ''),
    email: String(row[idx['メールアドレス']] || ''),
    reservationDate: String(row[idx['予約日']] || ''),
    productName: String(row[idx['商品名']] || ''),
    adults: Number(row[idx['大人人数']] || 0),
    children: Number(row[idx['子供人数']] || 0),
    infants: Number(row[idx['乳幼児人数']] || 0),
    totalPeople: Number(row[idx['合計人数']] || 0),

    pickupRequired: String(row[idx['ピックアップ必要']] || ''),
    hotelName: String(row[idx['送迎先ホテル名']] || ''),

    grandTotal: Number(row[idx['見積もり合計金額']] || 0),
    message: String(row[idx['メッセージ']] || ''),
  };

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
