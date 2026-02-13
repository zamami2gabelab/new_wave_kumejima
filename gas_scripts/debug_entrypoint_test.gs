function test_entrypoint_doPost_mock() {
  const dummy = {
    leader: { name: 'テスト太郎', email: 'test@example.com', phone: '09012345678' },
    reservationDate: '2026-02-10',
    productId: 'PLAN_NONBIRI',
    people: { adults: 1, children: 0, infants: 0, totalPeople: 1 },
    pickup: { required: false, hotelName: '', fee: 0 },
    participants: [{ name: '参加者A', age: 30 }],
    message: 'mock test',
    totals: { totalClientCalc: 12000 },
    apiKey: PropertiesService.getScriptProperties().getProperty('API_SECRET_KEY') // 正しいキー
  };

  const e = {
    postData: { contents: JSON.stringify(dummy) },
    parameter: {}
  };

  const res = doPost(e);
  Logger.log(res.getContent());
}
