import { iso, day, fmt, isOverdue } from "@/utils/dates";
import { read, write } from "@/utils/storage";

describe("date utils", () => {
  it("formats local dates without timezone shifts", () => {
    expect(iso(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(iso(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });

  it("day() is today in local time and offsets by whole days", () => {
    expect(day(0)).toBe(iso(new Date()));
    expect(day(1) > day(0)).toBe(true);
    expect(day(-1) < day(0)).toBe(true);
  });

  it("formats dates for display", () => {
    expect(fmt("2026-11-07")).toBe("Nov 7, 2026");
    expect(fmt("")).toBe("");
  });

  it("detects overdue tasks (not done, due date in the past)", () => {
    expect(isOverdue({ due: day(-1), status: "todo" })).toBe(true);
    expect(isOverdue({ due: day(-1), status: "done" })).toBe(false);
    expect(isOverdue({ due: day(0), status: "todo" })).toBe(false);
    expect(isOverdue({ due: day(3), status: "todo" })).toBe(false);
    expect(isOverdue({ due: "", status: "todo" })).toBeFalsy();
  });
});

describe("storage utils", () => {
  it("round-trips values", () => {
    write("k", { a: 1 });
    expect(read("k", null)).toEqual({ a: 1 });
  });

  it("returns the default for missing or corrupt values", () => {
    expect(read("missing", 5)).toBe(5);
    localStorage.setItem("bad", "{oops");
    expect(read("bad", [])).toEqual([]);
  });
});
