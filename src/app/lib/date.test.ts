import { describe, expect, it } from "vitest";
import { formatDate, isNotPastDate } from "./date";

describe("date helpers", () => {
  // Date オブジェクトを YYYY-MM-DD 形式へ変換できることを確認
  it("formats Date to YYYY-MM-DD", () => {
    const date = new Date(2026, 1, 18);
    expect(formatDate(date)).toBe("2026-02-18");
  });

  // 過去日を弾き、当日と未来日は許可する判定ロジックを確認
  it("returns false for yesterday, true for today and tomorrow", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    expect(isNotPastDate(formatDate(yesterday))).toBe(false);
    expect(isNotPastDate(formatDate(today))).toBe(true);
    expect(isNotPastDate(formatDate(tomorrow))).toBe(true);
  });

  // 年末年始の境界でもゼロ埋めフォーマットが崩れないことを確認
  it("formats year-end dates correctly", () => {
    expect(formatDate(new Date(2026, 11, 31))).toBe("2026-12-31");
    expect(formatDate(new Date(2027, 0, 1))).toBe("2027-01-01");
  });
});
