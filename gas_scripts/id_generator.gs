/**
 * id_generator.gs
 * 予約IDを生成する
 * 形式: RES-YYYYMMDD-HHMMSS-XXX（XXXは000〜999の乱数）
 *
 * ※ config.gs の TIMEZONE を使用します
 */

function generateReservationId() {
  const now = new Date();
  const dateStr = Utilities.formatDate(now, TIMEZONE, 'yyyyMMdd');
  const timeStr = Utilities.formatDate(now, TIMEZONE, 'HHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RES-${dateStr}-${timeStr}-${random}`;
}
