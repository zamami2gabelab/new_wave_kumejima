/**
 * calendar_mapper.gs
 * 予約一覧の1行データから、Google Calendar Event（resource）を生成する
 */

function buildCalendarEventResourceFromRow_(row, idx) {
  const productName = String(row[idx['商品名']] || '').trim();
  const totalPeople = Number(row[idx['合計人数']] || 0);

  const reservationId = String(row[idx['予約ID']] || '').trim(); // ★追加（必須）

  const leaderName = String(row[idx['代表者名']] || '').trim();
  const phone = String(row[idx['電話番号']] || '').trim();
  const email = String(row[idx['メールアドレス']] || '').trim();

  // 予約日（Date/文字列どちらでもOK）
  const reservationDateVal = row[idx['予約日']];
  const reservationDateStr = reservationDateVal instanceof Date
    ? Utilities.formatDate(reservationDateVal, TIMEZONE, 'yyyy-MM-dd')
    : String(reservationDateVal || '').trim();

  const pickupRequired = String(row[idx['ピックアップ必要']] || '').trim();
  const hotelName = String(row[idx['送迎先ホテル名']] || '').trim();

  const message = String(row[idx['メッセージ']] || '').trim();
  const totalPrice = Number(row[idx['見積もり合計金額']] || 0);

  // タイトル（要件通り）
  const summary = `${productName}（合計${totalPeople}名）`;

  // 場所
  const location =
    pickupRequired === 'はい' && hotelName
      ? hotelName
      : '';

  // 説明（代表者名を必ず入れる）
  const lines = [];
  lines.push(`代表者名: ${leaderName}`);
  if (reservationId) lines.push(`予約ID: ${reservationId}`);
  if (phone) lines.push(`電話: ${phone}`);
  if (email) lines.push(`メール: ${email}`);
  lines.push(`予約日: ${reservationDateStr}`);
  lines.push(`合計人数: ${totalPeople}名`);
  if (pickupRequired === 'はい') {
    lines.push(`ピックアップ: 必要 / ${hotelName || '未入力'}`);
  } else {
    lines.push('ピックアップ: 不要');
  }
  lines.push('');
  lines.push(`見積合計: ¥${totalPrice.toLocaleString()}`);

  if (message) {
    lines.push('');
    lines.push('--- メッセージ ---');
    lines.push(message);
  }

  const description = lines.join('\n');

  // 時間（Dateを渡すのが安全）
  const range = resolveEventTimeRange_(reservationDateVal, '');

  // 色（商品名→colorId）
  const colorId = String(PRODUCT_COLOR_ID_MAP[productName] || DEFAULT_EVENT_COLOR_ID);

  // Calendar API resource
  let start, end;
  if (range.isAllDay) {
    // allDay は end が翌日
    const ymd = reservationDateStr;
    const nextDay = new Date(range.start.getTime());
    nextDay.setDate(nextDay.getDate() + 1);
    const ymdNext = Utilities.formatDate(nextDay, TIMEZONE, 'yyyy-MM-dd');

    start = { date: ymd };
    end = { date: ymdNext };
  } else {
    start = {
      dateTime: Utilities.formatDate(range.start, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: TIMEZONE,
    };
    end = {
      dateTime: Utilities.formatDate(range.end, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: TIMEZONE,
    };
  }

  return { summary, description, location, start, end, colorId };
}
