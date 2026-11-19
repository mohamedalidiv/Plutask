import { Navigate, NavLink, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import TaskModal from "@/components/TaskModal";
import { primary, ghost } from "@/styles";
import { useApp } from "@/context/AppContext";

export default function Layout() {
  const { user, theme, setTheme, logout, openEditor } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  const link = ({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-gradient-to-r from-indigo-500/15 to-fuchsia-500/15 text-violet-700 dark:text-violet-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"}`;
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-slate-100">
      <aside className="md:w-56 md:min-h-screen md:flex-col flex items-center md:items-stretch gap-2 p-3 bg-white dark:bg-[#0f121b] border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10">
        <div className="px-2 py-2 md:mb-3"><Logo /></div>
        <nav className="flex md:flex-col gap-1 flex-1">
          <NavLink end to="/" className={link}>Dashboard</NavLink>
          <NavLink to="/board" className={link}>Board</NavLink>
        </nav>
        <button className={`${primary} hidden md:block`} onClick={() => openEditor({})}>New task</button>
        <button className={ghost} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Light mode" : "Dark mode"}</button>
        <div className="hidden md:block text-xs text-slate-500 px-3 pt-2 truncate">{user.name}</div>
        <button className="text-sm text-left px-3 py-1 text-slate-500 hover:text-red-500" onClick={logout}>Sign out</button>
      </aside>
      <main className="flex-1 p-4 md:p-6 min-w-0"><Outlet /></main>
      <button className={`${primary} md:hidden fixed bottom-4 right-4 shadow-lg`} onClick={() => openEditor({})}>New task</button>
      <TaskModal />
    </div>
  );
}
