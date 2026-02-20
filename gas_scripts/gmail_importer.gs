/**
 * gmail_importer.gs
 * Import reservation confirmation emails (Jalan / Activity Japan) into reservation sheet.
 *
 * Notes:
 * - Reuses existing appendReservationRow() to keep header/order compatibility.
 * - Imported rows are marked mailStatus=SENT to avoid accidental outbound mail.
 * - Calendar status is left as INITIAL_CALENDAR_STATUS so calendar creation can still be used.
 */

const IMPORT_PROCESSED_LABEL = 'processed/reservation-import';
const IMPORT_SEARCH_WINDOW_DAYS = 30;
const IMPORT_BATCH_THREADS = 50;
const IMPORT_USE_GMAIL_LABEL = true;

function importReservationEmailsFromGmail() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const processedLabel = getProcessedLabelSafely_();
    let query = buildImportQuery_(true);
    let threads = GmailApp.search(query, 0, IMPORT_BATCH_THREADS);
    let usedFallbackQuery = false;
    if (threads.length === 0) {
      // Fallback for manual tests where sender domain is not production domain.
      query = buildImportQuery_(false);
      threads = GmailApp.search(query, 0, IMPORT_BATCH_THREADS);
      usedFallbackQuery = true;
    }

    const existingIds = loadExistingReservationIds_();
    let imported = 0;
    let skipped = 0;

    for (const thread of threads) {
      const messages = thread.getMessages();
      for (const msg of messages) {
        const parsed = parseReservationMail_(msg);
        if (!parsed) {
          continue;
        }

        if (!parsed.reservationNo) {
          skipped++;
          addProcessedLabelSafely_(msg, processedLabel);
          continue;
        }

        const reservationId = toExternalReservationId_(parsed.source, parsed.reservationNo);
        if (existingIds.has(reservationId)) {
          skipped++;
          addProcessedLabelSafely_(msg, processedLabel);
          continue;
        }

        const rowData = convertImportedMailToRow_(parsed, reservationId, msg);
        appendReservationRow(rowData);
        existingIds.add(reservationId);

        // Participant details are usually not complete in platform emails.
        appendParticipants(reservationId, []);

        addProcessedLabelSafely_(msg, processedLabel);
        imported++;
      }
    }

    const mode = usedFallbackQuery ? 'fallback' : 'strict';
    uiNotify_(`Gmail取込(${mode}): スレッド ${threads.length} / 追加 ${imported} / スキップ ${skipped}`);
  } catch (error) {
    Logger.log('[gmail_importer] ' + String(error));
    throw error;
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function installReservationMailImportTrigger() {
  const fn = 'importReservationEmailsFromGmail';
  const triggers = ScriptApp.getProjectTriggers();
  for (const t of triggers) {
    if (t.getHandlerFunction() === fn) {
      ScriptApp.deleteTrigger(t);
    }
  }
  ScriptApp.newTrigger(fn).timeBased().everyMinutes(10).create();
}

function parseReservationMail_(msg) {
  const subject = String(msg.getSubject() || '');
  const body = String(msg.getPlainBody() || '');
  const from = String(msg.getFrom() || '');
  const text = `${subject}\n${body}\n${from}`;

  if (text.match(/じゃらん|ACTIVITY BOARD|acb\.jalan\.net/i)) {
    return parseJalanMail_(subject, body);
  }
  if (text.match(/アクティビティジャパン|activityjapan/i)) {
    return parseActivityJapanMail_(subject, body);
  }
  return null;
}

function parseJalanMail_(subject, body) {
  const reservationNo = pickFirst_(body, [
    /予約番号[：:]\s*([A-Z0-9-]+)/,
  ]);
  const useDateRaw = pickFirst_(body, [
    /利用日時[：:]\s*([^\n]+)/,
  ]);
  const reservationDate = normalizeDateFromJpText_(useDateRaw);

  const adults = toNumber_(pickFirst_(body, [/大人[：:]\s*(\d+)\s*名/, /大人[^\d]*(\d+)\s*名/]));
  const children = toNumber_(pickFirst_(body, [/お子様[：:]\s*(\d+)\s*名/, /子供[^\d]*(\d+)\s*名/]));
  const totalPeople = toNumber_(pickFirst_(body, [/人数[：:]\s*(\d+)\s*名/])) || adults + children;

  return {
    source: 'JALAN',
    reservationNo,
    reservationDate,
    leaderName: pickFirst_(body, [/体験者氏名[：:]\s*([^\n]+)/]),
    phone: pickFirst_(body, [/電話番号[：:]\s*([0-9\-]+)/]),
    email: pickFirst_(body, [/メールアドレス[：:]\s*([^\s\n]+)/]),
    productId: 'EXT_JALAN',
    productName: pickFirst_(body, [/プラン名[：:]\s*([^\n]+)/]) || 'じゃらん予約',
    adults,
    children,
    infants: 0,
    totalPeople: totalPeople || 0,
    totalClientCalc: toNumber_(pickFirst_(body, [/合計料金.*?[：:]\s*([0-9,]+)\s*円/])),
    paymentMethod: pickFirst_(body, [/支払方法[：:]\s*([^\n]+)/]),
    statusText: pickFirst_(body, [/予約が確定しました/]) ? '確定' : '',
  };
}

function parseActivityJapanMail_(subject, body) {
  const reservationNo = pickFirst_(body, [
    /予約番号[：:]\s*([0-9-]+)/,
  ]);
  const dateRaw = pickFirst_(body, [
    /日時[：:]\s*([^\n]+)/,
  ]);
  const reservationDate = normalizeDateFromJpText_(dateRaw);

  const adults = toNumber_(pickFirst_(body, [/大人[^x×]*[x×]\s*(\d+)/i, /大人.*?×\s*(\d+)/]));
  const totalPeople = adults || 0;

  const statusText = body.match(/仮予約/) ? '仮予約' : (body.match(/確定/) ? '確定' : '');

  return {
    source: 'ACTIVITY_JAPAN',
    reservationNo,
    reservationDate,
    leaderName: pickFirst_(body, [/氏名[：:]\s*([^\n]+)/]),
    phone: pickFirst_(body, [/電話番号[：:]\s*([0-9\-]+)/]),
    email: '',
    productId: 'EXT_ACTIVITY_JAPAN',
    productName: pickFirst_(body, [/プラン名（コース名）[：:]\s*([^\n]+)/]) || 'アクティビティジャパン予約',
    adults,
    children: 0,
    infants: 0,
    totalPeople,
    totalClientCalc: toNumber_(pickFirst_(body, [/お客様へのご請求料金[：:]\s*([0-9,]+)\s*円/, /合計料金[：:]\s*([0-9,]+)\s*円/])),
    paymentMethod: pickFirst_(body, [/支払方法[：:]\s*([^\n]+)/]),
    statusText,
  };
}

function convertImportedMailToRow_(parsed, reservationId, msg) {
  const receivedDateTime = Utilities.formatDate(msg.getDate(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  const importedAt = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

  const ops = [
    'SENT',
    importedAt,
    'imported-from-gmail',
    INITIAL_CALENDAR_STATUS,
    '',
    '',
    '',
  ];

  const notes = [
    `source=${parsed.source || ''}`,
    `status=${parsed.statusText || ''}`,
    `payment=${parsed.paymentMethod || ''}`,
    `gmailMessageId=${msg.getId()}`,
    `gmailThreadId=${msg.getThread().getId()}`,
  ].join(' | ');

  const base = [
    reservationId,
    receivedDateTime,
    parsed.leaderName || '',
    parsed.phone || '',
    parsed.email || '',
    parsed.reservationDate || '',
    parsed.productId || '',
    parsed.productName || '',
    Number(parsed.adults || 0),
    Number(parsed.children || 0),
    Number(parsed.infants || 0),
    Number(parsed.totalPeople || 0),
    'いいえ',
    '',
    notes,
    Number(parsed.totalClientCalc || 0),
  ];

  const rowData = ops.concat(base);
  if (rowData.length !== RESERVATION_HEADERS.length - 1) {
    throw new Error(
      `convertImportedMailToRow_: row length mismatch rowData=${rowData.length} headers=${RESERVATION_HEADERS.length}`
    );
  }
  return rowData;
}

function buildImportQuery_(useSenderFilter) {
  const parts = [
    `newer_than:${IMPORT_SEARCH_WINDOW_DAYS}d`,
    `-label:${IMPORT_PROCESSED_LABEL}`,
    '(予約番号 OR ACTIVITY BOARD OR アクティビティジャパン OR じゃらん)',
  ];
  if (useSenderFilter) {
    parts.push('(from:(r.recruit.co.jp) OR from:(acb.jalan.net) OR from:(activityjapan.com))');
  }
  return parts.join(' ');
}

function loadExistingReservationIds_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RESERVATION_SHEET_NAME);
  if (!sheet) return new Set();

  ensureReservationHeaders(sheet);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return new Set();

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(v => String(v || '').trim());
  const idx = buildHeaderIndex_(headers);
  if (idx['予約ID'] == null) return new Set();

  const col = idx['予約ID'] + 1;
  const values = sheet.getRange(2, col, lastRow - 1, 1).getValues();
  const ids = new Set();
  for (const r of values) {
    const id = String(r[0] || '').trim();
    if (id) ids.add(id);
  }
  return ids;
}

function toExternalReservationId_(source, reservationNo) {
  if (source === 'JALAN') return `EXT-JALAN-${reservationNo}`;
  if (source === 'ACTIVITY_JAPAN') return `EXT-AJ-${reservationNo}`;
  return `EXT-${reservationNo}`;
}

function normalizeDateFromJpText_(text) {
  const s = String(text || '').trim();
  if (!s) return '';

  // 2025/08/14(木) 09:00～12:00
  let m = s.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return `${m[1]}-${pad2_(m[2])}-${pad2_(m[3])}`;
  }

  // 2025年07月20日
  m = s.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (m) {
    return `${m[1]}-${pad2_(m[2])}-${pad2_(m[3])}`;
  }
  return '';
}

function getOrCreateGmailLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function getProcessedLabelSafely_() {
  if (!IMPORT_USE_GMAIL_LABEL) return null;
  try {
    return getOrCreateGmailLabel_(IMPORT_PROCESSED_LABEL);
  } catch (error) {
    Logger.log('[gmail_importer] label disabled due to insufficient Gmail label permission: ' + String(error));
    return null;
  }
}

function addProcessedLabelSafely_(msg, label) {
  if (!label) return;
  try {
    msg.addLabel(label);
  } catch (error) {
    Logger.log('[gmail_importer] failed to add label: ' + String(error));
  }
}

function pickFirst_(text, patterns) {
  const src = String(text || '');
  for (const p of patterns) {
    const m = src.match(p);
    if (!m) continue;
    if (m[1] != null) return String(m[1]).trim();
    return String(m[0]).trim();
  }
  return '';
}

function toNumber_(v) {
  const s = String(v || '').replace(/,/g, '').trim();
  if (!s) return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function pad2_(v) {
  return String(v).padStart(2, '0');
}
