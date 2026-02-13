// 予約フォームのドメインモデル

// フォームでは PLAN_* のみ使用。masters 用に TICKET_* も定義
export type ProductId =
  | "PLAN_NONBIRI"
  | "PLAN_BANANABOAT"
  | "PLAN_SUINBOU"
  | "PLAN_ASOBITSUKUSHI"
  | "PLAN_JETCRUISING"
  | "PLAN_SUNSET"
  | "PLAN_FAMILY_FULL"
  | "PLAN_FAMILY_HALF"
  | "PLAN_FAMILY_RELAX"
  | "PLAN_COUPLE_SPECIAL"
  | "PLAN_COUPLE_MARINE"
  | "PLAN_COUPLE_BASIC"
  | "PLAN_GROUP_CHARTER"
  | "TICKET_ASOBIHOUDAI"
  | "TICKET_UMIGAME";

export type OptionId =
  | "OPT_SNORKEL_SET"
  | "OPT_BANANA_BOAT"
  | "OPT_UNDERWATER_SCOOTER"
  | "OPT_MARBLE"
  | "OPT_BIG_MARBLE"
  | "OPT_JET_SKI"
  | "OPT_JET_SNORKELING"
  | "OPT_WAKEBOARD"
  | "OPT_FLOAT";

export interface Leader {
  name: string;
  phone: string; // 数字のみ、ハイフンなし
  email: string;
}

export interface People {
  adults: number; // 16+
  children: number; // 4-15
  infants: number; // 0-3, 無料
  totalPeople: number;
}

export interface Participant {
  name: string;
  age: number;
}

/** 送迎希望：required 時は宿泊先ホテル名を自由記述 */
export interface Pickup {
  required: boolean;
  hotelName: string;
  fee: number; // 1000 if required
}

export interface Totals {
  totalClientCalc: number;
}

export interface ReservationFormData {
  leader: Leader;
  reservationDate: string; // YYYY-MM-DD
  productId: ProductId | "";
  people: People;
  pickup: Pickup;
  message: string;
  participants: Participant[];
  totals: Totals;
}

export interface ReservationPayload {
  leader: Leader;
  reservationDate: string;
  productId: string;
  people: People;
  pickup: Pickup;
  message: string;
  participants: Participant[];
  totals: Totals;
}

export interface ReservationResponse {
  ok: boolean;
  reservationId?: string;
  error?: string;
}
