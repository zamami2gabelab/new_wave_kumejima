// 価格マスターデータ

import type { ProductId, OptionId } from "./types";

export interface PlanProduct {
  id: ProductId;
  name: string;
  adultPrice: number;
  childPrice: number;
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
    id: "PLAN_WAKUWAKU",
    name: "わくわくプラン",
    adultPrice: 12000,
    childPrice: 8000,
  },
  {
    id: "PLAN_MANZOKU",
    name: "まんぞくプラン",
    adultPrice: 15000,
    childPrice: 11000,
  },
  {
    id: "PLAN_ASOBIHOUDAI",
    name: "遊び放題プラン",
    adultPrice: 18000,
    childPrice: 15000,
  },
  {
    id: "PLAN_IKUDAKE",
    name: "行くだけプラン",
    adultPrice: 8000,
    childPrice: 6000,
  },
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
