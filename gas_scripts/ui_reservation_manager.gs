// ui_reservation_manager.gs
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  const adminMenu = ui.createMenu('管理者メニュー')
    .addItem('カレンダー登録', 'createCalendarEventsForCheckedReservations')
    .addItem('メール送信', 'sendCheckedReservationEmails')
    .addItem('すべてのチェックを解除','clearAllReservationChecks');

  ui.createMenu('予約管理')
    .addSubMenu(adminMenu)
    .addToUi();
}

/**
 * 通常運用（図形割り当て用）: OTA予約メールを取り込む
 */
function runOpsImportReservationEmails() {
  importReservationEmailsFromGmail();
}

/**
 * 通常運用（図形割り当て用）: 未送信のみ送信対象に自動選択
 */
function runOpsSelectPendingReservations() {
  checkAllPendingReservations();
}

/**
 * 通常運用（図形割り当て用）: カレンダー登録 -> 確認メール送信
 */
function runOpsProcessSelectedReservations() {
  createCalendarThenSendMailForCheckedReservations();
}

/**
 * 通常運用（図形割り当て用）: 送信対象チェックを解除
 */
function runOpsClearSelectedReservations() {
  clearAllReservationChecks();
}

/**
 * 送信対象チェックを全解除する
 */
function clearAllReservationChecks() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  ensureReservationHeaders(sheet);

  const dataStartRow = getReservationDataStartRow_();
  const dataRowCount = getReservationDataRowCount_(sheet);
  if (dataRowCount <= 0) {
    uiNotify_('対象データがありません。');
    return;
  }

  const checkboxCol = 1; // A列: 送信対象
  sheet.getRange(dataStartRow, checkboxCol, dataRowCount, 1).setValue(false);
  uiNotify_(`チェックを全解除しました（${dataRowCount}件）`);
}

/**
 * メール状態が SENT 以外の行を全選択する
 */
function checkAllPendingReservations() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  ensureReservationHeaders(sheet);

  const lastCol = sheet.getLastColumn();
  const headerRowNo = RESERVATION_HEADER_ROW;
  const dataStartRow = getReservationDataStartRow_();
  const dataRowCount = getReservationDataRowCount_(sheet);
  if (dataRowCount <= 0) {
    uiNotify_('チェック対象データがありません。');
    return;
  }

  const header = sheet.getRange(headerRowNo, 1, 1, lastCol).getValues()[0].map(v => String(v || '').trim());
  const idx = {};
  for (let i = 0; i < header.length; i++) {
    if (header[i]) idx[header[i]] = i;
  }

  const mailStatusHeader = OPERATION_HEADERS[0];
  const calendarStatusHeader = OPERATION_HEADERS[1];
  const calendarEventIdHeader = OPERATION_HEADERS[4];
  const reservationIdHeader = RESERVATION_BASE_HEADERS[0];

  if (idx[CHECKBOX_HEADER] == null) throw new Error(`必須列が不足しています: ${CHECKBOX_HEADER}`);
  if (idx[mailStatusHeader] == null) throw new Error(`必須列が不足しています: ${mailStatusHeader}`);
  if (idx[calendarStatusHeader] == null) throw new Error(`必須列が不足しています: ${calendarStatusHeader}`);
  if (idx[calendarEventIdHeader] == null) throw new Error(`必須列が不足しています: ${calendarEventIdHeader}`);
  if (idx[reservationIdHeader] == null) throw new Error(`必須列が不足しています: ${reservationIdHeader}`);

  const checkboxCol = idx[CHECKBOX_HEADER] + 1;
  const mailStatusCol = idx[mailStatusHeader] + 1;
  const calendarStatusCol = idx[calendarStatusHeader] + 1;
  const calendarEventIdCol = idx[calendarEventIdHeader] + 1;
  const reservationIdCol = idx[reservationIdHeader] + 1;

  const mailStatusVals = sheet.getRange(dataStartRow, mailStatusCol, dataRowCount, 1).getValues();
  const calendarStatusVals = sheet.getRange(dataStartRow, calendarStatusCol, dataRowCount, 1).getValues();
  const calendarEventIdVals = sheet.getRange(dataStartRow, calendarEventIdCol, dataRowCount, 1).getValues();
  const reservationIdVals = sheet.getRange(dataStartRow, reservationIdCol, dataRowCount, 1).getValues();

  const setVals = [];
  let selected = 0;

  for (let i = 0; i < dataRowCount; i++) {
    const reservationId = String(reservationIdVals[i][0] || '').trim();
    if (!reservationId) {
      setVals.push([false]);
      continue;
    }

    const mailStatus = String(mailStatusVals[i][0] || '').trim().toUpperCase();
    const calendarStatus = String(calendarStatusVals[i][0] || '').trim().toUpperCase();
    const calendarEventId = String(calendarEventIdVals[i][0] || '').trim();

    const shouldCheck =
      (mailStatus !== 'SENT') ||
      (mailStatus === 'SENT' && calendarStatus === 'PENDING' && !calendarEventId);

    if (shouldCheck) selected++;
    setVals.push([shouldCheck]);
  }

  sheet.getRange(dataStartRow, checkboxCol, setVals.length, 1).setValues(setVals);
  uiNotify_(`チェックを全選択しました（データ行のみ / ${selected}件）`);
}

function uiNotify_(message) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(String(message), '予約管理', 6);
  } catch (e) {
    Logger.log('[ui_notify] ' + message);
  }
}
