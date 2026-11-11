Object.assign(P, {
  cal: "M7 3v4M17 3v4M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  gantt: "M4 6h8M8 12h10M6 18h9",
  team: "M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2-2.8M16 5.2a3 3 0 0 1 0 5.6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12l2-1 .5-1.7-1-2 1.4-1.4 2 1L10.600 6l1-2h2l1 2 1.700.5 2-1 1.400 1.400-1 2L19 11l2 1v2l-2 1-.5 1.700 1 2-1.400 1.400-2-1L14 20l-1 2h-2l-1-2-1.700-.5-2 1-1.400-1.400 1-2L5 15l-2-1z",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  menu: "M4 6h16M4 12h16M4 18h16",
  out: "M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6"
});
const ROLES = ["Owner", "Engineer", "Designer", "Product manager", "QA"];
const Modal = ({
  title,
  onClose,
  children
}) => /*#__PURE__*/React.createElement("div", {
  className: "scrim",
  onClick: onClose
}, /*#__PURE__*/React.createElement("div", {
  className: "modal",
  role: "dialog",
  "aria-label": title,
  onClick: e => e.stopPropagation()
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    fontSize: 20
  }
}, title), children));
function LineChart({
  labels,
  series,
  h = 250,
  fmtV = v => v
}) {
  const ref = useRef();
  const [i, setI] = useState(null);
  const uid = useRef("g" + Math.random().toString(36).slice(2, 7)).current;
  const n = labels.length,
    W = 720,
    pl = 36,
    pr = 16,
    pt = 16,
    pb = 28,
    sw = (W - pl - pr) / Math.max(n - 1, 1);
  const mx = Math.max(10, Math.ceil(Math.max(...series.flatMap(s => s.d)) / 10) * 10);
  const x = k => pl + k * sw,
    y = v => pt + (1 - v / mx) * (h - pt - pb);
  const path = d => d.map((v, k) => {
    if (!k) return `M${x(0)} ${y(v)}`;
    const m = (x(k) + x(k - 1)) / 2;
    return `C${m} ${y(d[k - 1])} ${m} ${y(v)} ${x(k)} ${y(v)}`;
  }).join("");
  const mv = e => {
    const r = ref.current.getBoundingClientRect();
    setI(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width * W - pl) / sw))));
  };
  const step = Math.ceil(n / 7);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    ref: ref,
    viewBox: `0 0 ${W} ${h}`,
    style: {
      width: "100%",
      display: "block",
      touchAction: "pan-y"
    },
    onPointerMove: mv,
    onPointerDown: mv,
    onPointerLeave: () => setI(null),
    role: "img",
    "aria-label": "Line chart"
  }, /*#__PURE__*/React.createElement("defs", null, series.map((s, j) => /*#__PURE__*/React.createElement("linearGradient", {
    key: j,
    id: uid + j,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: s.c,
    stopOpacity: ".22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: s.c,
    stopOpacity: "0"
  })))), [0, 1, 2, 3, 4].map(t => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("line", {
    x1: pl,
    x2: W - pr,
    y1: y(mx * t / 4),
    y2: y(mx * t / 4),
    stroke: "#292b33",
    strokeDasharray: t ? "3 4" : ""
  }), /*#__PURE__*/React.createElement("text", {
    x: pl - 8,
    y: y(mx * t / 4) + 4,
    textAnchor: "end",
    fill: "#6b7280",
    fontSize: "11",
    fontFamily: "JetBrains Mono"
  }, Math.round(mx * t / 4)))), labels.map((l, k) => k % step === 0 && /*#__PURE__*/React.createElement("text", {
    key: k,
    x: x(k),
    y: h - 8,
    textAnchor: "middle",
    fill: "#6b7280",
    fontSize: "11",
    fontFamily: "JetBrains Mono"
  }, l)), series.map((s, j) => s.area && /*#__PURE__*/React.createElement("path", {
    key: "a" + j,
    d: path(s.d) + `L${x(n - 1)} ${y(0)}L${x(0)} ${y(0)}Z`,
    fill: `url(#${uid}${j})`
  })), series.map((s, j) => /*#__PURE__*/React.createElement("path", {
    key: j,
    d: path(s.d),
    fill: "none",
    stroke: s.c,
    strokeWidth: "2",
    strokeDasharray: s.dash,
    strokeLinecap: "round"
  })), i != null && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: x(i),
    x2: x(i),
    y1: pt,
    y2: h - pb,
    stroke: "#6b7280",
    strokeDasharray: "3 3"
  }), series.map((s, j) => /*#__PURE__*/React.createElement("circle", {
    key: j,
    cx: x(i),
    cy: y(s.d[i]),
    r: "4.5",
    fill: "#101114",
    stroke: s.c,
    strokeWidth: "2"
  })))), i != null && /*#__PURE__*/React.createElement("div", {
    className: "tip",
    style: {
      left: `clamp(75px,${x(i) / W * 100}%,calc(100% - 75px))`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono sub",
    style: {
      marginBottom: 4
    }
  }, labels[i]), series.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: "row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: s.c
    }
  }), s.n, /*#__PURE__*/React.createElement("b", {
    className: "sp",
    style: {
      fontWeight: 500
    }
  }, fmtV(s.d[i]))))));
}
function Chart({
  range,
  tasks
}) {
  const n = {
    "7D": 7,
    "14D": 14,
    "30D": 30
  }[range] || 7;
  const days = Array.from({
    length: n
  }, (_, k) => off(k - n + 1));
  return /*#__PURE__*/React.createElement(LineChart, {
    labels: days.map(fmt),
    series: [{
      n: "Created",
      c: "#60a5fa",
      d: days.map(d => tasks.filter(t => t.created === d).length)
    }, {
      n: "Completed",
      c: "#8b5cf6",
      d: days.map(d => tasks.filter(t => t.doneAt === d).length),
      area: 1
    }],
    fmtV: v => v + (v === 1 ? " task" : " tasks")
  });
}
function Reports({
  tasks,
  projs,
  team,
  toast
}) {
  const [r, setR] = useState("14D"),
    [q, setQ] = useState("");
  const n = {
      "7D": 7,
      "14D": 14,
      "30D": 30
    }[r],
    days = Array.from({
      length: n
    }, (_, k) => off(k - n + 1));
  const tot = tasks.length,
    done = tasks.filter(t => t.s === "done").length;
  const dl = tasks.filter(t => t.doneAt && t.date),
    ont = dl.length ? pct(dl.filter(t => t.doneAt <= t.date).length, dl.length) + "%" : "—";
  const dn = tasks.filter(t => t.doneAt && t.created),
    cyc = dn.length ? (dn.reduce((a, t) => a + dd(t.created, t.doneAt), 0) / dn.length).toFixed(1) + " days avg cycle" : "No cycle time yet";
  const rem = days.map(d => tasks.filter(t => (t.created || "0") <= d && !(t.doneAt && t.doneAt <= d)).length),
    cum = days.map(d => tasks.filter(t => t.doneAt && t.doneAt <= d).length);
  const cnt = k => tasks.filter(t => t.p === k).length,
    data = [["urgent", "#f43f5e"], ["high", "#f59e0b"], ["med", "#60a5fa"], ["low", "#10b981"]];
  let acc = 0;
  const R = 62,
    C = 2 * Math.PI * R;
  const rows = projs.filter(p => (p.n + p.lead).toLowerCase().includes(q.toLowerCase()));
  const exp = () => {
    const c = [["Project", "Lead", "Done", "Total", "Linked tasks", "Status", "Due"], ...rows.map(p => [p.n, p.lead, p.done, p.tot, tasks.filter(t => t.proj === p.id).length, PS[p.st], p.due])].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([c], {
      type: "text/csv"
    }));
    a.download = "report.csv";
    a.click();
    toast("report.csv downloaded");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Reports"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Built from your tasks, projects and team.")), /*#__PURE__*/React.createElement("div", {
    className: "sp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: exp
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "down"
  }), "Export CSV"))), /*#__PURE__*/React.createElement("div", {
    className: "kpis"
  }, [["Completed", done, "of " + tot + " tasks"], ["Open tasks", tot - done, cyc], ["Completion rate", tot ? pct(done, tot) + "%" : "—", "all tasks"], ["On-time delivery", ont, dl.length ? dl.length + " finished with a due date" : "No finished tasks yet"]].map(k => /*#__PURE__*/React.createElement("div", {
    key: k[0],
    className: "card kpi"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, k[0]), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, k[1]), /*#__PURE__*/React.createElement("span", {
    className: "d",
    style: {
      color: "var(--t2)"
    }
  }, k[2])))), /*#__PURE__*/React.createElement("div", {
    className: "g2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Open vs completed"), /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      fontSize: 13
    }
  }, "Tasks over the selected period")), /*#__PURE__*/React.createElement("div", {
    className: "seg sp"
  }, ["7D", "14D", "30D"].map(x => /*#__PURE__*/React.createElement("button", {
    key: x,
    className: r === x ? "on" : "",
    onClick: () => setR(x)
  }, x)))), /*#__PURE__*/React.createElement(LineChart, {
    labels: days.map(fmt),
    series: [{
      n: "Open",
      c: "#8b5cf6",
      d: rem,
      area: 1
    }, {
      n: "Completed",
      c: "#10b981",
      d: cum
    }],
    fmtV: v => v + (v === 1 ? " task" : " tasks")
  })), /*#__PURE__*/React.createElement("div", {
    className: "card pad"
  }, /*#__PURE__*/React.createElement("h3", null, "Priority split"), /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      fontSize: 13
    }
  }, tot, " tasks"), tot ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 160 160",
    style: {
      width: 160,
      display: "block",
      margin: "10px auto"
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: "rotate(-90 80 80)"
  }, data.map(([k, c]) => {
    const L = cnt(k) / tot * C;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: k,
      cx: "80",
      cy: "80",
      r: R,
      fill: "none",
      stroke: c,
      strokeWidth: "18",
      strokeDasharray: `${Math.max(L - 2, 0)} ${C}`,
      strokeDashoffset: -acc
    });
    acc += L;
    return el;
  })), /*#__PURE__*/React.createElement("text", {
    x: "80",
    y: "86",
    textAnchor: "middle",
    fill: "#f9fafb",
    fontSize: "26",
    fontWeight: "600"
  }, tot)), data.map(([k, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "row",
    style: {
      padding: "3px 0"
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: c
    }
  }), PRI[k][0], /*#__PURE__*/React.createElement("span", {
    className: "sp mono sub"
  }, cnt(k))))) : /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Create tasks to see the split."))), /*#__PURE__*/React.createElement("div", {
    className: "card pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: 12
    }
  }, "Team workload"), team.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "row",
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    n: t.name
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 130,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "bar",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: t.load + "%",
      background: t.load > 90 ? "var(--bad)" : "var(--v)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      width: 40,
      textAlign: "right",
      color: t.load > 90 ? "var(--bad)" : "var(--t2)"
    }
  }, t.load, "%"))), !team.length && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Add team members to track workload.")), /*#__PURE__*/React.createElement("div", {
    className: "card pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Projects"), /*#__PURE__*/React.createElement("input", {
    className: "inp sp",
    placeholder: "Filter projects",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Project"), /*#__PURE__*/React.createElement("th", null, "Lead"), /*#__PURE__*/React.createElement("th", null, "Progress"), /*#__PURE__*/React.createElement("th", null, "Linked tasks"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Due"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id
  }, /*#__PURE__*/React.createElement("td", null, p.n), /*#__PURE__*/React.createElement("td", {
    className: "sub"
  }, p.lead), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, p.done, "/", p.tot, " (", pct(p.done, p.tot), "%)"), /*#__PURE__*/React.createElement("td", {
    className: "mono"
  }, tasks.filter(t => t.proj === p.id).length), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "badge s-" + p.st
  }, PS[p.st])), /*#__PURE__*/React.createElement("td", {
    className: "mono sub"
  }, p.due))), !rows.length && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    className: "empty"
  }, projs.length ? "No projects match." : "No projects yet."))))));
}
function Login({
  onAuth
}) {
  const [mode, setMode] = useState("in");
  const [f, setF] = useState({
    name: "",
    email: "",
    pw: ""
  });
  const [err, setErr] = useState({});
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const submit = e => {
    e.preventDefault();
    const er = {},
      em = f.email.trim().toLowerCase();
    if (mode === "up" && f.name.trim().length < 2) er.name = "Enter your full name";
    if (!EMAIL.test(em)) er.email = "Enter a valid email, like name@company.com";
    if (f.pw.length < 6) er.pw = "Use at least 6 characters";
    setErr(er);
    if (Object.keys(er).length) return;
    const acc = JSON.parse(localStorage.getItem("tl:accounts") || "[]"),
      ex = acc.find(a => a.email === em);
    if (mode === "up") {
      if (ex) return setErr({
        email: "This email already has an account. Sign in instead."
      });
      localStorage.setItem("tl:accounts", JSON.stringify([...acc, {
        name: f.name.trim(),
        email: em,
        pw: hash(f.pw)
      }]));
      onAuth({
        name: f.name.trim(),
        email: em
      });
    } else {
      if (!ex || ex.pw !== hash(f.pw)) return setErr({
        pw: "Email or password is incorrect"
      });
      onAuth({
        name: ex.name,
        email: em
      });
    }
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "login"
  }, /*#__PURE__*/React.createElement("form", {
    className: "card",
    onSubmit: submit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 5h14M3 12h18M3 19h10",
    stroke: "#8b5cf6",
    strokeWidth: "3",
    strokeLinecap: "round"
  })), "Plutask"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24
    }
  }, mode === "in" ? "Sign in to your workspace" : "Create your account"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, mode === "in" ? "Pick up where you left off." : "Free to try. Your data stays in this browser.")), mode === "up" && /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Full name", /*#__PURE__*/React.createElement("input", {
    className: "inp",
    autoComplete: "name",
    value: f.name,
    onChange: set("name")
  }), err.name && /*#__PURE__*/React.createElement("span", {
    className: "err"
  }, err.name)), /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Email", /*#__PURE__*/React.createElement("input", {
    className: "inp",
    type: "email",
    autoComplete: "email",
    placeholder: "name@company.com",
    value: f.email,
    onChange: set("email")
  }), err.email && /*#__PURE__*/React.createElement("span", {
    className: "err"
  }, err.email)), /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Password", /*#__PURE__*/React.createElement("input", {
    className: "inp",
    type: "password",
    autoComplete: mode === "in" ? "current-password" : "new-password",
    value: f.pw,
    onChange: set("pw")
  }), err.pw && /*#__PURE__*/React.createElement("span", {
    className: "err"
  }, err.pw)), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    style: {
      justifyContent: "center"
    }
  }, mode === "in" ? "Sign in" : "Create account"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn",
    style: {
      justifyContent: "center"
    },
    onClick: () => onAuth({
      name: "Alex Vance",
      email: "alex@plutask.dev"
    })
  }, "Continue with demo account"), /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      textAlign: "center"
    }
  }, mode === "in" ? "New here? " : "Already registered? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      color: "var(--b)"
    },
    onClick: () => {
      setMode(mode === "in" ? "up" : "in");
      setErr({});
    }
  }, mode === "in" ? "Create an account" : "Sign in"))));
}
function Projects({
  ps,
  setPs,
  tasks,
  team,
  pid,
  setPid,
  open,
  newTask,
  toast
}) {
  const [f, setF] = useState("all"),
    [q, setQ] = useState(""),
    [sort, setSort] = useState("due"),
    [pf, setPf] = useState("all"),
    [m, setM] = useState(false);
  const [nw, setNw] = useState({
    n: "",
    d: "",
    lead: team[0] ? team[0].name : "",
    end: off(30),
    pr: "med"
  });
  const p = ps.find(x => x.id === pid);
  if (p) {
    const pt = tasks.filter(t => t.proj === p.id),
      u = o => setPs(a => a.map(x => x.id === p.id ? {
        ...x,
        ...o
      } : x));
    const del = () => {
      if (confirm("Delete " + p.n + "? This can't be undone.")) {
        setPs(a => a.filter(x => x.id !== p.id));
        setPid(null);
        toast("Project deleted");
      }
    };
    const dup = () => {
      setPs(a => [{
        ...p,
        id: "p" + Date.now(),
        n: p.n + " (copy)"
      }, ...a]);
      setPid(null);
      toast("Project duplicated");
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ph"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      onClick: () => setPid(null)
    }, /*#__PURE__*/React.createElement(Ic, {
      n: "left",
      s: 14
    }), "All projects"), /*#__PURE__*/React.createElement("div", {
      className: "sp"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      onClick: dup
    }, "Duplicate"), /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      style: {
        color: "var(--bad)"
      },
      onClick: del
    }, /*#__PURE__*/React.createElement(Ic, {
      n: "trash",
      s: 14
    }), "Delete"))), /*#__PURE__*/React.createElement("div", {
      className: "g2b",
      style: {
        gridTemplateColumns: "1.3fr 1fr"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card pad",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "inp",
      style: {
        fontSize: 22,
        height: 44,
        fontWeight: 600
      },
      value: p.n,
      onChange: e => u({
        n: e.target.value
      }),
      "aria-label": "Project name"
    }), /*#__PURE__*/React.createElement("textarea", {
      className: "inp",
      style: {
        height: 80,
        padding: 10,
        resize: "none"
      },
      value: p.d,
      onChange: e => u({
        d: e.target.value
      }),
      "aria-label": "Description"
    }), /*#__PURE__*/React.createElement("div", {
      className: "fgrid"
    }, /*#__PURE__*/React.createElement("label", {
      className: "fl"
    }, "Status", /*#__PURE__*/React.createElement("select", {
      value: p.st,
      onChange: e => u({
        st: e.target.value
      })
    }, Object.entries(PS).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, v)))), /*#__PURE__*/React.createElement("label", {
      className: "fl"
    }, "Priority", /*#__PURE__*/React.createElement("select", {
      value: p.pr,
      onChange: e => u({
        pr: e.target.value
      })
    }, Object.entries(PRI).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, v[0])))), /*#__PURE__*/React.createElement("label", {
      className: "fl"
    }, "Lead", /*#__PURE__*/React.createElement("select", {
      value: p.lead,
      onChange: e => u({
        lead: e.target.value
      })
    }, team.map(t => /*#__PURE__*/React.createElement("option", {
      key: t.id
    }, t.name)))), /*#__PURE__*/React.createElement("label", {
      className: "fl"
    }, "Start", /*#__PURE__*/React.createElement("input", {
      type: "date",
      className: "inp",
      value: p.start,
      onChange: e => u({
        start: e.target.value
      })
    })), /*#__PURE__*/React.createElement("label", {
      className: "fl"
    }, "Due", /*#__PURE__*/React.createElement("input", {
      type: "date",
      className: "inp",
      value: p.end,
      onChange: e => u({
        end: e.target.value,
        due: fmt(e.target.value)
      })
    })), /*#__PURE__*/React.createElement("div", {
      className: "fl"
    }, "Tasks done", /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      onClick: () => u({
        done: Math.max(0, p.done - 1)
      }),
      "aria-label": "Decrease"
    }, "-"), /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, p.done, "/", p.tot), /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      onClick: () => u({
        done: Math.min(p.tot, p.done + 1)
      }),
      "aria-label": "Increase"
    }, "+"), /*#__PURE__*/React.createElement("button", {
      className: "btn sm",
      onClick: () => u({
        tot: p.tot + 1
      })
    }, "+ scope")))), /*#__PURE__*/React.createElement("div", {
      className: "bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct(p.done, p.tot) + "%"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "card pad"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row",
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("h3", null, "Tasks"), /*#__PURE__*/React.createElement("button", {
      className: "btn sm sp",
      onClick: () => newTask("", p.id)
    }, /*#__PURE__*/React.createElement(Ic, {
      n: "plus",
      s: 14
    }), "Add")), pt.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: "row",
      style: {
        width: "100%",
        padding: "9px 0",
        borderBottom: "1px solid var(--bd2)",
        textAlign: "left"
      },
      onClick: () => open(t.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge s-" + t.s
    }, SL[t.s]), /*#__PURE__*/React.createElement("span", {
      className: t.s === "done" ? "done" : "",
      style: {
        flex: 1
      }
    }, t.t), /*#__PURE__*/React.createElement("span", {
      className: "mono sub"
    }, t.due))), !pt.length && /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, "No tasks yet. Add the first one."))));
  }
  const list = ps.filter(x => (f === "all" || x.st === f) && (pf === "all" || x.pr === pf) && (x.n + x.tags.join() + x.lead).toLowerCase().includes(q.toLowerCase())).sort((a, b) => sort === "name" ? a.n.localeCompare(b.n) : sort === "progress" ? pct(b.done, b.tot) - pct(a.done, a.tot) : (a.end || "").localeCompare(b.end || ""));
  const csv = () => {
    const r = [["Project", "Lead", "Status", "Done", "Total", "Due"], ...ps.map(x => [x.n, x.lead, PS[x.st], x.done, x.tot, x.due])].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([r], {
      type: "text/csv"
    }));
    a.download = "projects.csv";
    a.click();
    toast("projects.csv downloaded");
  };
  const add = () => {
    if (!nw.n.trim()) return;
    const id = "p" + Date.now();
    setPs([{
      id,
      n: nw.n.trim(),
      d: nw.d || "No description yet.",
      tags: ["New"],
      pr: nw.pr,
      st: "plan",
      done: 0,
      tot: 10,
      lead: nw.lead,
      start: TODAY,
      end: nw.end,
      due: fmt(nw.end)
    }, ...ps]);
    setNw({
      ...nw,
      n: "",
      d: ""
    });
    setM(false);
    toast("Project created");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("h1", null, "Projects"), /*#__PURE__*/React.createElement("span", {
    className: "badge s-backlog"
  }, ps.length, " total"), /*#__PURE__*/React.createElement("div", {
    className: "sp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: csv
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "down"
  }), "Export CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: () => setM(true)
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "plus"
  }), "New project"))), /*#__PURE__*/React.createElement("div", {
    className: "filters"
  }, /*#__PURE__*/React.createElement("input", {
    className: "inp",
    style: {
      flex: "1 1 220px",
      maxWidth: 300
    },
    placeholder: "Filter by name, tag or lead",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "seg scrollx"
  }, [["all", "All"], ...Object.entries(PS)].map(([k, v]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: f === k ? "on" : "",
    onClick: () => setF(k)
  }, v))), /*#__PURE__*/React.createElement("select", {
    value: pf,
    onChange: e => setPf(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Priority: all"), Object.entries(PRI).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, v[0]))), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "due"
  }, "Sort: due date"), /*#__PURE__*/React.createElement("option", {
    value: "name"
  }, "Sort: name"), /*#__PURE__*/React.createElement("option", {
    value: "progress"
  }, "Sort: progress"))), /*#__PURE__*/React.createElement("div", {
    className: "pgrid"
  }, list.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.id,
    className: "card pad pc",
    tabIndex: "0",
    role: "button",
    onClick: () => setPid(x.id),
    onKeyDown: e => e.key === "Enter" && setPid(x.id),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, x.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tag"
  }, t)), /*#__PURE__*/React.createElement("span", {
    className: "pri-t sp"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: PRI[x.pr][1]
    }
  }), PRI[x.pr][0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18
    }
  }, x.n), /*#__PURE__*/React.createElement("p", {
    className: "sub",
    style: {
      marginTop: 4
    }
  }, x.d)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row mono",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge s-" + x.st
  }, PS[x.st]), /*#__PURE__*/React.createElement("span", {
    className: "sp sub"
  }, x.done, "/", x.tot, " (", pct(x.done, x.tot), "%)")), /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: pct(x.done, x.tot) + "%",
      background: x.st === "done" ? "var(--b)" : x.st === "progress" ? "var(--warn)" : x.st === "ok" ? "var(--ok)" : "var(--v)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row sub",
    style: {
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    n: x.lead
  }), x.lead, /*#__PURE__*/React.createElement("span", {
    className: "sp mono"
  }, "Due ", x.due)))), !list.length && /*#__PURE__*/React.createElement("div", {
    className: "card empty",
    style: {
      gridColumn: "1/-1"
    }
  }, ps.length ? "No projects match. Clear a filter or create a new project." : "No projects yet. Create your first project to get started.")), m && /*#__PURE__*/React.createElement(Modal, {
    title: "New project",
    onClose: () => setM(false)
  }, /*#__PURE__*/React.createElement("label", null, "Name", /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    className: "inp",
    value: nw.n,
    onChange: e => setNw({
      ...nw,
      n: e.target.value
    }),
    onKeyDown: e => e.key === "Enter" && add()
  })), /*#__PURE__*/React.createElement("label", null, "Description", /*#__PURE__*/React.createElement("textarea", {
    className: "inp",
    value: nw.d,
    onChange: e => setNw({
      ...nw,
      d: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Lead", /*#__PURE__*/React.createElement("select", {
    value: nw.lead,
    onChange: e => setNw({
      ...nw,
      lead: e.target.value
    })
  }, team.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id
  }, t.name)))), /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Due", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "inp",
    value: nw.end,
    onChange: e => setNw({
      ...nw,
      end: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn sp",
    onClick: () => setM(false)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: add
  }, "Create project"))));
}
function Calendar({
  tasks,
  open,
  newTask
}) {
  const [m, setM] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const y = m.getFullYear(),
    mo = m.getMonth(),
    first = (new Date(y, mo, 1).getDay() + 6) % 7,
    dim = new Date(y, mo + 1, 0).getDate();
  const cells = Array.from({
      length: Math.ceil((first + dim) / 7) * 7
    }, (_, k) => k - first + 1),
    by = {};
  tasks.forEach(t => {
    if (t.date) (by[t.date] = by[t.date] || []).push(t);
  });
  const mv = n => setM(new Date(y, mo + n, 1));
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("h1", null, m.toLocaleDateString("en", {
    month: "long",
    year: "numeric"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => mv(-1),
    "aria-label": "Previous month"
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "left"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => {
      const d = new Date();
      d.setDate(1);
      setM(d);
    }
  }, "Today"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => mv(1),
    "aria-label": "Next month"
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "right"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: () => newTask()
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "plus"
  }), "New task"))), /*#__PURE__*/React.createElement("div", {
    className: "card cal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cg"
  }, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: "ch2"
  }, d)), cells.map((n, k) => {
    const ok = n >= 1 && n <= dim,
      ds = ok ? `${y}-${pad(mo + 1)}-${pad(n)}` : "",
      ts = by[ds] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      className: "day" + (ok ? "" : " out") + (ds === TODAY ? " today" : ""),
      onClick: () => ok && newTask(ds)
    }, /*#__PURE__*/React.createElement("span", {
      className: "dn"
    }, ok ? n : ""), ts.slice(0, 3).map(t => /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: "chip",
      style: {
        borderLeftColor: PRI[t.p][1]
      },
      onClick: e => {
        e.stopPropagation();
        open(t.id);
      }
    }, t.t)), ts.length > 3 && /*#__PURE__*/React.createElement("span", {
      className: "more"
    }, "+", ts.length - 3, " more"));
  }))));
}
function Gantt({
  ps,
  setPid,
  go
}) {
  const [z, setZ] = useState(10);
  const w = ps.filter(p => p.start && p.end);
  const s0 = w.reduce((a, p) => p.start < a ? p.start : a, TODAY),
    e0 = w.reduce((a, p) => p.end > a ? p.end : a, TODAY);
  const st = pd(s0);
  st.setDate(st.getDate() - 7);
  const start = iso(st),
    total = dd(start, e0) + 14;
  const months = [];
  for (let d = 0; d < total; d++) {
    const t = pd(start);
    t.setDate(t.getDate() + d);
    const l = t.toLocaleDateString("en", {
      month: "short",
      year: "2-digit"
    });
    const L = months[months.length - 1];
    L && L.l === l ? L.n++ : months.push({
      l,
      n: 1
    });
  }
  const grid = {
    width: total * z,
    backgroundImage: `repeating-linear-gradient(90deg,var(--bd2) 0 1px,transparent 1px ${7 * z}px)`
  };
  const tx = dd(start, TODAY) * z;
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Gantt"), /*#__PURE__*/React.createElement("p", {
    className: "sub"
  }, "Project timelines. Select a bar to open the project.")), /*#__PURE__*/React.createElement("div", {
    className: "sp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, [[6, "Compact"], [10, "Normal"], [18, "Wide"]].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: z === v ? "on" : "",
    onClick: () => setZ(v)
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "card gt"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 190 + total * z,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      position: "sticky",
      top: 0,
      zIndex: 3,
      background: "var(--p1)",
      borderBottom: "1px solid var(--bd)",
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gl",
    style: {
      color: "var(--t3)"
    }
  }, "Project"), months.map((m, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "mono sub",
    style: {
      width: m.n * z,
      padding: "10px 6px",
      overflow: "hidden",
      whiteSpace: "nowrap"
    }
  }, m.l))), w.map(p => {
    const L = dd(start, p.start) * z,
      W = (dd(p.start, p.end) + 1) * z,
      c = p.st === "done" ? "#60a5fa" : p.st === "progress" ? "#f59e0b" : p.st === "ok" ? "#10b981" : "#8b5cf6";
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "row",
      style: {
        gap: 0,
        height: 46,
        borderBottom: "1px solid var(--bd2)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gl"
    }, p.n), /*#__PURE__*/React.createElement("div", {
      style: {
        ...grid,
        position: "relative",
        height: "100%"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "gbar",
      title: `${p.n}: ${fmt(p.start)} to ${fmt(p.end)}, ${pct(p.done, p.tot)}% done`,
      style: {
        left: L,
        width: W,
        background: c + "33",
        borderColor: c
      },
      onClick: () => {
        setPid(p.id);
        go("projects");
      }
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct(p.done, p.tot) + "%",
        background: c
      }
    }), /*#__PURE__*/React.createElement("span", null, pct(p.done, p.tot), "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: tx,
        top: 0,
        bottom: 0,
        width: 1,
        background: "var(--bad)"
      }
    })));
  }), !w.length && /*#__PURE__*/React.createElement("div", {
    className: "empty"
  }, "Add start and due dates to a project to see it here."))));
}
function Team({
  team,
  setTeam,
  toast
}) {
  const [q, setQ] = useState(""),
    [m, setM] = useState(false),
    [nm, setNm] = useState({
      name: "",
      email: "",
      role: "Engineer"
    }),
    [er, setEr] = useState("");
  const list = team.filter(t => (t.name + t.email + t.role).toLowerCase().includes(q.toLowerCase()));
  const add = () => {
    const e = nm.email.trim().toLowerCase();
    if (nm.name.trim().length < 2) return setEr("Enter a name");
    if (!EMAIL.test(e)) return setEr("Enter a valid email");
    if (team.some(t => t.email === e)) return setEr("This person is already on the team");
    setTeam([...team, {
      id: "m" + Date.now(),
      name: nm.name.trim(),
      email: e,
      role: nm.role,
      load: 0
    }]);
    setNm({
      name: "",
      email: "",
      role: "Engineer"
    });
    setEr("");
    setM(false);
    toast("Invitation sent to " + e);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("h1", null, "Team"), /*#__PURE__*/React.createElement("span", {
    className: "badge s-backlog"
  }, team.length, " members"), /*#__PURE__*/React.createElement("div", {
    className: "sp"
  }, /*#__PURE__*/React.createElement("input", {
    className: "inp",
    placeholder: "Search people",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: () => setM(true)
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "plus"
  }), "Invite member"))), /*#__PURE__*/React.createElement("div", {
    className: "pgrid"
  }, list.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card pad",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Avatar, {
    n: t.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "sub mono",
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.email)), /*#__PURE__*/React.createElement("button", {
    className: "ib sp",
    "aria-label": "Remove " + t.name,
    onClick: () => {
      setTeam(team.filter(x => x.id !== t.id));
      toast(t.name + " removed");
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "trash"
  }))), /*#__PURE__*/React.createElement("select", {
    value: t.role,
    onChange: e => setTeam(team.map(x => x.id === t.id ? {
      ...x,
      role: e.target.value
    } : x))
  }, ROLES.map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row mono sub",
    style: {
      marginBottom: 6
    }
  }, "Workload", /*#__PURE__*/React.createElement("span", {
    className: "sp",
    style: {
      color: t.load > 90 ? "var(--bad)" : "var(--t2)"
    }
  }, t.load, "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    value: t.load,
    style: {
      width: "100%",
      accentColor: t.load > 90 ? "#f43f5e" : "var(--v)"
    },
    onChange: e => setTeam(team.map(x => x.id === t.id ? {
      ...x,
      load: +e.target.value
    } : x)),
    "aria-label": "Workload"
  })))), !list.length && /*#__PURE__*/React.createElement("div", {
    className: "card empty",
    style: {
      gridColumn: "1/-1"
    }
  }, team.length ? "No one matches that search." : "No team members yet. Invite someone by email.")), m && /*#__PURE__*/React.createElement(Modal, {
    title: "Invite member",
    onClose: () => setM(false)
  }, /*#__PURE__*/React.createElement("label", null, "Name", /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    className: "inp",
    value: nm.name,
    onChange: e => setNm({
      ...nm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, "Email", /*#__PURE__*/React.createElement("input", {
    type: "email",
    className: "inp",
    value: nm.email,
    onChange: e => setNm({
      ...nm,
      email: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, "Role", /*#__PURE__*/React.createElement("select", {
    value: nm.role,
    onChange: e => setNm({
      ...nm,
      role: e.target.value
    })
  }, ROLES.map(r => /*#__PURE__*/React.createElement("option", {
    key: r
  }, r)))), er && /*#__PURE__*/React.createElement("span", {
    className: "err"
  }, er), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn sp",
    onClick: () => setM(false)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: add
  }, "Send invite"))));
}
function Settings({
  user,
  setUser,
  st,
  setSt,
  data,
  toast,
  out,
  reset
}) {
  const [n, setN] = useState(user.name),
    [e, setE] = useState(user.email),
    [er, setEr] = useState("");
  const save = () => {
    if (n.trim().length < 2) return setEr("Enter your name");
    if (!EMAIL.test(e.trim())) return setEr("Enter a valid email");
    setEr("");
    setUser({
      ...user,
      name: n.trim(),
      email: e.trim().toLowerCase()
    });
    toast("Profile saved");
  };
  const Tog = ({
    k,
    l,
    d
  }) => /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      padding: "10px 0",
      borderBottom: "1px solid var(--bd2)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, l), /*#__PURE__*/React.createElement("div", {
    className: "sub",
    style: {
      fontSize: 13
    }
  }, d)), /*#__PURE__*/React.createElement("button", {
    className: "tog sp" + (st[k] ? " on" : ""),
    role: "switch",
    "aria-checked": !!st[k],
    "aria-label": l,
    onClick: () => setSt({
      ...st,
      [k]: !st[k]
    })
  }, /*#__PURE__*/React.createElement("i", null)));
  const exp = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    }));
    a.download = "plutask-data.json";
    a.click();
    toast("Data exported");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("h1", null, "Settings")), /*#__PURE__*/React.createElement("div", {
    className: "card pad",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "fgrid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Name", /*#__PURE__*/React.createElement("input", {
    className: "inp",
    value: n,
    onChange: x => setN(x.target.value)
  })), /*#__PURE__*/React.createElement("label", {
    className: "fl"
  }, "Email", /*#__PURE__*/React.createElement("input", {
    type: "email",
    className: "inp",
    value: e,
    onChange: x => setE(x.target.value)
  }))), er && /*#__PURE__*/React.createElement("span", {
    className: "err"
  }, er), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: save
  }, "Save changes"))), /*#__PURE__*/React.createElement("div", {
    className: "card pad"
  }, /*#__PURE__*/React.createElement("h3", null, "Appearance"), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      padding: "12px 0"
    }
  }, "Accent color", /*#__PURE__*/React.createElement("div", {
    className: "row sp"
  }, ["#8b5cf6", "#60a5fa", "#10b981", "#f59e0b", "#f43f5e"].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "sw",
    "aria-label": "Accent " + c,
    style: {
      background: c,
      outline: st.accent === c ? "2px solid #f9fafb" : "none"
    },
    onClick: () => setSt({
      ...st,
      accent: c
    })
  })))), /*#__PURE__*/React.createElement(Tog, {
    k: "compact",
    l: "Compact density",
    d: "Tighter rows in tables and lists."
  }), /*#__PURE__*/React.createElement(Tog, {
    k: "notif",
    l: "Notifications",
    d: "Show the unread dot on the bell."
  })), /*#__PURE__*/React.createElement("div", {
    className: "card pad",
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: exp
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "down"
  }), "Export data"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: reset
  }, "Clear all data"), /*#__PURE__*/React.createElement("button", {
    className: "btn sp",
    onClick: out
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "out"
  }), "Sign out")));
}
