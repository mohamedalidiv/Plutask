import { primary, ghost, card } from "@/styles";
import { useApp } from "@/context/AppContext";

export default function EmptyState() {
  const { openEditor, loadSample } = useApp();
  return (
    <div className={`${card} p-8 text-center bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10`}>
      <h2 className="text-lg font-semibold">Your workspace is empty</h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">Create your first task, or load a few sample tasks to look around.</p>
      <div className="flex justify-center gap-2 flex-wrap">
        <button className={primary} onClick={() => openEditor({})}>Create first task</button>
        <button className={ghost} onClick={loadSample}>Load sample tasks</button>
      </div>
    </div>
  );
}
