/**
 * repository.gs（重いinsertCheckboxesを毎回しない版）
 *
 * 役割：
 * - 予約一覧シートのヘッダー保証（移行が必要なときだけ実施）
 * - appendReservationRow：予約一覧へ1行追加（追加した行だけチェックボックス適用）
 *
 * 前提（config.gs）：
 * - SPREADSHEET_ID
 * - RESERVATION_SHEET_NAME
 * - CHECKBOX_HEADER  // '送信対象'
 * - OPERATION_HEADERS
 * - RESERVATION_HEADERS
 * - TIMEZONE
 */

/**
 * 予約一覧に1行追加
 * @param {Array} rowData - RESERVATION_HEADERS と同じ列数/順序の配列
 */
function getReservationDataStartRow_() {
  return RESERVATION_HEADER_ROW + 1;
}

function getReservationDataRowCount_(sheet) {
  return Math.max(0, sheet.getLastRow() - RESERVATION_HEADER_ROW);
}

function appendReservationRow(rowData) {
  if (!Array.isArray(rowData)) {
    throw new Error('appendReservationRow: rowData が配列ではありません');
  }

  // 互換：旧mapperが「チェック列なし」で返す場合、先頭に false を足す
  if (rowData.length === RESERVATION_HEADERS.length - 1) {
    rowData = [false].concat(rowData);
  }

  if (rowData.length !== RESERVATION_HEADERS.length) {
    throw new Error(
      `appendReservationRow: 列数不一致です rowData=${rowData.length} / headers=${RESERVATION_HEADERS.length}`
    );
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(RESERVATION_SHEET_NAME);

  // ヘッダー保証（移行が必要な場合のみ実施）
  ensureReservationHeaders(sheet);

  // 1行追加（setValuesで安全に）
  const nextRow = sheet.getLastRow() + 1;
  sheet.getRange(nextRow, 1, 1, RESERVATION_HEADERS.length).setValues([rowData]);

  // 型付き列（テーブル列）では insertCheckboxes が失敗することがあるため安全化
  try {
    sheet.getRange(nextRow, 1, 1, 1).insertCheckboxes();
  } catch (err) {
    Logger.log('[appendReservationRow] skip insertCheckboxes row=' + nextRow + ' err=' + String(err));
  }
}

/**
 * 予約一覧シートのヘッダーを保証（自動移行も実施）
 *
 * ※重要：ここでは「大量行へのinsertCheckboxes」はしない
 * （初回セットアップ用の関数で一括適用する）
 */
function ensureReservationHeaders(sheet) {
  if (!sheet) throw new Error('ensureReservationHeaders: sheet が未指定です');

  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), RESERVATION_HEADERS.length);

  // 1) 空シート → ヘッダー作成
  if (lastRow === 0) {
    sheet.getRange(RESERVATION_HEADER_ROW, 1, 1, RESERVATION_HEADERS.length).setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(RESERVATION_HEADER_ROW);
    return;
  }

  // ヘッダー取得
  const headerRow = sheet.getRange(RESERVATION_HEADER_ROW, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);

  // 2) 完全一致ならOK（ここでチェックボックスの一括適用はしない）
  if (isHeaderPerfectMatch_(headerRow, RESERVATION_HEADERS)) {
    sheet.setFrozenRows(RESERVATION_HEADER_ROW);
    return;
  }

  // 3) 未運用前提: ヘッダー行のみ存在する場合は現在定義で上書き
  if (lastRow === RESERVATION_HEADER_ROW) {
    sheet.getRange(RESERVATION_HEADER_ROW, 1, 1, RESERVATION_HEADERS.length).setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(RESERVATION_HEADER_ROW);
    return;
  }

  // 4) 想定外
  throw new Error(
    '予約一覧シートのヘッダーが想定外です。' +
    `未運用のシートであれば${RESERVATION_HEADER_ROW}行目以外のデータを削除して再実行してください。`
  );
}

/**
 * ✅ 初回セットアップ専用：A列（送信対象）にチェックボックスを一括適用
 * ※重いので「必要なときだけ」手動で実行する想定
 */
function setupCheckboxesForAllRows() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  ensureReservationHeaders(sheet);

  const dataStartRow = getReservationDataStartRow_();
  const dataRowCount = getReservationDataRowCount_(sheet);
  if (dataRowCount <= 0) return;

  // 型付き列（テーブル列）では insertCheckboxes が失敗することがあるため安全化
  try {
    sheet.getRange(dataStartRow, 1, dataRowCount, 1).insertCheckboxes();
  } catch (err) {
    Logger.log('[setupCheckboxesForAllRows] skip insertCheckboxes err=' + String(err));
  }
}

/**
 * A列（送信対象）の既存値を false で初期化
 */
function initializeCheckboxValues_(sheet) {
  const dataStartRow = getReservationDataStartRow_();
  const dataRowCount = getReservationDataRowCount_(sheet);
  if (dataRowCount <= 0) return;
  sheet.getRange(dataStartRow, 1, dataRowCount, 1).setValue(false);
}

/**
 * ヘッダー完全一致判定
 */
function isHeaderPerfectMatch_(actualRow, expectedHeaders) {
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (normalizeHeader_(actualRow[i]) !== normalizeHeader_(expectedHeaders[i])) return false;
  }
  return true;
}

/**
 * ヘッダー正規化
 */
function normalizeHeader_(v) {
  return String(v || '').replace(/\u3000/g, ' ').trim();
}
