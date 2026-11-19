import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "@/App";

export const click = (n) => fireEvent.click(n);
export const typeIn = (ph, v) => fireEvent.change(screen.getByPlaceholderText(ph), { target: { value: v } });
export const btn = (name) => screen.getByRole("button", { name });
export const pick = (current, label) => {
  click(btn(current));
  click(within(screen.getByRole("option", { name: label })).getByRole("button"));
};
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fmt = (s) => new Date(s + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const dayBtn = (s) => document.querySelector(`[data-date="${s}"]`);
export const col = (label) => screen.getByRole("heading", { name: label, level: 3 }).closest("section");
export const dndData = () => ({ d: "", setData(_, v) { this.d = v; }, getData() { return this.d; }, effectAllowed: "" });

export function signUp(email = "a@b.com") {
  render(<App />);
  click(screen.getByText("Create an account"));
  typeIn("Full name", "Pluto Ali");
  typeIn("Email", email);
  typeIn("Password", "123456");
  click(btn("Create account"));
}
export function newTask(title, { status, priority, date } = {}) {
  click(screen.getAllByRole("button", { name: "New task" })[0]);
  typeIn("Task title", title);
  if (status) pick("To do", status);
  if (priority) pick("Medium", priority);
  if (date) { click(btn("No date")); click(dayBtn(date)); }
  click(btn("Create task"));
}
export const goBoard = () => click(screen.getByRole("link", { name: "Board" }));
