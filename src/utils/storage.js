

export const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };

export const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
