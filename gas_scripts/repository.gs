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

  // ✅ 追加した行のA列だけチェックボックスにする（軽い）
  sheet.getRange(nextRow, 1, 1, 1).insertCheckboxes();
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
    sheet.getRange(1, 1, 1, RESERVATION_HEADERS.length).setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  // ヘッダー取得
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(normalizeHeader_);

  // 2) 完全一致ならOK（ここでチェックボックスの一括適用はしない）
  if (isHeaderPerfectMatch_(headerRow, RESERVATION_HEADERS)) {
    sheet.setFrozenRows(1);
    return;
  }

  // 3) 旧形式（先頭が予約ID）→ チェック列 + 運用列を先頭に追加
  if (headerRow[0] === '予約ID') {
    const addCols = 1 + OPERATION_HEADERS.length;
    sheet.insertColumnsBefore(1, addCols);
    sheet.getRange(1, 1, 1, RESERVATION_HEADERS.length).setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(1);

    // A列は false 初期化
    initializeCheckboxValues_(sheet);
    return;
  }

  // 4) 既存運用（先頭がメール状態）→ A列チェック列だけ追加
  if (headerRow[0] === 'メール状態') {
    sheet.insertColumnsBefore(1, 1);
    sheet.getRange(1, 1, 1, RESERVATION_HEADERS.length).setValues([RESERVATION_HEADERS]);
    sheet.setFrozenRows(1);

    // A列は false 初期化
    initializeCheckboxValues_(sheet);
    return;
  }

  // 5) 想定外
  throw new Error(
    '予約一覧シートのヘッダーが想定外です。' +
    '1行目が「送信対象」or「予約ID」or「メール状態」になっているか確認してください。'
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

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // ここが重い処理：必要なときだけ実行
  sheet.getRange(2, 1, lastRow - 1, 1).insertCheckboxes();
}

/**
 * A列（送信対象）の既存値を false で初期化
 */
function initializeCheckboxValues_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  sheet.getRange(2, 1, lastRow - 1, 1).setValue(false);
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
