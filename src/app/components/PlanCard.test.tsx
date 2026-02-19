import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlanCard } from "./PlanCard";

const plan = {
  id: "PLAN_NONBIRI",
  name: "のんびりはての浜プラン",
  image: "/image/sample.jpg",
  price: "6000",
  childPrice: "4500",
  duration: "約3時間",
  capacity: "1-10名",
  highlight: "人気",
};

describe("PlanCard", () => {
  // カード本体クリックで詳細ハンドラが呼ばれることを確認
  it("calls onDetailsClick when card body is clicked", async () => {
    const user = userEvent.setup();
    const onDetailsClick = vi.fn();
    render(<PlanCard plan={plan} onDetailsClick={onDetailsClick} />);

    const [card] = screen.getAllByRole("button");
    await user.click(card);

    expect(onDetailsClick).toHaveBeenCalledTimes(1);
  });

  // 内部の「詳細を見る」ボタンでも 1 回だけハンドラが呼ばれることを確認
  it("calls onDetailsClick when details button is clicked once", async () => {
    const user = userEvent.setup();
    const onDetailsClick = vi.fn();
    render(<PlanCard plan={plan} onDetailsClick={onDetailsClick} />);

    const [, detailsButton] = screen.getAllByRole("button");
    await user.click(detailsButton);

    expect(onDetailsClick).toHaveBeenCalledTimes(1);
  });

  // キーボード操作（Enter / Space）でも詳細ハンドラが動作することを確認
  it("calls onDetailsClick with Enter and Space key", async () => {
    const user = userEvent.setup();
    const onDetailsClick = vi.fn();
    render(<PlanCard plan={plan} onDetailsClick={onDetailsClick} />);

    const card = screen.getAllByRole("button")[0];
    card.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onDetailsClick).toHaveBeenCalledTimes(2);
  });
});
