

export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const day = (n = 0) => iso(new Date(Date.now() + n * 864e5));

export const fmt = (d) => (d ? new Date(d + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const isOverdue = (t) => t.due && t.due < day() && t.status !== "done";
