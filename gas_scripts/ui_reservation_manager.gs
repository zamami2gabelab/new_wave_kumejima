// ui_reservation_manager.gs
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('予約管理')
    // カレンダー系（分離）
    .addItem('チェック済みをカレンダー登録', 'createCalendarEventsForCheckedReservations')
    .addSeparator()
    // メール系（既存）
    .addItem('チェック済みをメール送信（プレビューあり）', 'previewAndSendCheckedEmails')
    .addItem('チェック済みをメール送信', 'sendCheckedReservationEmails')
    .addSeparator()
    // 統合（最後に）
    .addItem('チェック済みをカレンダー登録 → メール送信', 'createCalendarThenSendMailForCheckedReservations')
    .addSeparator()
    .addItem('チェックを全解除', 'clearAllReservationChecks')
    .addItem('チェックを全選択（SENT除外）', 'checkAllPendingReservations')
    .addToUi();
}
