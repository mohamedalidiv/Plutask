import { useState, useMemo } from "react";
import EmptyState from "@/components/EmptyState";
import Select from "@/components/Select";
import TaskCard from "@/components/TaskCard";
import { STATUSES, PRIORITIES } from "@/constants";
import { input } from "@/styles";
import { useApp } from "@/context/AppContext";

export default function Board() {
  const { tasks, move, openEditor } = useApp();
  const [q, setQ] = useState(""); const [pr, setPr] = useState("all"); const [st, setSt] = useState("all");
  const [over, setOver] = useState(null);
  const shown = useMemo(() => tasks.filter((t) => (pr === "all" || t.priority === pr) && `${t.title} ${t.description}`.toLowerCase().includes(q.toLowerCase())), [tasks, q, pr]);
  const cols = STATUSES.filter((s) => st === "all" || s.id === st);
  return (
    <div className="space-y-4">
      {!tasks.length && <EmptyState />}
      <div className="flex flex-wrap gap-2">
        <input className={`${input} sm:max-w-xs`} placeholder="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select className="w-full sm:w-48" value={pr} onChange={setPr} options={[{ value: "all", label: "All priorities" }, ...PRIORITIES.map((p) => ({ value: p.id, label: p.label, color: p.color }))]} />
        <Select className="w-full sm:w-48" value={st} onChange={setSt} options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((x) => ({ value: x.id, label: x.label, color: x.color }))]} />
      </div>
      <div className={`grid gap-4 items-start ${cols.length > 1 ? "md:grid-cols-2 xl:grid-cols-4" : ""}`}>
        {cols.map((c) => {
          const items = shown.filter((t) => t.status === c.id);
          return (
            <section key={c.id}
              onDragOver={(e) => { e.preventDefault(); setOver(c.id); }}
              onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && setOver(null)}
              onDrop={(e) => { move(e.dataTransfer.getData("text/plain"), c.id); setOver(null); }}
              className={`rounded-xl p-2 min-h-[180px] border transition-colors ${over === c.id ? "border-violet-500 bg-violet-500/10" : "border-transparent bg-slate-100/80 dark:bg-white/[0.04]"}`}>
              <header className="flex items-center gap-2 px-2 py-1.5">
                <span className="size-2.5 rounded-full" style={{ background: c.color, boxShadow: `0 0 0 3px ${c.color}33` }} />
                <h3 className="text-sm font-medium">{c.label}</h3>
                <span className="text-xs text-slate-500">{items.length}</span>
                <button className="ml-auto text-lg leading-none text-slate-400 hover:text-indigo-500" aria-label={`Add task to ${c.label}`} onClick={() => openEditor({ status: c.id })}>+</button>
              </header>
              <div className="space-y-2">
                {items.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
                {!items.length && <p className="text-xs text-slate-500 px-2 py-6 text-center">Drop a task here or press + to add one.</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
