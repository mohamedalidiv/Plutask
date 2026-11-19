import { day } from "@/utils/dates";
import { uid } from "@/utils/id";

export const sample = () => [
  { id: uid(), title: "Design onboarding flow", description: "Wireframes for the first-run experience", status: "progress", priority: "high", due: day(2) },
  { id: uid(), title: "Fix date picker bug", description: "", status: "todo", priority: "urgent", due: day(-1) },
  { id: uid(), title: "Write release notes", description: "", status: "review", priority: "low", due: day(5) },
  { id: uid(), title: "Set up CI pipeline", description: "Lint + tests on every PR", status: "done", priority: "medium", due: "" },
  { id: uid(), title: "Audit accessibility", description: "Keyboard focus, contrast", status: "todo", priority: "medium", due: day(7) },
];
