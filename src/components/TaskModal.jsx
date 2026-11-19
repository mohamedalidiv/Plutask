import { useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";
import Select from "@/components/Select";
import { STATUSES, PRIORITIES } from "@/constants";
import { input, primary, ghost, card } from "@/styles";
import { useApp } from "@/context/AppContext";

export default function TaskModal() {
  const { editor, closeEditor, save, remove } = useApp();
  const [f, setF] = useState(null);
  useEffect(() => setF(editor ? { title: "", description: "", status: "todo", priority: "medium", due: "", ...editor } : null), [editor]);
  useEffect(() => {
    if (!f) return;
    const k = (e) => e.key === "Escape" && !document.querySelector('[role="listbox"],[aria-label="Calendar"]') && closeEditor();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [!!f]);
  if (!f) return null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); if (!f.title.trim()) return; save({ ...f, title: f.title.trim() }); closeEditor(); };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && closeEditor()}>
      <form role="dialog" aria-modal="true" aria-label={f.id ? "Edit task form" : "New task form"} onSubmit={submit} className={`${card} w-full max-w-lg p-5 space-y-3`}>
        <h2 className="font-semibold">{f.id ? "Edit task" : "New task"}</h2>
        <input autoFocus required className={input} placeholder="Task title" value={f.title} onChange={set("title")} />
        <textarea rows={3} className={input} placeholder="Description (optional)" value={f.description} onChange={set("description")} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="text-xs text-slate-500"><span className="block mb-1">Status</span>
            <Select value={f.status} onChange={(v) => setF({ ...f, status: v })} options={STATUSES.map((x) => ({ value: x.id, label: x.label, color: x.color }))} />
          </div>
          <div className="text-xs text-slate-500"><span className="block mb-1">Priority</span>
            <Select value={f.priority} onChange={(v) => setF({ ...f, priority: v })} options={PRIORITIES.map((x) => ({ value: x.id, label: x.label, color: x.color }))} />
          </div>
          <div className="text-xs text-slate-500"><span className="block mb-1">Due date</span>
            <DatePicker value={f.due} onChange={(v) => setF({ ...f, due: v })} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          {f.id && <button type="button" className="text-sm text-red-500 mr-auto" onClick={() => { if (confirm("Delete this task?")) { remove(f.id); closeEditor(); } }}>Delete task</button>}
          <button type="button" className={`${ghost} ml-auto`} onClick={closeEditor}>Cancel</button>
          <button className={primary}>{f.id ? "Save changes" : "Create task"}</button>
        </div>
      </form>
    </div>
  );
}
