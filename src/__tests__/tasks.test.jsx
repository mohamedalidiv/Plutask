import { screen, fireEvent, within } from "@testing-library/react";
import { click, typeIn, btn, pick, col, signUp, newTask, goBoard } from "@/test/helpers";

describe("Tasks CRUD", () => {
  beforeEach(() => { signUp(); goBoard(); });

  it("creates a task in the chosen status and priority", () => {
    newTask("Ship it", { status: "In progress", priority: "Urgent" });
    const card = within(col("In progress")).getByText("Ship it").closest("article");
    expect(within(card).getByText("Urgent")).toBeTruthy();
  });

  it("creates a task from a column's + button with that status preselected", () => {
    click(screen.getByLabelText("Add task to In review"));
    typeIn("Task title", "From plus");
    click(btn("Create task"));
    expect(within(col("In review")).getByText("From plus")).toBeTruthy();
  });

  it("does not create a task with an empty title", () => {
    click(screen.getAllByRole("button", { name: "New task" })[0]);
    fireEvent.submit(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("edits title, description, status and priority", () => {
    newTask("Old title");
    click(screen.getByText("Old title"));
    typeIn("Task title", "New title");
    typeIn("Description (optional)", "Some details");
    pick("To do", "Done");
    pick("Medium", "High");
    click(btn("Save changes"));
    const card = within(col("Done")).getByText("New title").closest("article");
    expect(within(card).getByText("Some details")).toBeTruthy();
    expect(within(card).getByText("High")).toBeTruthy();
    expect(screen.queryByText("Old title")).toBeNull();
  });

  it("deletes from the card and from the modal", () => {
    newTask("Delete me A"); newTask("Delete me B");
    click(screen.getAllByLabelText("Delete task")[0]);
    expect(screen.getAllByLabelText("Delete task").length).toBe(1);
    click(screen.getByText(/Delete me/)); click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete task" }));
    expect(screen.queryByText(/Delete me/)).toBeNull();
  });

  it("keeps the task when delete is not confirmed", () => {
    newTask("Keep me");
    const orig = window.confirm; window.confirm = () => false;
    click(screen.getByLabelText("Delete task"));
    window.confirm = orig;
    expect(screen.getByText("Keep me")).toBeTruthy();
  });

  it("closes the modal with Cancel, Escape and a backdrop click", () => {
    const open = () => click(screen.getAllByRole("button", { name: "New task" })[0]);
    open(); click(btn("Cancel")); expect(screen.queryByRole("dialog")).toBeNull();
    open(); fireEvent.keyDown(document, { key: "Escape" }); expect(screen.queryByRole("dialog")).toBeNull();
    open(); fireEvent.mouseDown(screen.getByRole("dialog").parentElement); expect(screen.queryByRole("dialog")).toBeNull();
  });
});
