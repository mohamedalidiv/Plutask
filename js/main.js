function Shell({
  user,
  setUser
}) {
  const [st, setSt] = useLS("settings", {
    accent: "#8b5cf6",
    compact: false,
    notif: true
  });
  const [page, setPage] = useLS("page", "overview");
  const [tasks, setTasks] = useLS("tasks", init),
    [projs, setProjs] = useLS("projects", initProj),
    [team, setTeam] = useLS("team", [{
      id: "m0",
      name: user.name,
      email: user.email,
      role: "Owner",
      load: 0
    }]);
  const [sel, setSel] = useState(null),
    [pid, setPid] = useState(null),
    [q, setQ] = useState(""),
    [modal, setModal] = useState(false),
    [bell, setBell] = useState(false),
    [msg, setMsg] = useState(""),
    [menu, setMenu] = useState(false);
  const blank = {
    t: "",
    p: "med",
    tag: "",
    date: "",
    proj: ""
  };
  const [nt, setNt] = useState(blank);
  const sr = useRef();
  const toast = m => {
    setMsg(m);
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setMsg(""), 2200);
  };
  useEffect(() => {
    document.documentElement.style.setProperty("--v", st.accent);
    document.body.classList.toggle("compact", !!st.compact);
  }, [st]);
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sr.current && sr.current.focus();
      }
      if (e.key === "Escape") {
        setSel(null);
        setModal(false);
        setBell(false);
        setMenu(false);
      }
    };
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  }, []);
  const newTask = (d, pr) => {
    setNt({
      ...blank,
      date: typeof d === "string" ? d : "",
      proj: typeof pr === "string" ? pr : ""
    });
    setModal(true);
  };
  const add = () => {
    if (!nt.t.trim()) return;
    const id = "TL-" + (Math.max(1000, ...tasks.map(t => +t.id.slice(3))) + 1);
    setTasks(ts => [{
      id,
      t: nt.t.trim(),
      d: "No description yet.",
      s: "backlog",
      p: nt.p,
      tag: nt.tag || "General",
      date: nt.date,
      due: fmt(nt.date),
      proj: nt.proj,
      created: TODAY,
      sub: [],
      c: []
    }, ...ts]);
    setModal(false);
    toast("Task " + id + " created");
  };
  const go = p => {
    setPage(p);
    setSel(null);
    setMenu(false);
    if (p !== "projects") setPid(null);
  };
  const openTask = id => {
    setPage("tasks");
    setSel(id);
  };
  const cur = tasks.find(t => t.id === sel),
    curP = projs.find(p => p.id === pid);
  const nav = [["overview", "Overview", "grid"], ["tasks", "My tasks", "check"], ["projects", "Projects", "folder"], ["calendar", "Calendar", "cal"], ["gantt", "Gantt", "gantt"], ["team", "Team", "team"], ["reports", "Reports", "chart"], ["settings", "Settings", "gear"]];
  const label = Object.fromEntries(nav.map(n => [n[0], n[1]]));
  const searchGo = e => {
    setQ(e.target.value);
    if (e.target.value && page !== "tasks") go("tasks");
  };
  const alerts = tasks.filter(t => t.s !== "done" && t.date && t.date <= TODAY);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, menu && /*#__PURE__*/React.createElement("div", {
    className: "navscrim",
    onClick: () => setMenu(false)
  }), /*#__PURE__*/React.createElement("nav", {
    className: "side" + (menu ? " open" : ""),
    "aria-label": "Main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 5h14M3 12h18M3 19h10",
    stroke: "#8b5cf6",
    strokeWidth: "3",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("span", null, "Plutask")), nav.map(([k, l, i]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "nav" + (page === k ? " on" : ""),
    onClick: () => go(k),
    title: l
  }, /*#__PURE__*/React.createElement(Ic, {
    n: i
  }), /*#__PURE__*/React.createElement("span", null, l), k === "tasks" && /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, tasks.filter(t => t.s !== "done").length), k === "projects" && /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, projs.length))), /*#__PURE__*/React.createElement("div", {
    className: "me"
  }, /*#__PURE__*/React.createElement(Avatar, {
    n: user.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    className: "sub",
    style: {
      fontSize: 12,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, user.email)))), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ib hamb",
    "aria-label": "Open menu",
    onClick: () => setMenu(true)
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "menu"
  })), /*#__PURE__*/React.createElement("div", {
    className: "crumb"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go("overview")
  }, "Workspace"), " / ", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      go(page);
      setPid(null);
    }
  }, /*#__PURE__*/React.createElement("b", null, label[page])), page === "projects" && curP && /*#__PURE__*/React.createElement(React.Fragment, null, " / ", /*#__PURE__*/React.createElement("b", null, curP.n))), /*#__PURE__*/React.createElement("label", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "search"
  }), /*#__PURE__*/React.createElement("input", {
    ref: sr,
    placeholder: "Search tasks",
    value: q,
    onChange: searchGo
  }), /*#__PURE__*/React.createElement("kbd", null, "Ctrl K")), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: () => newTask()
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "plus"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, "New task")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "ib",
    "aria-label": "Notifications",
    onClick: () => setBell(!bell)
  }, /*#__PURE__*/React.createElement(Ic, {
    n: "bell"
  }), st.notif && alerts.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), bell && /*#__PURE__*/React.createElement("div", {
    className: "pop"
  }, alerts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    onClick: () => {
      setBell(false);
      openTask(t.id);
    },
    style: {
      cursor: "pointer"
    }
  }, t.id, " ", t.date < TODAY ? "is overdue" : "is due today", ": ", t.t)), !alerts.length && /*#__PURE__*/React.createElement("div", null, "You are all caught up.")))), page === "overview" && /*#__PURE__*/React.createElement(Overview, {
    user: user,
    projs: projs,
    tasks: tasks,
    setTasks: setTasks,
    go: go,
    open: openTask,
    newTask: newTask
  }), page === "tasks" && /*#__PURE__*/React.createElement(Tasks, {
    tasks: tasks,
    setTasks: setTasks,
    sel: sel,
    open: setSel,
    newTask: newTask,
    query: q
  }), page === "projects" && /*#__PURE__*/React.createElement(Projects, {
    ps: projs,
    setPs: setProjs,
    tasks: tasks,
    team: team,
    pid: pid,
    setPid: setPid,
    open: openTask,
    newTask: newTask,
    toast: toast
  }), page === "calendar" && /*#__PURE__*/React.createElement(Calendar, {
    tasks: tasks,
    open: openTask,
    newTask: newTask
  }), page === "gantt" && /*#__PURE__*/React.createElement(Gantt, {
    ps: projs,
    setPid: setPid,
    go: go2 => {
      setPage("projects");
    }
  }), page === "team" && /*#__PURE__*/React.createElement(Team, {
    team: team,
    setTeam: setTeam,
    toast: toast
  }), page === "reports" && /*#__PURE__*/React.createElement(Reports, {
    tasks: tasks,
    projs: projs,
    team: team,
    toast: toast
  }), page === "settings" && /*#__PURE__*/React.createElement(Settings, {
    user: user,
    setUser: setUser,
    st: st,
    setSt: setSt,
    data: {
      tasks,
      projects: projs,
      team
    },
    toast: toast,
    out: () => setUser(null),
    reset: () => {
      if (confirm("Delete all your tasks, projects and team members? This can't be undone.")) {
        setTasks([]);
        setProjs([]);
        setTeam([{
          id: "m0",
          name: user.name,
          email: user.email,
          role: "Owner",
          load: 0
        }]);
        toast("All data cleared");
      }
    }
  })), cur && page === "tasks" && /*#__PURE__*/React.createElement(Drawer, {
    key: cur.id,
    t: cur,
    setTasks: setTasks,
    close: () => setSel(null),
    toast: toast,
    user: user
  }), modal && /*#__PURE__*/React.createElement(Modal, {
    title: "New task",
    onClose: () => setModal(false)
  }, /*#__PURE__*/React.createElement("label", null, "Title", /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    className: "inp",
    value: nt.t,
    onChange: e => setNt({
      ...nt,
      t: e.target.value
    }),
    onKeyDown: e => e.key === "Enter" && add()
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Priority", /*#__PURE__*/React.createElement("select", {
    value: nt.p,
    onChange: e => setNt({
      ...nt,
      p: e.target.value
    })
  }, Object.entries(PRI).map(([k, v]) => /*#__PURE__*/React.createElement("option", {
    key: k,
    value: k
  }, v[0])))), /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Due", /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "inp",
    value: nt.date,
    onChange: e => setNt({
      ...nt,
      date: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Project", /*#__PURE__*/React.createElement("select", {
    value: nt.proj,
    onChange: e => setNt({
      ...nt,
      proj: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "None"), projs.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.n)))), /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, "Tag", /*#__PURE__*/React.createElement("input", {
    className: "inp",
    value: nt.tag,
    onChange: e => setNt({
      ...nt,
      tag: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn sp",
    onClick: () => setModal(false)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn pri",
    onClick: add
  }, "Create task"))), msg && /*#__PURE__*/React.createElement("div", {
    className: "toast",
    role: "status"
  }, msg));
}
function App() {
  const [user, setUser] = useLS("user", null);
  if (!user) return /*#__PURE__*/React.createElement(Login, {
    onAuth: u => setUser({
      ...u,
      id: u.email
    })
  });
  const uid = user.id || user.email;
  NS = uid + ":";
  return /*#__PURE__*/React.createElement(Shell, {
    key: uid,
    user: user,
    setUser: setUser
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
