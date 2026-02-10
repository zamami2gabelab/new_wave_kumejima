// 予約フォームのドメインモデル

export type TransportType = "PLAN_WITH_BOAT" | "TICKET_ACTIVITY_ONLY";

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
  | "TICKET_ASOBIHOUDAI"
  | "TICKET_UMIGAME";

export type ArrivalSlot = "AM" | "PM";

export type PickupPlaceId = 
  | "PICK_EEF"
  | "PICK_KUME_ISLAND"
  | "PICK_CYPRESS"
  | "PICK_LATIDA"
  | "PICK_OTHER";

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

export interface Pickup {
  required: boolean;
  placeId: PickupPlaceId | null;
  fee: number; // 1000 if required
}

export interface Option {
  optionId: OptionId;
  qty: number;
  unitPrice: number;
}

export interface Bento {
  enabled: boolean;
  qty: number;
  unitPrice: 1500;
}

export interface Totals {
  totalClientCalc: number;
}

export interface ReservationFormData {
  leader: Leader;
  reservationDate: string; // YYYY-MM-DD
  transportType: TransportType;
  productId: ProductId | "";
  arrivalSlot: ArrivalSlot | null;
  people: People;
  pickup: Pickup;
  message: string;
  options: Option[];
  bento: Bento;
  participants: Participant[];
  totals: Totals;
}

export interface ReservationPayload {
  leader: Leader;
  reservationDate: string;
  transportType: TransportType;
  productId: string;
  arrivalSlot: ArrivalSlot | null;
  people: People;
  pickup: Pickup;
  message: string;
  options: Array<{ optionId: string; qty: number; unitPrice: number }>;
  bento: Bento;
  participants: Participant[];
  totals: Totals;
}

export interface ReservationResponse {
  ok: boolean;
  reservationId?: string;
  error?: string;
}
