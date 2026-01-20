// API送信機能

import type { ReservationPayload, ReservationResponse } from "../domain/types";

const GAS_ENDPOINT = import.meta.env.VITE_GAS_ENDPOINT;

/**
 * 予約データをGAS Web App APIに送信
 */
export async function submitReservation(
  payload: ReservationPayload
): Promise<ReservationResponse> {
  if (!GAS_ENDPOINT) {
    // 開発環境でエンドポイントが設定されていない場合
    console.warn("VITE_GAS_ENDPOINT is not set. Using mock response.");
    // モックレスポンスを返す（開発用）
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待機してローディングをシミュレート
    return {
      ok: true,
      reservationId: `MOCK-${Date.now()}`,
    };
  }

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data: ReservationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to submit reservation:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "予約の送信に失敗しました",
    };
  }
}
