/**
 * mail_preview.gs
 * チェック済みの送信対象をプレビュー表示 → OKなら送信
 */

function previewAndSendCheckedEmails() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) throw new Error('予約一覧シートが見つかりません');

  // ヘッダー保証（A列チェック列含む）
  ensureReservationHeaders(sheet);

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('データがありません。');
    return;
  }

  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const header = values[0].map(v => String(v || '').trim());
  const idx = buildHeaderIndex_(header);

  // 必須
  const required = [
    CHECKBOX_HEADER,
    'メール状態',
    '予約ID',
    '代表者名',
    'メールアドレス',
    '予約日',
    '商品名',
    '合計人数',
    '見積もり合計金額',
  ];
  const missing = required.filter(h => idx[h] == null);
  if (missing.length) throw new Error('必須列が不足しています: ' + missing.join(', '));

  // チェック済み抽出（SENT除外）
  const targets = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const checked = row[idx[CHECKBOX_HEADER]] === true;
    if (!checked) continue;

    const status = String(row[idx['メール状態']] || '').trim();
    if (status === 'SENT') continue;

    targets.push({ r, row });
  }

  if (targets.length === 0) {
    SpreadsheetApp.getUi().alert('チェックされた送信対象がありません（または既にSENTです）。');
    return;
  }

  // プレビュー文字列（簡潔）
  const lines = [];
  lines.push(`送信対象: ${targets.length} 件`);
  lines.push('');
  lines.push('【送信一覧】');
  lines.push('（予約ID / 宛先 / 日付 / 商品 / 人数 / 合計）');
  lines.push('----------------------------------------');

  for (const t of targets) {
    const row = t.row;
    const reservationId = String(row[idx['予約ID']] || '');
    const email = String(row[idx['メールアドレス']] || '');
    const date = String(row[idx['予約日']] || '');
    const product = String(row[idx['商品名']] || '');
    const people = Number(row[idx['合計人数']] || 0);
    const total = Number(row[idx['見積もり合計金額']] || 0);

    lines.push(`${reservationId} / ${email}`);
    lines.push(`  ${date} / ${product} / ${people}名 / ¥${total.toLocaleString()}`);
    lines.push('');
  }

  // 確認ダイアログ（OKなら送信）
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'メール送信プレビュー',
    lines.join('\n'),
    ui.ButtonSet.OK_CANCEL
  );

  if (result !== ui.Button.OK) {
    ui.alert('送信をキャンセルしました。');
    return;
  }

  // OKなら既存の送信処理を実行
  sendCheckedReservationEmails();
}
