

export default function Logo({ big }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid place-items-center rounded-xl font-bold text-white ${big ? "size-11 text-xl bg-white/20 backdrop-blur" : "size-8 text-sm bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md shadow-violet-500/40"}`}>T</span>
      <span className={`font-bold tracking-tight ${big ? "text-2xl" : "text-lg"}`}>Taskline</span>
    </div>
  );
}
