/**
 * mappers.gs
 * payload(JSON) → 予約一覧に保存する1行(Array)へ変換する
 *
 * 重要:
 * - 返す配列の列数は RESERVATION_HEADERS.length と一致させること
 * - 予約一覧には参加者列を持たない（参加者は別シートへ）
 */

/**
 * payload を予約一覧の rowData に変換
 * @param {Object} payload
 * @param {string} reservationId
 * @returns {Array} rowData（チェック列を除く。RESERVATION_HEADERS.length - 1）
 */
function convertPayloadToRow(payload, reservationId) {
  const now = new Date();
  const receivedDateTime = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

  // 商品名
  const productName = getProductName_(payload.productId);

  // 人数
  const adults = Number(payload?.people?.adults || 0);
  const children = Number(payload?.people?.children || 0);
  const infants = Number(payload?.people?.infants || 0);
  const totalPeople = Number(payload?.people?.totalPeople || 0);

  // ピックアップ
  const pickupRequired = Boolean(payload?.pickup?.required);
  const pickupRequiredText = pickupRequired ? 'はい' : 'いいえ';
  const hotelName = pickupRequired ? String(payload?.pickup?.hotelName || '') : '';

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

  // ===== 予約データ本体 =====
  const base = [
    reservationId,           // 予約ID
    receivedDateTime,        // 受信日時
    payload?.leader?.name || '',     // 代表者名
    payload?.leader?.phone || '',    // 電話番号
    payload?.leader?.email || '',    // メールアドレス
    payload?.reservationDate || '',  // 予約日
    payload?.productId || '',// 商品ID
    productName,             // 商品名
    adults,                  // 大人人数
    children,                // 子供人数
    infants,                 // 乳幼児人数
    totalPeople,             // 合計人数
    pickupRequiredText,      // ピックアップ必要
    hotelName,               // 送迎先ホテル名
    payload?.message || '',   // メッセージ
    totalClientCalc,          // 見積もり合計金額
  ];

  const rowData = ops.concat(base);

  // 最終安全チェック（列ズレ防止）
  // rowDataは「チェック列(送信対象)を除いた」列数で返す
  if (rowData.length !== RESERVATION_HEADERS.length - 1) {
    throw new Error(
      `convertPayloadToRow: 列数が一致しません rowData=${rowData.length} / headers=${RESERVATION_HEADERS.length}`
    );
  }

  return rowData;
}

/** 商品名マスタ（必要に応じて追加） */
function getProductName_(productId) {
  const productMap = {
    'PLAN_NONBIRI': 'のんびりはての浜プラン',
    'PLAN_BANANABOAT': 'はての浜バナナボートプラン',
    'PLAN_SUINBOU': 'はての浜スインボーで遊ぼープラン',
    'PLAN_ASOBITSUKUSHI': 'はての浜遊びつくしプラン',
    'PLAN_JETCRUISING': 'はての浜ジェットクルージングプラン',
    'PLAN_FAMILY_FULL': 'ファミリーアクティビティープラン（1日）',
    'PLAN_FAMILY_HALF': 'ファミリーアクティビティープラン（半日）',
    'PLAN_FAMILY_RELAX': 'ファミリーゆったりプラン（半日）',
    'PLAN_COUPLE_SPECIAL': 'はての浜スペシャルペアプラン（1日）',
    'PLAN_COUPLE_MARINE': 'はての浜ペアマリン体験プラン（半日）',
    'PLAN_COUPLE_BASIC': 'はての浜ペアプラン（半日）',
    'PLAN_GROUP_CHARTER': 'はての浜渡船チャータープラン',
    'PLAN_SUNSET': 'サンセットプラン',
  };
  return productMap[productId] || (productId || '');
}
