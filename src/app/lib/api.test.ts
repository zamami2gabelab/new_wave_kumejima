import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReservationPayload } from "../domain/types";

const samplePayload: ReservationPayload = {
  leader: {
    name: "テスト太郎",
    phone: "09012345678",
    email: "test@example.com",
  },
  reservationDate: "2026-03-01",
  productId: "PLAN_NONBIRI",
  people: {
    adults: 2,
    children: 1,
    infants: 0,
    totalPeople: 3,
  },
  pickup: {
    required: true,
    hotelName: "ホテルA",
    fee: 1000,
  },
  message: "よろしくお願いします",
  participants: [
    { name: "参加者1", age: 30 },
    { name: "参加者2", age: 12 },
  ],
  totals: {
    totalClientCalc: 0,
  },
};

function createResponse(
  status: number,
  options?: {
    ok?: boolean;
    jsonData?: unknown;
    textData?: string;
    jsonThrows?: boolean;
    textThrows?: boolean;
  },
) {
  // fetch の戻り値（Response）をケース別に簡易生成するヘルパー
  return {
    status,
    ok: options?.ok ?? (status >= 200 && status < 300),
    json: vi.fn(async () => {
      if (options?.jsonThrows) throw new Error("json failed");
      return options?.jsonData;
    }),
    text: vi.fn(async () => {
      if (options?.textThrows) throw new Error("text failed");
      return options?.textData ?? "";
    }),
  } as unknown as Response;
}

describe("submitReservation", () => {
  beforeEach(() => {
    // モック応答の遅延（setTimeout）を高速に検証するため fake timer を使う
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 各テストが相互干渉しないようにモックと環境変数を毎回リセット
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetModules();
  });

  it("returns mock success when endpoint is not set", async () => {
    // エンドポイント未設定時は API 送信せず、開発用モック成功を返す
    vi.stubEnv("VITE_GAS_ENDPOINT", "");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { submitReservation } = await import("./api");
    const promise = submitReservation(samplePayload);

    await vi.advanceTimersByTimeAsync(1000);
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.reservationId).toMatch(/^MOCK-/);
    expect(warnSpy).toHaveBeenCalledWith(
      "VITE_GAS_ENDPOINT is not set. Using mock response.",
    );
  });

  it("posts payload with api key and returns 200 json response", async () => {
    // 正常系: APIキー付き payload を送信し、200 JSON をそのまま返す
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    vi.stubEnv("VITE_GAS_API_KEY", "secret-key");
    const fetchMock = vi.fn(async () =>
      createResponse(200, { ok: true, jsonData: { ok: true, reservationId: "RES-123" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://example.com/gas");
    expect(init.method).toBe("POST");
    expect(init.redirect).toBe("manual");
    expect(init.headers).toEqual({ "Content-Type": "text/plain" });
    const parsedBody = JSON.parse(String(init.body));
    expect(parsedBody.apiKey).toBe("secret-key");
    expect(parsedBody.productId).toBe(samplePayload.productId);
    expect(result).toEqual({ ok: true, reservationId: "RES-123" });
  });

  it("returns parsed error response when status is 302 and body has error json", async () => {
    // 302 でも本文がエラーJSONなら、その内容をエラーとして返す
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    const fetchMock = vi.fn(async () =>
      createResponse(302, { textData: JSON.stringify({ ok: false, error: "validation error" }) }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(result).toEqual({ ok: false, error: "validation error" });
  });

  it("falls back to success when status is 302 and body is not json", async () => {
    // 302 + 非JSON本文は GAS 制約想定で成功扱いにフォールバックする
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn(async () =>
      createResponse(302, { textData: "not-json" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(result.ok).toBe(true);
    expect(result.reservationId).toMatch(/^RES-/);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("falls back to success when status is 302 and reading body fails", async () => {
    // 302 レスポンス本文の読み取りに失敗しても成功扱いにフォールバックする
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn(async () =>
      createResponse(302, { textThrows: true }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(result.ok).toBe(true);
    expect(result.reservationId).toMatch(/^RES-/);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("returns error result when non-OK status is returned", async () => {
    // 200/302 以外は HTTP エラーとして処理され、最終的に ok:false を返す
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () =>
      createResponse(500, { ok: false, textData: "server down" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(result.ok).toBe(false);
    expect(result.error).toContain("HTTP error! status: 500, body: server down");
    expect(errorSpy).toHaveBeenCalled();
  });

  it("returns error result when fetch throws", async () => {
    // 通信失敗など fetch 例外時はエラーメッセージ付きで ok:false を返す
    vi.stubEnv("VITE_GAS_ENDPOINT", "https://example.com/gas");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      throw new Error("network down");
    });
    vi.stubGlobal("fetch", fetchMock);

    const { submitReservation } = await import("./api");
    const result = await submitReservation(samplePayload);

    expect(result).toEqual({ ok: false, error: "network down" });
    expect(errorSpy).toHaveBeenCalled();
  });
});
