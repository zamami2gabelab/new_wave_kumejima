/**
 * entrypoint.gs
 * Webアプリの入口（doPost / doOptions）
 */

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    // 1) リクエストボディ存在チェック
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: 'リクエストボディが存在しません' });
    }

    // 2) JSONパース
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse_({ ok: false, error: 'JSONの形式が正しくありません: ' + err.toString() });
    }

    // 3) APIキー検証（security.gs）
    const sec = validateRequest(e, payload);
    if (!sec.valid) {
      return jsonResponse_({ ok: false, error: sec.error || 'アクセスが拒否されました' });
    }

    // 4) APIキーは保存しない
    delete payload.apiKey;

    // 5) payload検証（validators.gs）
    const v = validatePayload(payload);
    if (!v.valid) {
      return jsonResponse_({ ok: false, error: v.error || 'データの形式が正しくありません' });
    }

    // 6) 予約ID生成（id_generator.gs）
    const reservationId = generateReservationId();

    // 7) 排他開始（同時書き込み事故防止）
    lock.waitLock(30000); // 最大30秒待つ

    // 8) rowData作成（mappers.gs）
    const rowData = convertPayloadToRow(payload, reservationId);

    // 9) 予約一覧へ保存（repository.gs）
    appendReservationRow(rowData);

    // 10) 参加者へ保存（participants_repo.gs）
    // ※参加者が無ければ appendParticipants 内部で何もしない
    appendParticipants(reservationId, payload.participants || []);

    // 11) 成功レスポンス
    return jsonResponse_({ ok: true, reservationId });

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + (error.stack || 'no stack'));

    return jsonResponse_({ ok: false, error: '予約の送信に失敗しました: ' + error.toString() });

  } finally {
    // 12) 排他解除
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * JSONレスポンスを返す共通関数
 */
function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
