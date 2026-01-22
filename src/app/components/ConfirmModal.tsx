// 確認モーダルコンポーネント

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ReservationFormData } from "../domain/types";
import { getPlanProduct, getTicketProduct, getOptionProduct, PICKUP_PLACES } from "../domain/masters";
import { calculateTotals } from "../domain/pricing";

interface ConfirmModalProps {
  open: boolean;
  formData: ReservationFormData;
  onSubmit: () => void;
  onClose: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  reservationId?: string;
}

export function ConfirmModal({
  open,
  formData,
  onSubmit,
  onClose,
  isLoading,
  isSuccess,
  isError,
  errorMessage,
  reservationId,
}: ConfirmModalProps) {
  const total = calculateTotals(formData);

  // 商品情報を取得
  let productName = "";
  if (formData.transportType === "PLAN_WITH_BOAT" && formData.productId) {
    const plan = getPlanProduct(formData.productId as any);
    if (plan) {
      productName = plan.name;
    }
  } else if (formData.transportType === "TICKET_ACTIVITY_ONLY" && formData.productId) {
    const ticket = getTicketProduct(formData.productId as any);
    if (ticket) {
      productName = ticket.name;
    }
  }

  const pickupPlaceName =
    formData.pickup.placeId &&
    PICKUP_PLACES.find((p) => p.id === formData.pickup.placeId)?.name;

  const activeOptions = formData.options.filter((opt) => opt.qty > 0);

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <DialogTitle className="text-2xl">予約が完了しました</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              予約が正常に完了しました。確認メールをご確認ください。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                確認メールをご確認ください。
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">予約内容</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">予約日</span>
                  <span className="font-medium">{formData.reservationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">商品</span>
                  <span className="font-medium">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">人数</span>
                  <span className="font-medium">
                    大人: {formData.people.adults}名、子供: {formData.people.children}名
                    {formData.people.infants > 0 && `、乳幼児: ${formData.people.infants}名`}
                  </span>
                </div>
                {formData.pickup.required && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ピックアップ</span>
                    <span className="font-medium">{pickupPlaceName}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">合計金額</span>
                  <span className="font-bold text-lg text-[#0EA5E9]">
                    {total.toLocaleString()}円
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={onClose} variant="outline">
                閉じる
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <DialogTitle className="text-2xl">エラーが発生しました</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              予約の送信中にエラーが発生しました。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800">{errorMessage || "予約の送信に失敗しました"}</p>
            </div>

            <div className="flex justify-end gap-3">
              <Button onClick={onClose} variant="outline">
                閉じる
              </Button>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                再試行
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">予約内容の確認</DialogTitle>
          <DialogDescription className="sr-only">
            予約内容を確認して、問題がなければ送信してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 予約内容の詳細表示 */}
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">基本情報</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">代表者名</span>
                  <span className="font-medium">{formData.leader.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">電話番号</span>
                  <span className="font-medium">{formData.leader.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">メールアドレス</span>
                  <span className="font-medium">{formData.leader.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">予約日</span>
                  <span className="font-medium">{formData.reservationDate}</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">商品・人数</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品</span>
                  <span className="font-medium">{productName}</span>
                </div>
                {formData.transportType === "TICKET_ACTIVITY_ONLY" && formData.arrivalSlot && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">到着時間帯</span>
                    <span className="font-medium">
                      {formData.arrivalSlot === "AM" ? "午前" : "午後"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">人数</span>
                  <span className="font-medium">
                    大人: {formData.people.adults}名、子供: {formData.people.children}名
                    {formData.people.infants > 0 && `、乳幼児: ${formData.people.infants}名`}
                  </span>
                </div>
              </div>
            </div>

            {formData.pickup.required && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">ピックアップ</h3>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">場所</span>
                    <span className="font-medium">{pickupPlaceName}</span>
                  </div>
                </div>
              </div>
            )}

            {activeOptions.length > 0 && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">オプション</h3>
                <div className="space-y-1 text-sm">
                  {activeOptions.map((opt) => {
                    const optionProduct = getOptionProduct(opt.optionId);
                    return (
                      <div key={opt.optionId} className="flex justify-between">
                        <span>
                          {optionProduct?.name} × {opt.qty}
                        </span>
                        <span>{(opt.unitPrice * opt.qty).toLocaleString()}円</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.bento.enabled && formData.bento.qty > 0 && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">弁当</h3>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">数量</span>
                    <span className="font-medium">
                      {formData.bento.qty}個（
                      {(formData.bento.unitPrice * formData.bento.qty).toLocaleString()}円）
                    </span>
                  </div>
                </div>
              </div>
            )}

            {formData.participants.length > 0 && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">参加者名簿</h3>
                <div className="space-y-2 text-sm">
                  {formData.participants.map((p, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">参加者 {i + 1}</span>
                      <span className="font-medium">
                        {p.name}（{p.age}歳）
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.message && (
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-3">メッセージ</h3>
                <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
              </div>
            )}

            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">合計金額</span>
                <span className="font-bold text-2xl text-[#0EA5E9]">
                  {total.toLocaleString()}円
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ※ これは見積もり金額です。確定金額は別途ご連絡いたします。
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" disabled={isLoading}>
              戻る
            </Button>
            <Button onClick={onSubmit} disabled={isLoading} className="bg-[#F97316] hover:bg-[#EA580C]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              予約を確定する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
