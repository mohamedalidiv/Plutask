

export const STATUSES = [
  { id: "todo", label: "To do", color: "#38bdf8" },
  { id: "progress", label: "In progress", color: "#8b5cf6" },
  { id: "review", label: "In review", color: "#f59e0b" },
  { id: "done", label: "Done", color: "#10b981" },
];

export const PRIORITIES = [
  { id: "low", label: "Low", color: "#22c55e" },
  { id: "medium", label: "Medium", color: "#3b82f6" },
  { id: "high", label: "High", color: "#f97316" },
  { id: "urgent", label: "Urgent", color: "#f43f5e" },
];

export const PRI = Object.fromEntries(PRIORITIES.map((p) => [p.id, p]));
