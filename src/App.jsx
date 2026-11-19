import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import Board from "@/pages/Board";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import { AppProvider } from "@/context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="board" element={<Board />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
