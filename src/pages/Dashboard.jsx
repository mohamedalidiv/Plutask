import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import EmptyState from "@/components/EmptyState";
import { STATUSES, PRIORITIES, PRI } from "@/constants";
import { card } from "@/styles";
import { fmt, isOverdue } from "@/utils/dates";
import { useApp } from "@/context/AppContext";

export default function Dashboard() {
  const { tasks, theme, user, openEditor } = useApp();
  const byStatus = STATUSES.map((s) => ({ name: s.label, value: tasks.filter((t) => t.status === s.id).length, color: s.color }));
  const byPri = PRIORITIES.map((p) => ({ name: p.label, value: tasks.filter((t) => t.priority === p.id).length, color: p.color })).filter((d) => d.value);
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const upcoming = tasks.filter((t) => t.due && t.status !== "done").sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5);
  const tt = { background: theme === "dark" ? "#1b1e25" : "#fff", border: "1px solid #8884", borderRadius: 8, color: theme === "dark" ? "#e4e4e7" : "#18181b" };
  const tick = { fill: "#94a3b8", fontSize: 12 };
  const stats = [["Total tasks", tasks.length, "#6366f1"], ["In progress", byStatus[1].value, "#8b5cf6"], ["Completed", done, "#10b981"], ["Overdue", tasks.filter(isOverdue).length, "#f43f5e"]];
  return (
    <div className="space-y-5 max-w-6xl">
      <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]} 👋</h1>
      {!tasks.length && <EmptyState />}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(([l, v, c]) => <div key={l} className={`${card} p-4 relative overflow-hidden`}><span className="absolute inset-x-0 top-0 h-1" style={{ background: c }} /><div className="text-3xl font-bold" style={{ color: c }}>{v}</div><div className="text-sm text-slate-500">{l}</div></div>)}
      </div>
      <div className={`${card} p-4`}>
        <div className="flex justify-between text-sm mb-2"><span>Overall progress</span><span className="text-slate-500">{pct}%</span></div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all" style={{ width: pct + "%" }} /></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${card} p-4`}>
          <h3 className="text-sm font-medium mb-3">Tasks by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byStatus}><CartesianGrid strokeDasharray="3 3" stroke="#8883" vertical={false} />
              <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} cursor={{ fill: "#8882" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>{byStatus.map((d) => <Cell key={d.name} fill={d.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${card} p-4`}>
          <h3 className="text-sm font-medium mb-3">Tasks by priority</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={byPri} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">{byPri.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie>
              <Tooltip contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">{byPri.map((d) => <span key={d.name} className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: d.color }} />{d.name} ({d.value})</span>)}</div>
        </div>
      </div>
      <div className={`${card} p-4`}>
        <h3 className="text-sm font-medium mb-2">Next due</h3>
        {upcoming.length ? upcoming.map((t) => (
          <button key={t.id} onClick={() => openEditor(t)} className="w-full flex items-center gap-2 py-2 text-sm text-left border-t first:border-0 border-slate-200 dark:border-white/10">
            <span className="size-2 rounded-full" style={{ background: PRI[t.priority].color }} />{t.title}
            <span className={`ml-auto text-xs ${isOverdue(t) ? "text-red-500" : "text-slate-500"}`}>{fmt(t.due)}</span>
          </button>
        )) : <p className="text-sm text-slate-500">Nothing due. Add a due date to a task to see it here.</p>}
      </div>
    </div>
  );
}
