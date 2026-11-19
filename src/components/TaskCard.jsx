import { PRI } from "@/constants";
import { card } from "@/styles";
import { fmt, isOverdue } from "@/utils/dates";
import { useApp } from "@/context/AppContext";

export default function TaskCard({ task: t }) {
  const { openEditor, remove } = useApp();
  return (
    <article key={t.id} tabIndex={0} onKeyDown={(e) => e.target === e.currentTarget && e.key === "Enter" && openEditor(t)} draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.id); e.dataTransfer.effectAllowed = "move"; }}
      onClick={() => openEditor(t)} style={{ borderLeft: `3px solid ${PRI[t.priority].color}` }} className={`${card} p-3 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-md transition group`}>
      <div className="flex items-start gap-2">
        <h4 className="text-sm font-medium flex-1">{t.title}</h4>
        <button aria-label="Delete task" className="text-slate-400 hover:text-red-500 px-1 md:opacity-0 md:group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this task?")) remove(t.id); }}>×</button>
      </div>
      {t.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>}
      <div className="flex items-center gap-2 mt-2 text-xs">
        <span className="rounded-full px-2 py-0.5 font-medium" style={{ background: PRI[t.priority].color + "22", color: PRI[t.priority].color }}>{PRI[t.priority].label}</span>
        {t.due && <span className={`ml-auto ${isOverdue(t) ? "text-red-500 font-medium" : "text-slate-500"}`}>{isOverdue(t) ? "Overdue " : ""}{fmt(t.due)}</span>}
      </div>
    </article>
  );
}
