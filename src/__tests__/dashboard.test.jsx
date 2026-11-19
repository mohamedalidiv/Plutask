import { screen, within } from "@testing-library/react";
import { click, btn, signUp } from "@/test/helpers";

describe("Dashboard", () => {
  it("shows correct stats for the sample data", () => {
    signUp();
    click(btn("Load sample tasks"));
    const stat = (l) => screen.getByText(l).previousSibling.textContent;
    expect(stat("Total tasks")).toBe("5");
    expect(stat("In progress")).toBe("1");
    expect(stat("Completed")).toBe("1");
    expect(stat("Overdue")).toBe("1");
    expect(screen.getByText("20%")).toBeTruthy();
    expect(screen.getByText("Tasks by status")).toBeTruthy();
    expect(screen.getByText("Tasks by priority")).toBeTruthy();
  });

  it("opens a task from the Next due list", () => {
    signUp();
    click(btn("Load sample tasks"));
    click(within(screen.getByText("Next due").parentElement).getAllByRole("button")[0]);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("toggles dark mode and remembers it", () => {
    signUp();
    click(btn("Dark mode"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("tf_theme")).toBe('"dark"');
    click(btn("Light mode"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
