/**
 * Google Apps Script サンプルコード
 * 予約フォームから送信されたデータをスプレッドシートに追加する
 * 
 * 使用方法:
 * 1. Google Apps Script エディタでこのコードを貼り付け
 * 2. doPost 関数をWebアプリとして公開
 * 3. 公開URLをVITE_GAS_ENDPOINT環境変数に設定
 */

// スプレッドシートのIDを設定（スプレッドシートのURLから取得）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = '予約一覧';

// セキュリティ設定
// APIキー（GASのスクリプトプロパティまたは環境変数で設定推奨）
// スクリプトプロパティの設定方法: エディタ → プロジェクトの設定 → スクリプト プロパティ
const API_SECRET_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // 長いランダムな文字列を設定（例: 32文字以上）

// 許可されたオリジン（リファラーチェック用）
// 本番環境のドメインと開発環境のlocalhostを許可
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',        // 本番環境のドメイン
  'http://localhost:5173',         // 開発環境
  'http://127.0.0.1:5173',         // 開発環境（別形式）
  // 必要に応じて追加
];

/**
 * CORSプリフライトリクエスト（OPTIONS）を処理
 * ブラウザからのCORSチェックに応答
 * 
 * 注意: text/plain形式を使用することで、プリフライトリクエストが不要になる場合があります。
 * ただし、念のためこの関数を残しています。
 * 
 * 重要: GASのWebアプリでは、doOptions関数が正しく動作しない場合があります。
 * その場合は、Webアプリの設定で「全員」にアクセス権限を付与することで、
 * GASが自動的にCORSヘッダーを追加します。
 */
