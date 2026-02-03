/**
 * participants_repo.gs
 * 参加者シート（参加者）への保存を担当する
 *
 * 仕様:
 * - 参加者は最大99名
 * - 1参加者 = 1行
 * - 予約IDで紐付ける
 *
 * 列（ヘッダー）:
 * 予約ID / 参加者番号 / 参加者名 / 年齢
 */

const PARTICIPANT_HEADERS = ['予約ID', '参加者番号', '参加者名', '年齢'];

/**
 * 参加者を参加者シートに追記する
 * @param {string} reservationId
 * @param {Array<Object>} participants - [{name, age}, ...]
 */
function appendParticipants(reservationId, participants) {
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return; // 参加者なしなら何もしない
  }

  if (participants.length > 99) {
    throw new Error('参加者は最大99名まで受付可能です');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(PARTICIPANT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PARTICIPANT_SHEET_NAME);
  }

  ensureParticipantHeaders_(sheet);

  // まとめて行データを作る（1..n）
  const rows = participants.map((p, idx) => {
    const name = (p && p.name) ? String(p.name) : '';
    const age = (p && p.age !== undefined && p.age !== null) ? String(p.age) : '';
    return [reservationId, idx + 1, name, age];
  });

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, PARTICIPANT_HEADERS.length).setValues(rows);
}

/**
 * 参加者シートのヘッダーを保証する
 */
function ensureParticipantHeaders_(sheet) {
  const lastRow = sheet.getLastRow();

  // 空ならヘッダー作成
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, PARTICIPANT_HEADERS.length).setValues([PARTICIPANT_HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  // 既存ヘッダーを確認（最低限、先頭4列が一致しているか）
  const lastCol = sheet.getLastColumn();
  const firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, PARTICIPANT_HEADERS.length))
    .getValues()[0]
    .slice(0, PARTICIPANT_HEADERS.length)
    .map(v => String(v || '').trim());

  for (let i = 0; i < PARTICIPANT_HEADERS.length; i++) {
    if (firstRow[i] !== PARTICIPANT_HEADERS[i]) {
      throw new Error('参加者シートのヘッダーが想定外です。1行目を確認してください。');
    }
  }
}
