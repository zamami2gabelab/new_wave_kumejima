/**
 * config.gs
 * システム全体で使う定数・ヘッダー定義
 */

// ===== スプレッドシート設定 =====
const SPREADSHEET_ID = '1ok_MKGfTYV23KrdYnffbec_qpzmr4N0dfqMHrOtqYSA';
const RESERVATION_SHEET_NAME = '予約一覧';
const PARTICIPANT_SHEET_NAME = '参加者';
const SYSTEM_LOG_SHEET_NAME = 'システムログ';

const TIMEZONE = 'Asia/Tokyo';

// ===== 運用列（※先頭に置く） =====
// すでに「メール状態」が先頭にある前提
const OPERATION_HEADERS = [
  'メール状態',
  'メール送信日時',
  'メールエラー',
  'カレンダー状態',
  'カレンダーイベントID',
  'カレンダー作成日時',
  'カレンダーエラー',
];

// ===== 予約データ本体列 =====
// ※ 参加者1〜10列は廃止（参加者シートに正規化）
const RESERVATION_BASE_HEADERS = [
  '予約ID',
  '受信日時',
  '代表者名',
  '電話番号',
  'メールアドレス',
  '予約日',
  '交通手段',
  '商品ID',
  '商品名',
  '到着時間帯',
  '大人人数',
  '子供人数',
  '乳幼児人数',
  '合計人数',
  'ピックアップ必要',
  'ピックアップ場所ID',
  'ピックアップ場所名',
  'ピックアップ料金',
  'シュノーケルセット数量',
  'バナナボート数量',
  '水中スクーター数量',
  'マーブル数量',
  'ビッグマーブル数量',
  'ジェットスキー数量',
  'ジェットシュノーケリング数量',
  'ウェイクボード数量',
  '浮き輪数量',
  'オプション合計金額',
  '弁当有無',
  '弁当数量',
  '弁当単価',
  '弁当合計金額',
  'メッセージ',
  '見積もり合計金額',
];

// ===== 最終的な予約一覧ヘッダー =====
const RESERVATION_HEADERS = OPERATION_HEADERS.concat(RESERVATION_BASE_HEADERS);

// ===== 初期ステータス =====
const INITIAL_MAIL_STATUS = 'PENDING';
const INITIAL_CALENDAR_STATUS = 'PENDING';
