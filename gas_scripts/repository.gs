/**
 * repository.gs
 * 予約一覧シートへの入出力を担当する
 */

/**
 * 予約一覧に1行追加する
 * @param {Array} rowData - config.gs の RESERVATION_HEADERS と同じ順序の配列
 */
function appendReservationRow(rowData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(RESERVATION_SHEET_NAME);
  }

  ensureReservationHeaders(sheet);

  const nextRow = sheet.getLastRow() + 1;
  sheet
    .getRange(nextRow, 1, 1, RESERVATION_HEADERS.length)
    .setValues([rowData]);
}

/**
 * 予約一覧シートのヘッダーを保証する
 * - 正しい → 何もしない
 * - 旧形式 → 運用列を先頭に追加して修正
 * - 想定外 → エラーで止める（事故防止）
 */
function ensureReservationHeaders(sheet) {
  const lastRow = sheet.getLastRow();

  // シートが空なら新規ヘッダー作成
  if (lastRow === 0) {
    sheet
      .getRange(1, 1, 1, RESERVATION_HEADERS.length)
      .setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const lastCol = sheet.getLastColumn();
  const firstRowValues = sheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(v => String(v).trim());

  // すでに正しいヘッダーかチェック（左から一致）
  let isCorrect = true;
  for (let i = 0; i < RESERVATION_HEADERS.length; i++) {
    if (firstRowValues[i] !== RESERVATION_HEADERS[i]) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    return;
  }

  // 旧形式（先頭が予約ID）の場合は自動移行
  if (firstRowValues[0] === '予約ID') {
    sheet.insertColumnsBefore(1, OPERATION_HEADERS.length);
    sheet
      .getRange(1, 1, 1, RESERVATION_HEADERS.length)
      .setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  // それ以外は想定外（手動確認）
  throw new Error(
    '予約一覧シートのヘッダーが想定外です。手動で1行目を確認してください。'
  );
}
