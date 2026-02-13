// リアルタイムサマリーパネルコンポーネント

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReservationFormData } from "../domain/types";
import { getPlanProduct } from "../domain/masters";
import { calculateTotals } from "../domain/pricing";

interface SummaryPanelProps {
  formData: ReservationFormData;
  className?: string;
}

export const SummaryPanel = React.memo(function SummaryPanel({ formData, className }: SummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const total = calculateTotals(formData);

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
  let productName = "";
  let productPrice = "";
  if (formData.productId) {
    const plan = getPlanProduct(formData.productId as any);
    if (plan) {
      productName = plan.name;
      const adultTotal = plan.adultPrice * formData.people.adults;
      const childTotal = (plan.childPrice ?? 0) * formData.people.children;
      productPrice = `${(adultTotal + childTotal).toLocaleString()}円`;
    }
  }

  return (
    <div className="space-y-3 text-sm">
      {formData.reservationDate && (
        <div className="flex justify-between">
          <span className="text-gray-600">予約日</span>
          <span className="font-medium">{formData.reservationDate}</span>
        </div>
      )}

      {productName && (
        <div className="flex justify-between">
          <span className="text-gray-600">商品</span>
          <div className="text-right">
            <div className="font-medium">{productName}</div>
            <div className="text-xs text-gray-500">{productPrice}</div>
          </div>
        </div>
      )}

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

      {formData.pickup.required && (
        <div className="flex justify-between">
          <span className="text-gray-600">送迎</span>
          <div className="text-right">
            <div className="font-medium">{formData.pickup.hotelName || "宿泊先ホテル名"}</div>
            <div className="text-xs text-gray-500">+1,000円</div>
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
