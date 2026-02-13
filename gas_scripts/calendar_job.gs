/**
 * calendar_job.gs
 * チェック済み行を Google Calendar に登録する（分離実行）
 *
 * 仕様:
 * - A列「送信対象」が true の行だけ対象
 * - カレンダーイベントID があれば二重登録しない
 * - 状態列:
 *   - カレンダー状態: PENDING / CREATING / CREATED / ERROR
 *   - カレンダーイベントID
 *   - カレンダー作成日時
 *   - カレンダーエラー
 *
 * 注意:
 * - Advanced Google Service「Google Calendar API」を有効化している必要あり
 *   （Calendar.Events.insert を使用）
 */

const CALENDAR_BATCH_LIMIT = 20;
const CALENDAR_SLEEP_MS = 0; // 必要なら 100〜300

function createCalendarEventsForCheckedReservations() {
  const start = Date.now();
  const lap = (label) => Logger.log(`[+${((Date.now() - start)/1000).toFixed(1)}s] ${label}`);

  lap('START createCalendarEventsForCheckedReservations');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
    if (!sheet) throw new Error('予約一覧シートが見つかりません');

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) {
      notify_('データがありません。');
      return;
    }

    // ヘッダー
    const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(v => String(v || '').trim());
    const idx = buildHeaderIndex_(header);

    // 必須列（カレンダー系）
    const required = [
      CHECKBOX_HEADER,
      'カレンダー状態',
      'カレンダーイベントID',
      'カレンダー作成日時',
      'カレンダーエラー',
      '予約ID',
      '代表者名',
      '電話番号',
      'メールアドレス',
      '予約日',
      '合計人数',
      '商品名',
      'ピックアップ必要',
      '送迎先ホテル名',
      'メッセージ',
      '見積もり合計金額',
    ];
    const missing = required.filter(h => idx[h] == null);
    if (missing.length) throw new Error('必須列が不足しています: ' + missing.join(', '));

    const checkboxCol = idx[CHECKBOX_HEADER] + 1;

    // 対象抽出（チェック済み かつ eventId が空）
    const targets = [];
    for (let rowNo = 2; rowNo <= lastRow; rowNo++) {
      const checked = sheet.getRange(rowNo, checkboxCol).getValue() === true;
      if (!checked) continue;

      const eventId = String(sheet.getRange(rowNo, idx['カレンダーイベントID'] + 1).getValue() || '').trim();
      if (eventId) continue; // 二重登録防止

      targets.push(rowNo);
      if (targets.length >= CALENDAR_BATCH_LIMIT) break;
    }

    if (targets.length === 0) {
      notify_('チェック済みで、未登録のカレンダー対象がありません。');
      return;
    }

    const nowStr = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

    // 先に CREATING（冪等性）
    for (const rowNo of targets) {
      sheet.getRange(rowNo, idx['カレンダー状態'] + 1).setValue('CREATING');
      sheet.getRange(rowNo, idx['カレンダーエラー'] + 1).setValue('');
    }
    SpreadsheetApp.flush();

    let created = 0;
    let failed = 0;

    // Google Calendar（メイン = primary）
    const calendarId = 'primary';

    for (const rowNo of targets) {
      try {
        const row = sheet.getRange(rowNo, 1, 1, lastCol).getValues()[0];
        const resource = buildCalendarEventResourceFromRow_(row, idx);

        // Advanced Calendar API: event insert
        // ※ Calendar サービス（Advanced）が有効である必要あり
        const event = Calendar.Events.insert(resource, calendarId);

        // 保存
        sheet.getRange(rowNo, idx['カレンダー状態'] + 1).setValue('CREATED');
        sheet.getRange(rowNo, idx['カレンダーイベントID'] + 1).setValue(event.id || '');
        sheet.getRange(rowNo, idx['カレンダー作成日時'] + 1).setValue(nowStr);
        sheet.getRange(rowNo, idx['カレンダーエラー'] + 1).setValue('');

        created++;
        if (CALENDAR_SLEEP_MS > 0) Utilities.sleep(CALENDAR_SLEEP_MS);

      } catch (err) {
        sheet.getRange(rowNo, idx['カレンダー状態'] + 1).setValue('ERROR');
        sheet.getRange(rowNo, idx['カレンダーエラー'] + 1).setValue(String(err));
        failed++;
      }
    }

    notify_(`カレンダー登録完了：成功${created} / 失敗${failed}（今回${targets.length}件）`);

  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * 統合：カレンダー登録 → メール送信（分離型UIの“統合ボタン”）
 * - カレンダー登録は eventId が無い行だけ作成
 * - メール送信は既存ロジック（チェック済み）に委譲
 */
function createCalendarThenSendMailForCheckedReservations() {
  createCalendarEventsForCheckedReservations();
  // カレンダーが ERROR の行があっても、メール送信するかは運用次第。
  // ひとまず「チェック済みは送る」仕様のままにします。
  // 必要なら「カレンダーCREATEDの行だけ送る」に変更可能。
  sendCheckedReservationEmails();
}
