import { useState, useRef } from "react";
import useDismiss from "@/hooks/useDismiss";
import { input, card } from "@/styles";

export default function Select({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, () => setOpen(false), ref);
  const cur = options.find((o) => o.value === value) || options[0];
  const dot = (o) => o.color && <span className="size-2 rounded-full shrink-0" style={{ background: o.color }} />;
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} className={`${input} flex items-center gap-2 text-left cursor-pointer`}>
        {dot(cur)}<span className="truncate flex-1">{cur.label}</span>
        <svg className={`size-5 shrink-0 text-violet-500 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7.5 10 12l4.5-4.5z" /></svg>
      </button>
      {open && (
        <ul role="listbox" className={`${card} absolute z-40 mt-1 w-full min-w-[11rem] max-h-64 overflow-auto p-1 shadow-xl`}>
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 text-left rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10 ${o.value === value ? "font-semibold text-violet-600 dark:text-violet-300" : ""}`}>
                {dot(o)}{o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
