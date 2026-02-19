import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingFlow } from "./BookingFlow";

describe("BookingFlow", () => {
  // セクション見出しと 4 ステップの番号が表示されることを確認
  it("renders section heading and four step numbers", () => {
    render(<BookingFlow />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  // 矢印UIはコメントアウトされているため、SVGが描画されないことを確認
  it("does not render arrow icon while arrow block is disabled", () => {
    const { container } = render(<BookingFlow />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
