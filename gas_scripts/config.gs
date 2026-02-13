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

// ===== 送信対象（チェックボックス）列（A列）=====
const CHECKBOX_HEADER = '送信対象';

// ===== 運用列（※チェック列の次に書く） =====
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
// ※ 参加者は参加者シートに正規化して保存
const RESERVATION_BASE_HEADERS = [
  '予約ID',
  '受信日時',
  '代表者名',
  '電話番号',
  'メールアドレス',
  '予約日',
  '商品ID',
  '商品名',
  '大人人数',
  '子供人数',
  '乳幼児人数',
  '合計人数',
  'ピックアップ必要',
  '送迎先ホテル名',
  'メッセージ',
  '見積もり合計金額',
];

// ===== 最終的な予約一覧ヘッダー =====
const RESERVATION_HEADERS = [CHECKBOX_HEADER].concat(OPERATION_HEADERS, RESERVATION_BASE_HEADERS);

// ===== 初期ステータス =====
const INITIAL_MAIL_STATUS = 'PENDING';
const INITIAL_CALENDAR_STATUS = 'PENDING';

/***************
 * Calendar 設定
 ***************/

/**
 * デフォルトカレンダー（= 自分のメイン）を使う
 * ※ID指定に切り替えたくなったら、この関数だけ変えればOK
 */
function getTargetCalendar_() {
  return CalendarApp.getDefaultCalendar();
}

/**
 * 商品名ごとの色分け（Google Calendar の colorId）
 * - colorId は 1〜11 などの文字列
 * - ここに商品名を増やすだけで色が変わる
 */
const PRODUCT_COLOR_ID_MAP = {
  'わくわくプラン': '5',
  'まんぞくプラン': '6',
  '遊び放題プラン': '11',
  '行くだけプラン': '2',
  '遊び放題チケット': '9',
  'うみがめ探しツアー': '10',
};

/**
 * マップに無い商品名のときのデフォルト色
 */
const DEFAULT_EVENT_COLOR_ID = '1';

/**
 * 時間ルール（後から変えたい前提）
 * - ここは “ルールを差し替えるだけ” で運用変更できるようにします
 *
 * 返り値:
 *  - {start: Date, end: Date, isAllDay: boolean}
 */
function resolveEventTimeRange_(reservationDateValue, arrivalSlotStr) {
  // reservationDateValue:
  // - Date オブジェクトの場合あり（スプレッドシートが日付型）
  // - 'YYYY-MM-DD' の文字列の場合あり

  const slot = String(arrivalSlotStr || '').trim();

  // 1) 日付を Date に正規化（時間はここで作る）
  let baseDate;

  if (reservationDateValue instanceof Date) {
    // シート日付型：そのまま使う（時刻は 00:00 になっている想定）
    baseDate = new Date(
      reservationDateValue.getFullYear(),
      reservationDateValue.getMonth(),
      reservationDateValue.getDate(),
      0, 0, 0
    );
  } else {
    // 文字列想定
    const s = String(reservationDateValue || '').trim();
    const parts = s.split('-');
    if (parts.length !== 3) throw new Error('予約日の形式が不正です: ' + reservationDateValue);

    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2]);

    baseDate = new Date(y, m, d, 0, 0, 0);
  }

  // ★仮ルール（後で変更OK）
  if (slot === '午前') {
    return {
      start: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 9, 0, 0),
      end: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 12, 0, 0),
      isAllDay: false,
    };
  }

  if (slot === '午後') {
    return {
      start: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 13, 0, 0),
      end: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 16, 0, 0),
      isAllDay: false,
    };
  }

  // 指定なしは終日
  return {
    start: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 0, 0, 0),
    end: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 0, 0, 0),
    isAllDay: true,
  };
}