function doOptions(e) {
  // GASのWebアプリでは、ContentServiceで直接CORSヘッダーを設定できません
  // Webアプリの設定で「全員」にアクセス権限を付与することで、
  // GASが自動的にCORSヘッダーを追加します
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Webアプリのエントリーポイント
 * POSTリクエストを受け取り、スプレッドシートにデータを追加
 */
function doPost(e) {
  try {
    // リクエストボディの存在確認
    if (!e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: 'リクエストボディが存在しません'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // text/plain形式で受け取ったJSON文字列をパース
    let payload;
    try {
      // text/plain形式で送信されたJSON文字列をパース
      const requestData = e.postData.contents;
      payload = JSON.parse(requestData);
    } catch (parseError) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: 'JSONの形式が正しくありません: ' + parseError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // セキュリティチェック
    const securityCheck = validateRequest(e, payload);
    if (!securityCheck.valid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: securityCheck.error || 'アクセスが拒否されました'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // APIキーをペイロードから削除（セキュリティのため、スプレッドシートに保存しない）
    delete payload.apiKey;
    
    // データバリデーション
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: validation.error || 'データの形式が正しくありません'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 予約IDを生成（例: RES-20240101-001）
    const reservationId = generateReservationId();
    
    // スプレッドシートにデータを追加
    try {
      const rowData = convertPayloadToRow(payload, reservationId);
      appendToSpreadsheet(rowData);
      
      // ログに記録（デバッグ用）
      Logger.log('Reservation saved successfully. ID: ' + reservationId);
      
      // 成功レスポンスを返す
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: true,
          reservationId: reservationId
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (spreadsheetError) {
      // スプレッドシートへの書き込みエラー
      Logger.log('Spreadsheet error: ' + spreadsheetError.toString());
      Logger.log('Spreadsheet error stack: ' + spreadsheetError.stack);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: 'スプレッドシートへの書き込みに失敗しました: ' + spreadsheetError.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    // エラーログを記録
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // エラーレスポンスを返す（デバッグ用に詳細なエラー情報を含める）
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: '予約の送信に失敗しました: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * リクエストのセキュリティ検証
 */
function validateRequest(e, payload) {
  // APIキーの検証
  let apiKey = null;
  
  // ペイロードから取得（既にパース済み）
  if (payload && payload.apiKey) {
    apiKey = payload.apiKey;
  }
  
  // GETリクエストの場合、クエリパラメータから取得
  if (!apiKey && e.parameter && e.parameter.apiKey) {
    apiKey = e.parameter.apiKey;
  }
  
  if (!apiKey || apiKey !== API_SECRET_KEY) {
    return { valid: false, error: 'APIキーが無効です' };
  }
  
  // 注意: GASのWebアプリではリファラーヘッダーを直接取得できないため、
  // APIキー認証を主なセキュリティ対策として使用します
  // リファラーチェックが必要な場合は、ペイロードにoriginを含める方法を検討
  
  return { valid: true };
}


/**
 * ペイロードのバリデーション
 */
function validatePayload(payload) {
  // 必須フィールドのチェック
  if (!payload.leader || !payload.leader.name || !payload.leader.email || !payload.leader.phone) {
    return { valid: false, error: '代表者情報が不足しています' };
  }
  
  if (!payload.reservationDate) {
    return { valid: false, error: '予約日が指定されていません' };
  }
  
  if (!payload.transportType || !payload.productId) {
    return { valid: false, error: '商品情報が不足しています' };
  }
  
  if (!payload.people || !payload.people.totalPeople || payload.people.totalPeople <= 0) {
    return { valid: false, error: '人数情報が不正です' };
  }
  
  // メールアドレスの形式チェック（簡易版）
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.leader.email)) {
    return { valid: false, error: 'メールアドレスの形式が正しくありません' };
  }
  
  // 電話番号の形式チェック（数字のみ、10-15桁）
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(payload.leader.phone.replace(/[-\s]/g, ''))) {
    return { valid: false, error: '電話番号の形式が正しくありません' };
  }
  
  return { valid: true };
}

/**
 * 予約IDを生成
 * 形式: RES-YYYYMMDD-HHMMSS-XXX
 */
function generateReservationId() {
  const now = new Date();
  const dateStr = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyyMMdd');
  const timeStr = Utilities.formatDate(now, 'Asia/Tokyo', 'HHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RES-${dateStr}-${timeStr}-${random}`;
}

/**
 * ペイロードをスプレッドシートの行データに変換
 */
function convertPayloadToRow(payload, reservationId) {
  const now = new Date();
  const receivedDateTime = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
  
  // 商品名を取得
  const productName = getProductName(payload.productId, payload.transportType);
  
  // ピックアップ場所名を取得
  const pickupPlaceName = getPickupPlaceName(payload.pickup.placeId);
  
  // オプション数量をマッピング
  const optionQuantities = mapOptionQuantities(payload.options || []);
  
  // オプション合計金額を計算
  const optionTotal = (payload.options || []).reduce((sum, opt) => {
    return sum + (opt.qty * opt.unitPrice);
  }, 0);
  
  // 弁当情報
  const bentoTotal = payload.bento && payload.bento.enabled ? payload.bento.qty * payload.bento.unitPrice : 0;
  
  // 参加者情報をマッピング（最大10名まで）
  const participants = mapParticipants(payload.participants || []);
  
  // 行データを構築（ヘッダーの順序に合わせる）
  return [
    reservationId,                                    // 予約ID
    receivedDateTime,                                // 受信日時
    payload.leader.name,                             // 代表者名
    payload.leader.phone,                            // 電話番号
    payload.leader.email,                            // メールアドレス
    payload.reservationDate,                         // 予約日
    payload.transportType === 'PLAN_WITH_BOAT' ? '船付きプラン' : 'チケットのみ', // 交通手段
    payload.productId,                               // 商品ID
    productName,                                     // 商品名
    payload.arrivalSlot === 'AM' ? '午前' : payload.arrivalSlot === 'PM' ? '午後' : '', // 到着時間帯
    payload.people.adults,                           // 大人人数
    payload.people.children,                          // 子供人数
    payload.people.infants,                          // 乳幼児人数
    payload.people.totalPeople,                      // 合計人数
    payload.pickup.required ? 'はい' : 'いいえ',     // ピックアップ必要
    payload.pickup.placeId || '',                     // ピックアップ場所ID
    pickupPlaceName || '',                            // ピックアップ場所名
    payload.pickup.fee,                              // ピックアップ料金
    optionQuantities['OPT_SNORKEL_SET'] || 0,        // シュノーケルセット数量
    optionQuantities['OPT_BANANA_BOAT'] || 0,        // バナナボート数量
    optionQuantities['OPT_UNDERWATER_SCOOTER'] || 0, // 水中スクーター数量
    optionQuantities['OPT_MARBLE'] || 0,             // マーブル数量
    optionQuantities['OPT_BIG_MARBLE'] || 0,         // ビッグマーブル数量
    optionQuantities['OPT_JET_SKI'] || 0,            // ジェットスキー数量
    optionQuantities['OPT_JET_SNORKELING'] || 0,     // ジェットシュノーケリング数量
    optionQuantities['OPT_WAKEBOARD'] || 0,          // ウェイクボード数量
    optionQuantities['OPT_FLOAT_RING'] || 0,         // 浮き輪数量
    optionTotal,                                     // オプション合計金額
    payload.bento.enabled ? 'あり' : 'なし',         // 弁当有無
    payload.bento.qty || 0,                          // 弁当数量
    payload.bento.enabled ? payload.bento.unitPrice : 0, // 弁当単価
    bentoTotal,                                      // 弁当合計金額
    participants[0]?.name || '',                     // 参加者1名前
    participants[0]?.age || '',                      // 参加者1年齢
    participants[1]?.name || '',                     // 参加者2名前
    participants[1]?.age || '',                      // 参加者2年齢
    participants[2]?.name || '',                     // 参加者3名前
    participants[2]?.age || '',                      // 参加者3年齢
    participants[3]?.name || '',                     // 参加者4名前
    participants[3]?.age || '',                      // 参加者4年齢
    participants[4]?.name || '',                     // 参加者5名前
    participants[4]?.age || '',                      // 参加者5年齢
    participants[5]?.name || '',                     // 参加者6名前
    participants[5]?.age || '',                      // 参加者6年齢
    participants[6]?.name || '',                     // 参加者7名前
    participants[6]?.age || '',                      // 参加者7年齢
    participants[7]?.name || '',                     // 参加者8名前
    participants[7]?.age || '',                      // 参加者8年齢
    participants[8]?.name || '',                     // 参加者9名前
    participants[8]?.age || '',                      // 参加者9年齢
    participants[9]?.name || '',                     // 参加者10名前
    participants[9]?.age || '',                      // 参加者10年齢
    payload.message || '',                          // メッセージ
    payload.totals.totalClientCalc,                  // 見積もり合計金額
  ];
}

/**
 * オプション数量をマッピング
 */
function mapOptionQuantities(options) {
  const map = {};
  options.forEach(opt => {
    map[opt.optionId] = opt.qty;
  });
  return map;
}

/**
 * 参加者情報をマッピング（最大10名）
 */
function mapParticipants(participants) {
  return participants.slice(0, 10);
}

/**
 * 商品名を取得
 */
function getProductName(productId, transportType) {
  const productMap = {
    'PLAN_WAKUWAKU': 'わくわくプラン',
    'PLAN_MANZOKU': 'まんぞくプラン',
    'PLAN_ASOBIHOUDAI': '遊び放題プラン',
    'PLAN_IKUDAKE': '行くだけプラン',
    'TICKET_ASOBIHOUDAI': '遊び放題チケット',
    'TICKET_UMIGAME': 'うみがめ探しツアー',
  };
  return productMap[productId] || productId;
}

/**
 * ピックアップ場所名を取得
 */
function getPickupPlaceName(placeId) {
  if (!placeId) return '';
  
  const placeMap = {
    'PICK_EEF': 'イーフビーチ',
    'PICK_KUME_ISLAND': '久米アイランド',
    'PICK_CYPRESS': 'サイプレス',
    'PICK_LATIDA': 'ラティーダ',
    'PICK_OTHER': 'その他',
  };
  return placeMap[placeId] || placeId;
}

/**
 * スプレッドシートにデータを追加
 */
function appendToSpreadsheet(rowData) {
  
  try {
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      Logger.log('シート "' + SHEET_NAME + '" が存在しないため、新規作成します。');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // ヘッダー行を定義
    const headers = [
      '予約ID', '受信日時', '代表者名', '電話番号', 'メールアドレス',
      '予約日', '交通手段', '商品ID', '商品名', '到着時間帯',
      '大人人数', '子供人数', '乳幼児人数', '合計人数',
      'ピックアップ必要', 'ピックアップ場所ID', 'ピックアップ場所名', 'ピックアップ料金',
      'シュノーケルセット数量', 'バナナボート数量', '水中スクーター数量', 'マーブル数量',
      'ビッグマーブル数量', 'ジェットスキー数量', 'ジェットシュノーケリング数量',
      'ウェイクボード数量', '浮き輪数量', 'オプション合計金額',
      '弁当有無', '弁当数量', '弁当単価', '弁当合計金額',
      '参加者1名前', '参加者1年齢', '参加者2名前', '参加者2年齢',
      '参加者3名前', '参加者3年齢', '参加者4名前', '参加者4年齢',
      '参加者5名前', '参加者5年齢', '参加者6名前', '参加者6年齢',
      '参加者7名前', '参加者7年齢', '参加者8名前', '参加者8年齢',
      '参加者9名前', '参加者9年齢', '参加者10名前', '参加者10年齢',
      'メッセージ', '見積もり合計金額'
    ];
    
    // ヘッダー行が存在するか確認（1行目をチェック）
    const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const hasHeader = firstRow[0] === headers[0]; // 最初のヘッダー（予約ID）と一致するか確認
    
    if (!hasHeader) {
      Logger.log('ヘッダー行が存在しないため、追加します。');
      // 既存のデータがある場合、1行目にヘッダーを挿入
      const lastRow = sheet.getLastRow();
      if (lastRow > 0) {
        // 既存のデータを1行下にシフト
        sheet.insertRowBefore(1);
      }
      // ヘッダー行を追加
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // ヘッダー行を固定
      sheet.setFrozenRows(1);
      Logger.log('ヘッダー行を追加しました。');
    } else {
      Logger.log('ヘッダー行は既に存在します。');
    }
    
    // データを追加
    Logger.log('データを追加します。行数: ' + rowData.length);
    sheet.appendRow(rowData);
    Logger.log('データの追加が完了しました。');
    
  } catch (error) {
    Logger.log('appendToSpreadsheet error: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw error; // エラーを再スローして、呼び出し元で処理できるようにする
  }
}
