import { useEffect } from "react";

/** Calls close() when the user clicks outside `ref` or presses Escape, while `open` is true. */
export default function useDismiss(open, close, ref) {
  useEffect(() => {
    if (!open) return;
    const away = (e) => !ref.current?.contains(e.target) && close();
    const esc = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
}
