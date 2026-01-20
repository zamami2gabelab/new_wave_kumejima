// 日付ヘルパー関数

/**
 * 今日の日付をYYYY-MM-DD形式で返す
 */
export function getTodayString(): string {
  const today = new Date();
  return formatDate(today);
}

/**
 * DateオブジェクトをYYYY-MM-DD形式の文字列に変換
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 日付文字列（YYYY-MM-DD）が過去の日付でないかチェック
 */
export function isNotPastDate(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate >= today;
}
