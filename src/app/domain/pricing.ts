// 価格計算ロジック

import type { ReservationFormData } from "./types";
import { getPlanProduct, getTicketProduct } from "./masters";

const PICKUP_FEE = 1000;
const BENTO_PRICE = 1500;

/**
 * 予約フォームデータから合計金額を計算
 * フロントエンドでの見積もり計算（web estimate）
 */
export function calculateTotals(data: ReservationFormData): number {
  let total = 0;

  // プランまたはチケットの基本料金
  if (data.transportType === "PLAN_WITH_BOAT" && data.productId) {
    const plan = getPlanProduct(data.productId as any);
    if (plan) {
      // 団体プランの特殊な価格計算
      if (plan.isGroupPlan && plan.groupPricingRules) {
        const totalPeople = data.people.adults + data.people.children + data.people.infants;
        const { baseFee, maxBaseCount, perPersonFee } = plan.groupPricingRules;
        
        if (totalPeople <= maxBaseCount) {
          total = baseFee;
        } else {
          const additionalPeople = totalPeople - maxBaseCount;
          total = baseFee + (additionalPeople * perPersonFee);
        }
      } else {
        // 通常のプラン価格計算
        total += plan.adultPrice * data.people.adults;
        if (plan.childPrice !== null) {
          total += plan.childPrice * data.people.children;
        }
        // 乳幼児（0-3）は無料
      }
    }
  } else if (data.transportType === "TICKET_ACTIVITY_ONLY" && data.productId) {
    const ticket = getTicketProduct(data.productId as any);
    if (ticket) {
      // チケットは大人・子供同じ価格、乳幼児は無料
      const payingPeople = data.people.adults + data.people.children;
      total += ticket.webPrice * payingPeople;
    }
  }

  // ピックアップ料金
  if (data.pickup.required) {
    total += PICKUP_FEE;
  }

  // オプション料金
  data.options.forEach((opt) => {
    if (opt.qty > 0) {
      total += opt.unitPrice * opt.qty;
    }
  });

  // 弁当料金
  if (data.bento.enabled && data.bento.qty > 0) {
    total += BENTO_PRICE * data.bento.qty;
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
