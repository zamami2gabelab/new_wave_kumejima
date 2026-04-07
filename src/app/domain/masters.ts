// 価格マスターデータ

import type { ProductId, OptionId } from "./types";

export interface PlanProduct {
  id: ProductId;
  name: string;
  adultPrice: number;
  childPrice: number | null;
  pricingLabel?: string;
  isGroupPlan?: boolean;
  groupPricingRules?: {
    baseFee: number;
    maxBaseCount: number;
    perPersonFee: number;
  };
}

export interface TicketProduct {
  id: ProductId;
  name: string;
  webPrice: number; // 1人あたり
}

export interface OptionProduct {
  id: OptionId;
  name: string;
  unitPrice: number;
}

// プラン商品マスター
export const PLAN_PRODUCTS: PlanProduct[] = [
  {
    id: "PLAN_NONBIRI",
    name: "のんびりはての浜プラン",
    adultPrice: 6000,
    childPrice: 4500,
  },
  {
    id: "PLAN_ACTIVITY",
    name: "はての浜アクティビティープラン",
    adultPrice: 8000,
    childPrice: 6000,
  },
  {
    id: "PLAN_SUINBOU",
    name: "はての浜スインボーで遊ぼープラン",
    adultPrice: 9000,
    childPrice: 7000,
  },
  {
    id: "PLAN_PREMIUM_HATENOHAMA",
    name: "はての浜プレミアムプラン（要相談）",
    adultPrice: 150000,
    childPrice: null,
    pricingLabel: "10名まで150,000円 / 追加1名 12,000円",
    isGroupPlan: true,
    groupPricingRules: {
      baseFee: 150000,
      maxBaseCount: 10,
      perPersonFee: 12000,
    },
  },
  {
    id: "PLAN_MEMORIAL_HATENOHAMA",
    name: "メモリアルはての浜プラン",
    adultPrice: 10000,
    childPrice: 8000,
  },
  {
    id: "PLAN_JET_CRUISE",
    name: "ジェットクルーズ",
    adultPrice: 10000,
    childPrice: 7000,
  },
  {
    id: "PLAN_ASOBITSUKUSHI_SUMMER",
    name: "はての浜遊びつくしプラン",
    adultPrice: 15000,
    childPrice: 13000,
  },
  {
    id: "PLAN_SUNSET_JET",
    name: "サンセットジェットクルーズ",
    adultPrice: 10000,
    childPrice: 7000,
  },
  {
    id: "PLAN_SUNSET_CRUISE",
    name: "サンセットクルーズ",
    adultPrice: 6000,
    childPrice: 5000,
  },
  {
    id: "PLAN_SUNSET_SUP",
    name: "サンセットサップ",
    adultPrice: 5000,
    childPrice: 4000,
  },
  {
    id: "PLAN_SNORKEL",
    name: "久米島近海シュノーケルプラン",
    adultPrice: 8000,
    childPrice: 6000,
  },
  {
    id: "PLAN_PREMIUM_SNORKEL",
    name: "久米島プレミアムシュノーケルプラン（10名迄）",
    adultPrice: 60000,
    childPrice: null,
    pricingLabel: "10名まで60,000円",
    isGroupPlan: true,
    groupPricingRules: {
      baseFee: 60000,
      maxBaseCount: 10,
      perPersonFee: 0,
    },
  }
];

// チケット商品マスター
export const TICKET_PRODUCTS: TicketProduct[] = [
  {
    id: "TICKET_ASOBIHOUDAI",
    name: "遊び放題チケット",
    webPrice: 10000,
  },
  {
    id: "TICKET_UMIGAME",
    name: "うみがめ探しツアー",
    webPrice: 8000,
  },
];

// オプション商品マスター
export const OPTION_PRODUCTS: OptionProduct[] = [
  {
    id: "OPT_SNORKEL_SET",
    name: "シュノーケルセット",
    unitPrice: 1000,
  },
  {
    id: "OPT_BANANA_BOAT",
    name: "バナナボート",
    unitPrice: 5000,
  },
  {
    id: "OPT_UNDERWATER_SCOOTER",
    name: "水中スクーター",
    unitPrice: 7000,
  },
  {
    id: "OPT_MARBLE",
    name: "マーブル",
    unitPrice: 7000,
  },
  {
    id: "OPT_BIG_MARBLE",
    name: "ビッグマーブル",
    unitPrice: 5000,
  },
  {
    id: "OPT_JET_SKI",
    name: "ジェットスキー",
    unitPrice: 7000,
  },
  {
    id: "OPT_JET_SNORKELING",
    name: "ジェットシュノーケリング",
    unitPrice: 7000,
  },
  {
    id: "OPT_WAKEBOARD",
    name: "ウェイクボード",
    unitPrice: 7000,
  },
  {
    id: "OPT_FLOAT",
    name: "浮き輪",
    unitPrice: 1000,
  },
];

// ヘルパー関数
export function getPlanProduct(id: ProductId): PlanProduct | undefined {
  return PLAN_PRODUCTS.find((p) => p.id === id);
}

export function getTicketProduct(id: ProductId): TicketProduct | undefined {
  return TICKET_PRODUCTS.find((p) => p.id === id);
}

export function getOptionProduct(id: OptionId): OptionProduct | undefined {
  return OPTION_PRODUCTS.find((p) => p.id === id);
}
