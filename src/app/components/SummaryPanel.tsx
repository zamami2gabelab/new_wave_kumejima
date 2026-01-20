// リアルタイムサマリーパネルコンポーネント

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReservationFormData } from "../domain/types";
import { getPlanProduct, getTicketProduct, getOptionProduct, PICKUP_PLACES } from "../domain/masters";
import { calculateTotals } from "../domain/pricing";

interface SummaryPanelProps {
  formData: ReservationFormData;
  className?: string;
}

export const SummaryPanel = React.memo(function SummaryPanel({ formData, className }: SummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const total = calculateTotals(formData);

  // 商品情報を取得
  let productName = "";
  let productPrice = "";
  if (formData.transportType === "PLAN_WITH_BOAT" && formData.productId) {
    const plan = getPlanProduct(formData.productId as any);
    if (plan) {
      productName = plan.name;
      const adultTotal = plan.adultPrice * formData.people.adults;
      const childTotal = plan.childPrice * formData.people.children;
      productPrice = `${(adultTotal + childTotal).toLocaleString()}円`;
    }
  } else if (formData.transportType === "TICKET_ACTIVITY_ONLY" && formData.productId) {
    const ticket = getTicketProduct(formData.productId as any);
    if (ticket) {
      productName = ticket.name;
      const payingPeople = formData.people.adults + formData.people.children;
      productPrice = `${(ticket.webPrice * payingPeople).toLocaleString()}円`;
    }
  }

  // ピックアップ場所名を取得
  const pickupPlaceName =
    formData.pickup.placeId &&
    PICKUP_PLACES.find((p) => p.id === formData.pickup.placeId)?.name;

  // 有効なオプションを取得
  const activeOptions = formData.options.filter((opt) => opt.qty > 0);

  return (
    <div className={className}>
      {/* デスクトップ: 常に表示 */}
      <Card className="hidden md:block sticky top-4">
        <CardHeader>
          <CardTitle>予約内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SummaryContent formData={formData} total={total} />
        </CardContent>
      </Card>

      {/* モバイル: 折りたたみ可能 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
        <Card>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>予約内容</CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <SummaryContent formData={formData} total={total} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
});

function SummaryContent({
  formData,
  total,
}: {
  formData: ReservationFormData;
  total: number;
}) {
  // 商品情報を取得
  let productName = "";
  let productPrice = "";
  if (formData.transportType === "PLAN_WITH_BOAT" && formData.productId) {
    const plan = getPlanProduct(formData.productId as any);
    if (plan) {
      productName = plan.name;
      const adultTotal = plan.adultPrice * formData.people.adults;
      const childTotal = plan.childPrice * formData.people.children;
      productPrice = `${(adultTotal + childTotal).toLocaleString()}円`;
    }
  } else if (formData.transportType === "TICKET_ACTIVITY_ONLY" && formData.productId) {
    const ticket = getTicketProduct(formData.productId as any);
    if (ticket) {
      productName = ticket.name;
      const payingPeople = formData.people.adults + formData.people.children;
      productPrice = `${(ticket.webPrice * payingPeople).toLocaleString()}円`;
    }
  }

  // ピックアップ場所名を取得
  const pickupPlaceName =
    formData.pickup.placeId &&
    PICKUP_PLACES.find((p) => p.id === formData.pickup.placeId)?.name;

  // 有効なオプションを取得
  const activeOptions = formData.options.filter((opt) => opt.qty > 0);

  return (
    <div className="space-y-3 text-sm">
      {/* 予約日 */}
      {formData.reservationDate && (
        <div className="flex justify-between">
          <span className="text-gray-600">予約日</span>
          <span className="font-medium">{formData.reservationDate}</span>
        </div>
      )}

      {/* 商品 */}
      {productName && (
        <div className="flex justify-between">
          <span className="text-gray-600">商品</span>
          <div className="text-right">
            <div className="font-medium">{productName}</div>
            <div className="text-xs text-gray-500">{productPrice}</div>
          </div>
        </div>
      )}

      {/* 到着時間帯（チケットのみ） */}
      {formData.transportType === "TICKET_ACTIVITY_ONLY" && formData.arrivalSlot && (
        <div className="flex justify-between">
          <span className="text-gray-600">到着時間帯</span>
          <span className="font-medium">{formData.arrivalSlot === "AM" ? "午前" : "午後"}</span>
        </div>
      )}

      {/* 人数 */}
      {formData.people.totalPeople > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">人数</span>
          <div className="text-right">
            {formData.people.adults > 0 && (
              <div className="text-xs">大人: {formData.people.adults}名</div>
            )}
            {formData.people.children > 0 && (
              <div className="text-xs">子供: {formData.people.children}名</div>
            )}
            {formData.people.infants > 0 && (
              <div className="text-xs">乳幼児: {formData.people.infants}名（無料）</div>
            )}
            <div className="font-medium mt-1">合計: {formData.people.totalPeople}名</div>
          </div>
        </div>
      )}

      {/* ピックアップ */}
      {formData.pickup.required && (
        <div className="flex justify-between">
          <span className="text-gray-600">ピックアップ</span>
          <div className="text-right">
            <div className="font-medium">{pickupPlaceName || "未選択"}</div>
            <div className="text-xs text-gray-500">+1,000円</div>
          </div>
        </div>
      )}

      {/* オプション */}
      {activeOptions.length > 0 && (
        <div>
          <div className="text-gray-600 mb-1">オプション</div>
          <div className="space-y-1 pl-2">
            {activeOptions.map((opt) => {
              const optionProduct = getOptionProduct(opt.optionId);
              return (
                <div key={opt.optionId} className="flex justify-between text-xs">
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

      {/* 弁当 */}
      {formData.bento.enabled && formData.bento.qty > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">弁当</span>
          <div className="text-right">
            <div className="font-medium">{formData.bento.qty}個</div>
            <div className="text-xs text-gray-500">
              {(formData.bento.unitPrice * formData.bento.qty).toLocaleString()}円
            </div>
          </div>
        </div>
      )}

      {/* 区切り線 */}
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">合計金額</span>
          <span className="font-bold text-xl text-[#0EA5E9]">
            {total.toLocaleString()}円
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ※ これは見積もり金額です。確定金額は別途ご連絡いたします。
        </div>
      </div>
    </div>
  );
}
