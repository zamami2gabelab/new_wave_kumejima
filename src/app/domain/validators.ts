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
  age: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") {
        return -1;
      }
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val);
      return isNaN(num) ? -1 : num;
    },
    z
      .number()
      .refine((val) => val !== -1, {
        message: "年齢を入力してください",
      })
      .int("年齢は整数で入力してください")
      .refine((val) => val >= 1, {
        message: "年齢は1以上で入力してください",
      })
      .refine((val) => val <= 120, {
        message: "年齢は120以下で入力してください",
      })
  ) as z.ZodType<number>,
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

// 予約フォーム全体のバリデーションスキーマ（プランのみ・送迎は宿泊先ホテル名・オプション・弁当なし）
export const reservationFormSchema = z
  .object({
    leader: leaderSchema,
    reservationDate: z
      .string()
      .min(1, "予約日を選択してください")
      .refine(isNotPastDate, "過去の日付は選択できません"),
    transportType: z.literal("PLAN_WITH_BOAT"),
    productId: z.string().min(1, "プランを選択してください"),
    people: peopleSchema,
    pickup: z.object({
      required: z.boolean(),
      hotelName: z.string(),
      fee: z.number(),
    }),
    message: z.string(),
    participants: z.array(participantSchema),
    totals: z.object({
      totalClientCalc: z.number(),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.productId.startsWith("PLAN_")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "プランを選択してください",
        path: ["productId"],
      });
    }
    const totalPeople = data.people.adults + data.people.children + data.people.infants;
    if (data.participants.length !== totalPeople) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `参加者名簿を${totalPeople}人分入力してください`,
        path: ["participants"],
      });
    }
    // 送迎希望が有効な場合、宿泊先ホテル名を入力
    if (data.pickup.required && !data.pickup.hotelName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "宿泊先ホテル名を入力してください",
        path: ["pickup", "hotelName"],
      });
    }
  });

export type ReservationFormInput = z.infer<typeof reservationFormSchema>;
