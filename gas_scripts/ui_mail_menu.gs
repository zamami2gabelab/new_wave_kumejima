// ui_mail_menu.gs
/**
 * スプレッドシートを開いたときに「予約管理」メニューを追加
 * （管理画面ボタンの代わり）
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('予約管理')
    .addItem('チェック済みをメール送信（プレビューあり）', 'previewAndSendCheckedEmails')
    .addItem('チェック済みをメール送信', 'sendCheckedReservationEmails')
    .addSeparator()
    .addItem('チェックを全解除', 'clearAllReservationChecks')
    .addItem('チェックを全選択', 'checkAllPendingReservations')
    .addToUi();
}
