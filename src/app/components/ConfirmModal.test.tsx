import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ReservationFormData } from "../domain/types";
import { ConfirmModal } from "./ConfirmModal";

vi.mock("../domain/pricing", () => ({
  // 金額表示検証を安定させるため、計算結果を固定値にする
  calculateTotals: vi.fn(() => 12345),
}));

vi.mock("../domain/masters", () => ({
  // 商品名表示検証を安定させるため、商品マスターを固定値でモックする
  getPlanProduct: vi.fn(() => ({ name: "テストプラン" })),
}));

const baseFormData: ReservationFormData = {
  leader: {
    name: "代表 太郎",
    phone: "09012345678",
    email: "leader@example.com",
  },
  reservationDate: "2026-04-10",
  productId: "PLAN_NONBIRI",
  people: {
    adults: 2,
    children: 1,
    infants: 1,
    totalPeople: 4,
  },
  pickup: {
    required: true,
    hotelName: "テストホテル",
    fee: 1000,
  },
  message: "自由メッセージ",
  participants: [
    { name: "参加者A", age: 20 },
    { name: "参加者B", age: 10 },
  ],
  totals: {
    totalClientCalc: 0,
  },
};

describe("ConfirmModal", () => {
  // 通常表示時に、主要な予約情報が正しく描画されることを確認
  it("renders default confirmation with dynamic values", () => {
    render(
      <ConfirmModal
        open
        formData={baseFormData}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isLoading={false}
        isSuccess={false}
        isError={false}
      />,
    );

    expect(screen.getByText("2026-04-10")).toBeInTheDocument();
    expect(screen.getByText("テストプラン")).toBeInTheDocument();
    expect(screen.getByText("テストホテル")).toBeInTheDocument();
    expect(screen.getByText("自由メッセージ")).toBeInTheDocument();
    expect(screen.getByText(/12,345/)).toBeInTheDocument();
    expect(screen.getByText(/参加者A/)).toBeInTheDocument();
    expect(screen.getByText(/参加者B/)).toBeInTheDocument();
  });

  // pickup/message/participants が空のとき、関連ブロックが表示されないことを確認
  it("hides pickup and participants sections when values are empty", () => {
    const formData: ReservationFormData = {
      ...baseFormData,
      pickup: { required: false, hotelName: "", fee: 0 },
      participants: [],
      message: "",
    };

    render(
      <ConfirmModal
        open
        formData={formData}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isLoading={false}
        isSuccess={false}
        isError={false}
      />,
    );

    expect(screen.queryByText("テストホテル")).not.toBeInTheDocument();
    expect(screen.queryByText(/参加者A/)).not.toBeInTheDocument();
    expect(screen.queryByText("自由メッセージ")).not.toBeInTheDocument();
  });

  // 通常表示の確定ボタン押下で onSubmit が呼ばれることを確認
  it("calls onSubmit from default mode action button", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ConfirmModal
        open
        formData={baseFormData}
        onSubmit={onSubmit}
        onClose={vi.fn()}
        isLoading={false}
        isSuccess={false}
        isError={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "予約を確定する" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  // 成功モード時に完了画面の内容が表示されることを確認
  it("renders success mode content", () => {
    render(
      <ConfirmModal
        open
        formData={baseFormData}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
        isLoading={false}
        isSuccess
        isError={false}
      />,
    );

    expect(screen.getByText("2026-04-10")).toBeInTheDocument();
    expect(screen.getByText("テストプラン")).toBeInTheDocument();
    expect(screen.getByText(/12,345/)).toBeInTheDocument();
  });

  // エラーモード時にエラーメッセージ表示と再試行アクションが動作することを確認
  it("renders error mode and calls retry action", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <ConfirmModal
        open
        formData={baseFormData}
        onSubmit={onSubmit}
        onClose={vi.fn()}
        isLoading={false}
        isSuccess={false}
        isError
        errorMessage="custom error"
      />,
    );

    expect(screen.getByText("custom error")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "再試行" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
