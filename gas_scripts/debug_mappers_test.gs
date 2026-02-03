/**
 * debug_mapper_test.gs
 * Step0-6(mappers.gs) の単体テスト
 *
 * 目的:
 * - convertPayloadToRow が 41列の rowData を返すことを確認
 * - repository.gs の appendReservationRow に渡して 1行追加できることを確認
 *
 * 注意:
 * - 実行すると「予約一覧」にテスト行が追加されます（本番シートなら要注意）
 * - テスト後は必要なら行を削除してください
 */

function test_mapper_convertPayloadToRow_only() {
  const payload = buildDummyPayload_();
  const reservationId = 'TEST-MAPPER-ONLY';
  const rowData = convertPayloadToRow(payload, reservationId);

  Logger.log('rowData length = ' + rowData.length);
  Logger.log('headers length = ' + RESERVATION_HEADERS.length);

  if (rowData.length !== RESERVATION_HEADERS.length) {
    throw new Error(
      `テスト失敗: rowData.length=${rowData.length} / headers=${RESERVATION_HEADERS.length}`
    );
  }

  Logger.log('✅ convertPayloadToRow 単体テストOK');
}

function test_mapper_to_repository_appendRow() {
  const payload = buildDummyPayload_();
  const reservationId = 'TEST-MAPPER-APPEND';
  const rowData = convertPayloadToRow(payload, reservationId);

  Logger.log('rowData length = ' + rowData.length);
  Logger.log('headers length = ' + RESERVATION_HEADERS.length);

  if (rowData.length !== RESERVATION_HEADERS.length) {
    throw new Error(
      `テスト失敗: rowData.length=${rowData.length} / headers=${RESERVATION_HEADERS.length}`
    );
  }

  appendReservationRow(rowData);
  Logger.log('✅ repository への追記までOK（予約一覧にテスト行が追加されました）');
}

/**
 * テスト用のダミー payload を作る（validatePayload を満たす最低限＋少しオプション）
 */
function buildDummyPayload_() {
  return {
    apiKey: 'DUMMY_API_KEY_SHOULD_BE_DELETED_IN_doPost', // doPostで削除される想定（ここでは残してOK）
    leader: {
      name: 'テスト太郎',
      email: 'test@example.com',
      phone: '09012345678'
    },
    reservationDate: '2026-02-10',
    transportType: 'PLAN_WITH_BOAT',
    productId: 'PLAN_WAKUWAKU',
    arrivalSlot: 'AM',
    people: {
      adults: 2,
      children: 1,
      infants: 0,
      totalPeople: 3
    },
    pickup: {
      required: true,
      placeId: 'PICK_EEF',
      fee: 1000
    },
    options: [
      { optionId: 'OPT_SNORKEL_SET', qty: 2, unitPrice: 1000 },
      { optionId: 'OPT_BANANA_BOAT', qty: 1, unitPrice: 3000 }
    ],
    bento: {
      enabled: true,
      qty: 3,
      unitPrice: 800
    },
    participants: [
      { name: '参加者A', age: 30 },
      { name: '参加者B', age: 28 },
      { name: '参加者C', age: 7 }
    ],
    message: 'テスト送信です',
    totals: {
      totalClientCalc: 12000
    }
  };
}
