// 価格計算ロジック

import type { ReservationFormData } from "./types";
import { getPlanProduct } from "./masters";

const PICKUP_FEE = 1000;

/**
 * 予約フォームデータから合計金額を計算
 * フロントエンドでの見積もり計算（web estimate）
 */
export function calculateTotals(data: ReservationFormData): number {
  let total = 0;

  if (data.productId) {
    const plan = getPlanProduct(data.productId as any);
    if (plan) {
      total += plan.adultPrice * data.people.adults;
      if (plan.childPrice !== null) {
        total += plan.childPrice * data.people.children;
      }
    }
  }

  if (data.pickup.required) {
    total += PICKUP_FEE;
  }

  return total;
}

/**
 * フォームデータを更新して合計を再計算
 */
export function updateTotals(data: ReservationFormData): ReservationFormData {
  return {
    ...data,
    totals: {
      totalClientCalc: calculateTotals(data),
    },
  };
}
