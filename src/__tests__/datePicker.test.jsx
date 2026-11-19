import { screen, fireEvent, within } from "@testing-library/react";
import { click, typeIn, btn, iso, fmt, dayBtn, signUp, newTask, goBoard } from "@/test/helpers";

describe("Date picker", () => {
  const now = new Date();
  const mid = iso(new Date(now.getFullYear(), now.getMonth(), 15));
  beforeEach(() => { signUp(); goBoard(); });

  it("opens, picks a date, closes, and shows the date on the card", () => {
    click(screen.getAllByRole("button", { name: "New task" })[0]);
    typeIn("Task title", "With date");
    click(btn("No date"));
    expect(screen.getByRole("dialog", { name: "Calendar" })).toBeTruthy();
    click(dayBtn(mid));
    expect(screen.queryByRole("dialog", { name: "Calendar" })).toBeNull();
    expect(btn(fmt(mid))).toBeTruthy();
    click(btn("Create task"));
    expect(within(screen.getByText("With date").closest("article")).getByText(new RegExp(fmt(mid)))).toBeTruthy();
  });

  it("navigates months and flags past dates as overdue", () => {
    click(screen.getAllByRole("button", { name: "New task" })[0]);
    typeIn("Task title", "Late one");
    click(btn("No date"));
    click(screen.getByLabelText("Previous month"));
    const prev = iso(new Date(now.getFullYear(), now.getMonth() - 1, 10));
    click(dayBtn(prev));
    click(btn("Create task"));
    expect(screen.getByText(/Overdue/)).toBeTruthy();
  });

  it("goes to next month, sets Today, and clears", () => {
    click(screen.getAllByRole("button", { name: "New task" })[0]);
    typeIn("Task title", "Dates");
    click(btn("No date"));
    click(screen.getByLabelText("Next month"));
    expect(dayBtn(iso(new Date(now.getFullYear(), now.getMonth() + 1, 10)))).toBeTruthy();
    click(btn("Today"));
    expect(btn(fmt(iso(now)))).toBeTruthy();
    click(btn(fmt(iso(now))));
    click(btn("Clear"));
    expect(btn("No date")).toBeTruthy();
  });

  it("keeps the saved date when editing and lets you change it", () => {
    newTask("Editable", { date: mid });
    click(screen.getByText("Editable"));
    expect(btn(fmt(mid))).toBeTruthy();
    click(btn(fmt(mid)));
    const other = iso(new Date(now.getFullYear(), now.getMonth(), 20));
    click(dayBtn(other));
    click(btn("Save changes"));
    expect(screen.getByText(new RegExp(fmt(other)))).toBeTruthy();
  });

  it("Escape closes the calendar first, then the modal", () => {
    click(screen.getAllByRole("button", { name: "New task" })[0]);
    click(btn("No date"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Calendar" })).toBeNull();
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
