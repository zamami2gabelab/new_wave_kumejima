// ui_reservation_manager.gs
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('予約管理')
    // カレンダー系（分離）
    .addItem('チェック済みをカレンダー登録', 'createCalendarEventsForCheckedReservations')
    .addSeparator()
    // メール系（既存）
    .addItem('チェック済みをメール送信（プレビューあり）', 'previewAndSendCheckedEmails')
    .addItem('チェック済みをメール送信', 'sendCheckedReservationEmails')
    .addSeparator()
    // 統合（最後に）
    .addItem('チェック済みをカレンダー登録 → メール送信', 'createCalendarThenSendMailForCheckedReservations')
    .addSeparator()
    .addItem('チェックを全解除', 'clearAllReservationChecks')
    .addItem('チェックを全選択（SENT除外）', 'checkAllPendingReservations')
    .addToUi();
}

/**
 * 送信対象チェックを全解除する
 */
function clearAllReservationChecks() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  ensureReservationHeaders(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    uiNotify_('対象データがありません。');
    return;
  }

  const checkboxCol = 1; // A列: 送信対象
  sheet.getRange(2, checkboxCol, lastRow - 1, 1).setValue(false);
  uiNotify_(`チェックを全解除しました（${lastRow - 1}件）`);
}

/**
 * メール状態が SENT 以外の行を全選択する
 */
function checkAllPendingReservations() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  ensureReservationHeaders(sheet);

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) {
    uiNotify_('対象データがありません。');
    return;
  }

  const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(v => String(v || '').trim());
  const idx = {};
  for (let i = 0; i < header.length; i++) {
    if (header[i]) idx[header[i]] = i;
  }

  if (idx[CHECKBOX_HEADER] == null) throw new Error(`必須列が不足しています: ${CHECKBOX_HEADER}`);
  if (idx['メール状態'] == null) throw new Error('必須列が不足しています: メール状態');

  const checkboxCol = idx[CHECKBOX_HEADER] + 1;
  const mailStatusCol = idx['メール状態'] + 1;

  const statusVals = sheet.getRange(2, mailStatusCol, lastRow - 1, 1).getValues();
  const setVals = [];
  let selected = 0;

  for (let i = 0; i < statusVals.length; i++) {
    const status = String(statusVals[i][0] || '').trim().toUpperCase();
    const shouldCheck = status !== 'SENT';
    if (shouldCheck) selected++;
    setVals.push([shouldCheck]);
  }

  sheet.getRange(2, checkboxCol, setVals.length, 1).setValues(setVals);
  uiNotify_(`チェックを全選択しました（SENT除外 / ${selected}件）`);
}

function uiNotify_(message) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(String(message), '予約管理', 6);
  } catch (e) {
    Logger.log('[ui_notify] ' + message);
  }
}
