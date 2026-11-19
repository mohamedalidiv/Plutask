import { Navigate, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/Logo";
import { input, primary, card } from "@/styles";
import { useApp } from "@/context/AppContext";

export default function Auth({ mode }) {
  const { user, login, register } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", pw: "" });
  const [err, setErr] = useState("");
  if (user) return <Navigate to="/" replace />;
  const isReg = mode === "register";
  const submit = (e) => {
    e.preventDefault();
    if (isReg && f.pw.length < 6) return setErr("Password must be at least 6 characters.");
    const r = isReg ? register(f.name.trim(), f.email.trim().toLowerCase(), f.pw) : login(f.email.trim().toLowerCase(), f.pw);
    if (r) setErr(r); else nav("/");
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-[#0b0d14] text-slate-900 dark:text-slate-100">
      <div className="hidden lg:flex flex-col justify-center gap-6 p-14 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
        <Logo big />
        <h2 className="text-4xl font-bold leading-tight">Plan it. Move it.<br />Ship it.</h2>
        <p className="text-white/80 max-w-sm">A fast kanban workspace to keep every task, priority and deadline in one place.</p>
      </div>
      <div className="grid place-items-center p-4">
      <form onSubmit={submit} className={`${card} w-full max-w-sm p-6 space-y-4`}>
        <div>
          <h1 className="text-xl font-semibold">{isReg ? "Create your account" : "Sign in to Taskline"}</h1>
          <p className="text-sm text-slate-500 mt-1">{isReg ? "Your tasks stay in this browser." : "Pick up where you left off."}</p>
        </div>
        {isReg && <input required className={input} placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input required type="email" className={input} placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" className={input} placeholder="Password" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button className={`${primary} w-full`}>{isReg ? "Create account" : "Sign in"}</button>
        <p className="text-sm text-center text-slate-500">
          {isReg ? "Have an account? " : "New here? "}
          <Link className="text-violet-500 font-medium hover:underline" to={isReg ? "/login" : "/register"}>{isReg ? "Sign in" : "Create an account"}</Link>
        </p>
      </form>
      </div>
    </div>
  );
}
