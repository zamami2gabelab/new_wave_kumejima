// Zodバリデーションスキーマ

import { z } from "zod";
import { isNotPastDate } from "../lib/date";

// リーダー情報のバリデーション
export const leaderSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "電話番号は10桁または11桁の数字で入力してください")
    .transform((val) => val.replace(/-/g, "")), // ハイフンを除去
  email: z.string().email("有効なメールアドレスを入力してください"),
});

// 参加者のバリデーション
export const participantSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  age: z
    .number()
    .int("年齢は整数で入力してください")
    .min(0, "年齢は0以上で入力してください"),
});

// 人数のバリデーション
export const peopleSchema = z.object({
  adults: z
    .number()
    .int("大人の人数は整数で入力してください")
    .min(0, "大人の人数は0以上で入力してください"),
  children: z
    .number()
    .int("子供の人数は整数で入力してください")
    .min(0, "子供の人数は0以上で入力してください"),
  infants: z
    .number()
    .int("乳幼児の人数は整数で入力してください")
    .min(0, "乳幼児の人数は0以上で入力してください"),
  totalPeople: z.number().int().min(1, "合計人数は1人以上で入力してください"),
});

// 予約フォーム全体のバリデーションスキーマ
export const reservationFormSchema = z
  .object({
    leader: leaderSchema,
    reservationDate: z
      .string()
      .min(1, "予約日を選択してください")
      .refine(isNotPastDate, "過去の日付は選択できません"),
    transportType: z.enum(["PLAN_WITH_BOAT", "TICKET_ACTIVITY_ONLY"], {
      required_error: "交通手段を選択してください",
    }),
    productId: z.string().min(1, "商品を選択してください"),
    arrivalSlot: z.enum(["AM", "PM"]).nullable(),
    people: peopleSchema,
    pickup: z.object({
      required: z.boolean(),
      placeId: z
        .enum([
          "PICK_EEF",
          "PICK_KUME_ISLAND",
          "PICK_CYPRESS",
          "PICK_LATIDA",
          "PICK_OTHER",
        ])
        .nullable(),
      fee: z.number(),
    }),
    message: z.string(),
    options: z.array(
      z.object({
        optionId: z.string(),
        qty: z.number().int().min(0),
        unitPrice: z.number(),
      })
    ),
    bento: z.object({
      enabled: z.boolean(),
      qty: z.number().int().min(0),
      unitPrice: z.literal(1500),
    }),
    participants: z.array(participantSchema),
    totals: z.object({
      totalClientCalc: z.number(),
    }),
  })
  .superRefine((data, ctx) => {
    // PLAN_WITH_BOATの場合、productIdがPLANで始まる必要がある
    if (data.transportType === "PLAN_WITH_BOAT") {
      if (!data.productId.startsWith("PLAN_")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "プランを選択してください",
          path: ["productId"],
        });
      }
      // PLANの場合、参加者名簿が必要
      const totalPeople = data.people.adults + data.people.children + data.people.infants;
      if (data.participants.length !== totalPeople) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `参加者名簿を${totalPeople}人分入力してください`,
          path: ["participants"],
        });
      }
    }

    // TICKET_ACTIVITY_ONLYの場合、productIdがTICKETで始まり、arrivalSlotが必要
    if (data.transportType === "TICKET_ACTIVITY_ONLY") {
      if (!data.productId.startsWith("TICKET_")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "チケットを選択してください",
          path: ["productId"],
        });
      }
      if (!data.arrivalSlot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "到着時間帯を選択してください",
          path: ["arrivalSlot"],
        });
      }
    }

    // ピックアップが有効な場合、placeIdが必要
    if (data.pickup.required && !data.pickup.placeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ピックアップ場所を選択してください",
        path: ["pickup", "placeId"],
      });
    }

    // ピックアップ場所が「その他」の場合、メッセージが必要
    if (data.pickup.placeId === "PICK_OTHER" && !data.message.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "メッセージ欄にピックアップ場所の詳細を記入してください",
        path: ["message"],
      });
    }

    // 弁当が有効な場合、数量は1以上
    if (data.bento.enabled && data.bento.qty < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "弁当の数量を入力してください",
        path: ["bento", "qty"],
      });
    }
  });

export type ReservationFormInput = z.infer<typeof reservationFormSchema>;
