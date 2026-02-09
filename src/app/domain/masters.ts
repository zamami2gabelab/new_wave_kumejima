// 価格マスターデータ

import type { ProductId, OptionId } from "./types";

export interface PlanProduct {
  id: ProductId;
  name: string;
  adultPrice: number;
  childPrice: number | null;
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
    id: "PLAN_BANANABOAT",
    name: "はての浜バナナボートプラン",
    adultPrice: 8000,
    childPrice: 6000,
  },
  {
    id: "PLAN_SUINBOU",
    name: "はての浜スインボーで遊ぼープラン",
    adultPrice: 10000,
    childPrice: 8000,
  },
  {
    id: "PLAN_ASOBITSUKUSHI",
    name: "はての浜遊びつくしプラン",
    adultPrice: 20000,
    childPrice: 18000,
  },
  {
    id: "PLAN_JETCRUISING",
    name: "ジェットクルージングプラン",
    adultPrice: 10000,
    childPrice: 7000,
  },
  // 家族向けプラン
  {
    id: "PLAN_FAMILY_FULL",
    name: "ファミリーアクティビティープラン（1日）",
    adultPrice: 15000,
    childPrice: 10000,
  },
  {
    id: "PLAN_FAMILY_HALF",
    name: "ファミリーアクティビティープラン（半日）",
    adultPrice: 10000,
    childPrice: 8000,
  },
  {
    id: "PLAN_FAMILY_RELAX",
    name: "ファミリーゆったりプラン（半日）",
    adultPrice: 7000,
    childPrice: 5000,
  },
  // カップル向けプラン
  {
    id: "PLAN_COUPLE_SPECIAL",
    name: "はての浜スペシャルペアプラン（1日）",
    adultPrice: 16000,
    childPrice: null,
  },
  {
    id: "PLAN_COUPLE_MARINE",
    name: "はての浜ペアマリン体験プラン（半日）",
    adultPrice: 12000,
    childPrice: null,
  },
  {
    id: "PLAN_COUPLE_BASIC",
    name: "はての浜ペアプラン（半日）",
    adultPrice: 8000,
    childPrice: null,
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

// ピックアップ場所マスター
export const PICKUP_PLACES = [
  { id: "PICK_EEF" as const, name: "イーフビーチ" },
  { id: "PICK_KUME_ISLAND" as const, name: "久米アイランド" },
  { id: "PICK_CYPRESS" as const, name: "サイプレス" },
  { id: "PICK_LATIDA" as const, name: "ラティーダ" },
  { id: "PICK_OTHER" as const, name: "その他（メッセージ欄にご記入）" },
] as const;

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
