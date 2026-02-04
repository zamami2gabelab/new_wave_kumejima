function test_ensureReservationHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません: ' + RESERVATION_SHEET_NAME);

  ensureReservationHeaders(sheet);
  Logger.log('✅ ensureReservationHeaders OK');
}
