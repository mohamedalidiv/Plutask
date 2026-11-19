import { useState, useEffect, useRef } from "react";
import useDismiss from "@/hooks/useDismiss";
import { input, card } from "@/styles";
import { iso, day, fmt, MONTHS } from "@/utils/dates";

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: 0, m: 0 });
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const b = value ? new Date(value + "T00:00") : new Date();
    setView({ y: b.getFullYear(), m: b.getMonth() });
  }, [open]);
  useDismiss(open, () => setOpen(false), ref);
  const go = (n) => { const d = new Date(view.y, view.m + n, 1); setView({ y: d.getFullYear(), m: d.getMonth() }); };
  const start = 1 - new Date(view.y, view.m, 1).getDay();
  const cells = Array.from({ length: 42 }, (_, i) => new Date(view.y, view.m, start + i));
  const choose = (v) => { onChange(v); setOpen(false); };
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)} className={`${input} flex items-center gap-2 text-left cursor-pointer`}>
        <svg className="size-4 shrink-0 text-violet-500" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm-2 6v8h12V8H4Z" /></svg>
        <span className={`truncate flex-1 ${value ? "" : "text-slate-400"}`}>{value ? fmt(value) : "No date"}</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Calendar" className={`${card} absolute z-40 right-0 mt-1 w-72 p-3 shadow-xl`}>
          <div className="flex items-center justify-between mb-2">
            <button type="button" aria-label="Previous month" onClick={() => go(-1)} className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-lg">‹</button>
            <div className="text-sm font-semibold">{MONTHS[view.m]} {view.y}</div>
            <button type="button" aria-label="Next month" onClick={() => go(1)} className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-lg">›</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-1">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d) => {
              const v = iso(d), sel = v === value, other = d.getMonth() !== view.m;
              return (
                <button key={v} type="button" data-date={v} onClick={() => choose(v)}
                  className={`h-8 rounded-lg text-sm transition ${sel ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold" : `hover:bg-slate-100 dark:hover:bg-white/10 ${other ? "text-slate-400 dark:text-slate-600" : ""} ${v === day() ? "ring-1 ring-violet-500 font-semibold" : ""}`}`}>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <button type="button" onClick={() => choose("")} className="px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">Clear</button>
            <button type="button" onClick={() => choose(day())} className="px-2 py-1 rounded-lg text-violet-600 dark:text-violet-300 font-semibold hover:bg-violet-500/10">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
