import { render, screen } from "@testing-library/react";
import App from "@/App";
import { click, typeIn, btn, signUp, newTask, goBoard } from "@/test/helpers";

describe("Auth", () => {
  it("redirects to the login page when signed out", () => {
    render(<App />);
    expect(screen.getByText("Sign in to Taskline")).toBeTruthy();
  });

  it("rejects wrong credentials, short passwords and duplicate emails", () => {
    render(<App />);
    typeIn("Email", "x@y.com"); typeIn("Password", "123456");
    click(btn("Sign in"));
    expect(screen.getByText("Wrong email or password.")).toBeTruthy();

    click(screen.getByText("Create an account"));
    typeIn("Full name", "Pluto"); typeIn("Email", "x@y.com"); typeIn("Password", "123");
    click(btn("Create account"));
    expect(screen.getByText("Password must be at least 6 characters.")).toBeTruthy();

    typeIn("Password", "123456");
    click(btn("Create account"));
    expect(screen.getByText(/Welcome back, Pluto/)).toBeTruthy();
    click(screen.getByText("Sign out"));

    click(screen.getByText("Create an account"));
    typeIn("Full name", "Other"); typeIn("Email", "x@y.com"); typeIn("Password", "123456");
    click(btn("Create account"));
    expect(screen.getByText("This email is already registered.")).toBeTruthy();
  });

  it("starts with an empty workspace (no demo data)", () => {
    signUp();
    expect(screen.getByText("Your workspace is empty")).toBeTruthy();
    expect(screen.getByText("Total tasks").previousSibling.textContent).toBe("0");
  });

  it("keeps each user's tasks after sign out / sign in", () => {
    signUp();
    newTask("Persistent task");
    click(screen.getByText("Sign out"));
    typeIn("Email", "a@b.com"); typeIn("Password", "123456");
    click(btn("Sign in"));
    goBoard();
    expect(screen.getByText("Persistent task")).toBeTruthy();
  });

  it("separates data between users", () => {
    signUp("one@x.com");
    newTask("User one task");
    click(screen.getByText("Sign out"));
    click(screen.getByText("Create an account"));
    typeIn("Full name", "Two"); typeIn("Email", "two@x.com"); typeIn("Password", "123456");
    click(btn("Create account"));
    goBoard();
    expect(screen.queryByText("User one task")).toBeNull();
  });
});
