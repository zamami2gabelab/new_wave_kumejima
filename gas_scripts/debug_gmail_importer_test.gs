/**
 * debug_gmail_importer_test.gs
 * gmail_importer.gs の主要ロジックを手動実行で確認するテスト。
 */

function test_gmailImporter_parseJalanMail() {
  const body = [
    '予約番号：31GXYTYYG',
    '利用日時：2025/08/14(木) 09:00～12:00',
    'プラン名：【☆はての浜でわくわくプラン☆】沖合ポイントシュノーケリング',
    '人数：2名  (大人:2名、お子様:0名)',
    '支払方法：現地払い',
    '合計料金(税込)：17,600円',
    '体験者氏名：ＫＡＤＯＷＡＫＩ  ＹＯＳＨＩＭＩ(カドワキ　ヨシミ)様',
    'メールアドレス：tter443@ybb.ne.jp',
    '電話番号：09024150542',
    '予約が確定しました。',
  ].join('\n');

  const parsed = parseJalanMail_('', body);
  assertEquals_('JALAN', parsed.source, 'source');
  assertEquals_('31GXYTYYG', parsed.reservationNo, 'reservationNo');
  assertEquals_('2025-08-14', parsed.reservationDate, 'reservationDate');
  assertEquals_('09024150542', parsed.phone, 'phone');
  assertEquals_('tter443@ybb.ne.jp', parsed.email, 'email');
  assertEquals_(2, parsed.adults, 'adults');
  assertEquals_(0, parsed.children, 'children');
  assertEquals_(2, parsed.totalPeople, 'totalPeople');
  assertEquals_(17600, parsed.totalClientCalc, 'totalClientCalc');
  Logger.log('OK: test_gmailImporter_parseJalanMail');
}

function test_gmailImporter_parseActivityJapanMail() {
  const body = [
    '予約番号：2507180844919',
    '日時：2025年07月20日',
    '氏名：清川　美季(キヨカワ　ミキ)',
    '電話番号：08020224071',
    'プラン名（コース名）：【はての浜、久米島】選べる滞在時間！行くだけプラン',
    '予約人数：',
    '　大人（16歳以上）×2 人',
    '合計料金　　：21,000円',
    'お客様へのご請求料金：21,000円（税込）',
    '支払方法：PayPay（ペイペイ）',
    '仮予約',
  ].join('\n');

  const parsed = parseActivityJapanMail_('', body);
  assertEquals_('ACTIVITY_JAPAN', parsed.source, 'source');
  assertEquals_('2507180844919', parsed.reservationNo, 'reservationNo');
  assertEquals_('2025-07-20', parsed.reservationDate, 'reservationDate');
  assertEquals_('08020224071', parsed.phone, 'phone');
  assertEquals_(2, parsed.adults, 'adults');
  assertEquals_(2, parsed.totalPeople, 'totalPeople');
  assertEquals_(21000, parsed.totalClientCalc, 'totalClientCalc');
  assertEquals_('仮予約', parsed.statusText, 'statusText');
  Logger.log('OK: test_gmailImporter_parseActivityJapanMail');
}

function test_gmailImporter_convertImportedMailToRow() {
  const parsed = {
    source: 'JALAN',
    reservationNo: '31GXYTYYG',
    reservationDate: '2025-08-14',
    leaderName: 'テスト太郎',
    phone: '09011112222',
    email: 'test@example.com',
    productId: 'EXT_JALAN',
    productName: 'じゃらん予約',
    adults: 2,
    children: 0,
    infants: 0,
    totalPeople: 2,
    totalClientCalc: 17600,
    paymentMethod: '現地払い',
    statusText: '確定',
  };
  const reservationId = toExternalReservationId_(parsed.source, parsed.reservationNo);
  const msg = buildDummyMessageForImporterTest_();

  const rowData = convertImportedMailToRow_(parsed, reservationId, msg);
  if (rowData.length !== RESERVATION_HEADERS.length - 1) {
    throw new Error(
      'row length mismatch: rowData=' + rowData.length + ' headers=' + RESERVATION_HEADERS.length
    );
  }

  // 先頭7列は運用列（チェック列は appendReservationRow 側で自動補完）
  assertEquals_('SENT', rowData[0], 'mail status');
  assertEquals_('imported-from-gmail', rowData[2], 'mail error marker');
  assertEquals_('PENDING', rowData[3], 'calendar status');

  Logger.log('OK: test_gmailImporter_convertImportedMailToRow');
}

function test_gmailImporter_runAll() {
  test_gmailImporter_parseJalanMail();
  test_gmailImporter_parseActivityJapanMail();
  test_gmailImporter_convertImportedMailToRow();
  Logger.log('OK: test_gmailImporter_runAll');
}

function buildDummyMessageForImporterTest_() {
  const fixedDate = new Date('2026-02-20T10:00:00+09:00');
  return {
    getDate: function() { return fixedDate; },
    getId: function() { return 'dummy-message-id'; },
    getThread: function() {
      return {
        getId: function() { return 'dummy-thread-id'; }
      };
    }
  };
}

function assertEquals_(expected, actual, label) {
  if (expected !== actual) {
    throw new Error(
      'assert failed [' + label + ']: expected=' + String(expected) + ' actual=' + String(actual)
    );
  }
}

