import { useState, useEffect, createContext, useContext } from "react";
import { sample } from "@/data/sample";
import { read, write } from "@/utils/storage";
import { uid } from "@/utils/id";

const Ctx = createContext();

export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => read("tf_session", null));
  const [tasks, setTasks] = useState(() => { const u = read("tf_session", null); return u ? read("tf_tasks_" + u.email, []) : []; });
  const [theme, setTheme] = useState(() => read("tf_theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [editor, setEditor] = useState(null);

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); write("tf_theme", theme); }, [theme]);
  useEffect(() => { if (user) write("tf_tasks_" + user.email, tasks); }, [tasks]);

  const startSession = (u, t) => { write("tf_session", u); setTasks(t); setUser(u); };
  const register = (name, email, pw) => {
    const users = read("tf_users", []);
    if (users.some((u) => u.email === email)) return "This email is already registered.";
    write("tf_users", [...users, { name, email, pw }]);
    startSession({ name, email }, []);
  };
  const login = (email, pw) => {
    const u = read("tf_users", []).find((x) => x.email === email && x.pw === pw);
    if (!u) return "Wrong email or password.";
    startSession({ name: u.name, email }, read("tf_tasks_" + email, []));
  };
  const logout = () => { localStorage.removeItem("tf_session"); setUser(null); setTasks([]); };

  const save = (t) => setTasks((all) => (t.id ? all.map((x) => (x.id === t.id ? t : x)) : [{ ...t, id: uid() }, ...all]));
  const remove = (id) => setTasks((all) => all.filter((x) => x.id !== id));
  const loadSample = () => setTasks((all) => [...sample(), ...all]);
  const move = (id, status) => setTasks((all) => all.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <Ctx.Provider value={{ user, tasks, theme, setTheme, register, login, logout, save, remove, move, loadSample, editor, openEditor: setEditor, closeEditor: () => setEditor(null) }}>
      {children}
    </Ctx.Provider>
  );
}
