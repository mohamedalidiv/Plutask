import { screen, fireEvent, within } from "@testing-library/react";
import { click, typeIn, btn, pick, col, dndData, signUp, newTask, goBoard } from "@/test/helpers";

describe("Board", () => {
  beforeEach(() => {
    signUp(); goBoard();
    newTask("Alpha task", { priority: "Urgent" });
    newTask("Beta task", { status: "Done" });
  });

  it("moves a card between columns with drag & drop", () => {
    const card = screen.getByText("Alpha task").closest("article");
    const d = dndData();
    fireEvent.dragStart(card, { dataTransfer: d });
    fireEvent.dragOver(col("In progress"), { dataTransfer: d });
    fireEvent.drop(col("In progress"), { dataTransfer: d });
    expect(within(col("In progress")).getByText("Alpha task")).toBeTruthy();
    expect(within(col("To do")).queryByText("Alpha task")).toBeNull();
  });

  it("filters by search text", () => {
    typeIn("Search tasks", "alpha");
    expect(screen.getByText("Alpha task")).toBeTruthy();
    expect(screen.queryByText("Beta task")).toBeNull();
    typeIn("Search tasks", "");
    expect(screen.getByText("Beta task")).toBeTruthy();
  });

  it("filters by priority and by status", () => {
    pick("All priorities", "Urgent");
    expect(screen.queryByText("Beta task")).toBeNull();
    pick("Urgent", "All priorities");
    pick("All statuses", "Done");
    expect(screen.queryByRole("heading", { name: "To do", level: 3 })).toBeNull();
    expect(screen.getByText("Beta task")).toBeTruthy();
    expect(screen.queryByText("Alpha task")).toBeNull();
  });

  it("opens and closes dropdowns (outside click / Escape)", () => {
    click(btn("All statuses"));
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
    click(btn("All statuses"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows the empty state on an empty board and loads sample tasks on request", () => {
    for (const b of screen.getAllByLabelText("Delete task")) click(b);
    expect(screen.getByText("Your workspace is empty")).toBeTruthy();
    click(btn("Load sample tasks"));
    expect(screen.getByText("Design onboarding flow")).toBeTruthy();
  });
});
