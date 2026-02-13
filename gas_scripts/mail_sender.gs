/**
 * mail_sender.gs（タイムアウト回避：alert禁止 / toast利用）
 */

const MAIL_BATCH_LIMIT = 20;
const MAIL_SLEEP_MS = 0;

function sendCheckedReservationEmails() {
  const start = Date.now();
  const lap = (label) => Logger.log(`[+${((Date.now() - start)/1000).toFixed(1)}s] ${label}`);

  lap('START sendCheckedReservationEmails');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  lap('lock acquired');

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
    if (!sheet) throw new Error('予約一覧シートが見つかりません');

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    lap(`lastRow=${lastRow}, lastCol=${lastCol}`);

    if (lastRow < 2) {
      notify_('データがありません。');
      return;
    }

    // ヘッダー
    const header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(v => String(v || '').trim());
    const idx = buildHeaderIndex_(header);

    const required = [
      CHECKBOX_HEADER,
      'メール状態',
      'メール送信日時',
      'メールエラー',
      '予約ID',
      '代表者名',
      'メールアドレス',
      '予約日',
      '商品名',
      '到着時間帯',
      '大人人数',
      '子供人数',
      '乳幼児人数',
      '合計人数',
      'ピックアップ必要',
      'ピックアップ場所名',
      'ピックアップ料金',
      'オプション合計金額',
      '弁当有無',
      '弁当数量',
      '弁当合計金額',
      'メッセージ',
      '見積もり合計金額',
    ];
    const missing = required.filter(h => idx[h] == null);
    if (missing.length) throw new Error('必須列が不足しています: ' + missing.join(', '));
    lap('Required columns OK');

    const checkboxCol = idx[CHECKBOX_HEADER] + 1;
    const mailStatusCol = idx['メール状態'] + 1;

    // A列とメール状態だけ読む
    const checkboxVals = sheet.getRange(2, checkboxCol, lastRow - 1, 1).getValues();
    const statusVals = sheet.getRange(2, mailStatusCol, lastRow - 1, 1).getValues();

    // 対象抽出
    const targetRowNumbers = [];
    for (let i = 0; i < checkboxVals.length; i++) {
      const checked = checkboxVals[i][0] === true;
      if (!checked) continue;

      const status = String(statusVals[i][0] || '').trim();
      if (status === 'SENT') continue;

      targetRowNumbers.push(i + 2);
      if (targetRowNumbers.length >= MAIL_BATCH_LIMIT) break;
    }
    lap(`Targets: ${targetRowNumbers.length}`);

    if (targetRowNumbers.length === 0) {
      notify_('チェックされた送信対象がありません（または既にSENTです）。');
      return;
    }

    // 先に SENDING
    const nowStr = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    for (const rowNo of targetRowNumbers) {
      sheet.getRange(rowNo, mailStatusCol).setValue('SENDING');
      sheet.getRange(rowNo, idx['メールエラー'] + 1).setValue('');
    }
    SpreadsheetApp.flush();
    lap('SENDING written + flush');

    // 送信
    let sent = 0;
    let failed = 0;

    for (const rowNo of targetRowNumbers) {
      const row = sheet.getRange(rowNo, 1, 1, lastCol).getValues()[0];
      const to = String(row[idx['メールアドレス']] || '').trim();

      if (!to) {
        sheet.getRange(rowNo, mailStatusCol).setValue('ERROR');
        sheet.getRange(rowNo, idx['メールエラー'] + 1).setValue('メールアドレスが空です');
        failed++;
        continue;
      }

      try {
        const info = buildReservationInfoFromRow_(row, idx);
        const subject = buildMailSubject_(info);
        const body = buildMailBody_(info);

        MailApp.sendEmail({ to, subject, body, name: 'New Wave久米島' });

        sheet.getRange(rowNo, mailStatusCol).setValue('SENT');
        sheet.getRange(rowNo, idx['メール送信日時'] + 1).setValue(nowStr);
        sheet.getRange(rowNo, idx['メールエラー'] + 1).setValue('');
        sheet.getRange(rowNo, checkboxCol).setValue(false);

        sent++;
        if (MAIL_SLEEP_MS > 0) Utilities.sleep(MAIL_SLEEP_MS);

      } catch (err) {
        sheet.getRange(rowNo, mailStatusCol).setValue('ERROR');
        sheet.getRange(rowNo, idx['メールエラー'] + 1).setValue(String(err));
        failed++;
      }
    }

    lap(`END sent=${sent} failed=${failed}`);
    notify_(`完了：成功${sent} / 失敗${failed}（今回${targetRowNumbers.length}件）`);

  } finally {
    try { lock.releaseLock(); } catch (e) {}
    lap('lock released');
  }
}

/**
 * 画面表示は “止まらない” toast を優先。無理なら Logger に落とす。
 */
function notify_(message) {
  try {
    // コンテナバインド（スプレッドシートからの実行）なら toast が出せる
    SpreadsheetApp.getActiveSpreadsheet().toast(String(message), '予約管理', 6);
  } catch (e) {
    Logger.log('[notify_] ' + message);
  }
}

/**
 * 1通だけメール送信テスト（権限確認用）
 */
function test_mail_only() {
  MailApp.sendEmail('あなたのメールアドレス', 'GAS mail test', 'test body');
}
