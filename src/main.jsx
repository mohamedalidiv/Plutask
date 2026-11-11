function Shell({user,setUser}){
  const [st,setSt]=useLS("settings",{accent:"#8b5cf6",compact:false,notif:true});
  const [page,setPage]=useLS("page","overview");
  const [tasks,setTasks]=useLS("tasks",init),[projs,setProjs]=useLS("projects",initProj),[team,setTeam]=useLS("team",[{id:"m0",name:user.name,email:user.email,role:"Owner",load:0}]);
  const [sel,setSel]=useState(null),[pid,setPid]=useState(null),[q,setQ]=useState(""),[modal,setModal]=useState(false),[bell,setBell]=useState(false),[msg,setMsg]=useState(""),[menu,setMenu]=useState(false);
  const blank={t:"",p:"med",tag:"",date:"",proj:""};const [nt,setNt]=useState(blank);const sr=useRef();
  const toast=m=>{setMsg(m);clearTimeout(window.__t);window.__t=setTimeout(()=>setMsg(""),2200)};
  useEffect(()=>{document.documentElement.style.setProperty("--v",st.accent);document.body.classList.toggle("compact",!!st.compact)},[st]);
  useEffect(()=>{const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();sr.current&&sr.current.focus()}if(e.key==="Escape"){setSel(null);setModal(false);setBell(false);setMenu(false)}};addEventListener("keydown",h);return()=>removeEventListener("keydown",h)},[]);
  const newTask=(d,pr)=>{setNt({...blank,date:typeof d==="string"?d:"",proj:typeof pr==="string"?pr:""});setModal(true)};
  const add=()=>{if(!nt.t.trim())return;const id="TL-"+(Math.max(1000,...tasks.map(t=>+t.id.slice(3)))+1);
    setTasks(ts=>[{id,t:nt.t.trim(),d:"No description yet.",s:"backlog",p:nt.p,tag:nt.tag||"General",date:nt.date,due:fmt(nt.date),proj:nt.proj,created:TODAY,sub:[],c:[]},...ts]);setModal(false);toast("Task "+id+" created")};
  const go=p=>{setPage(p);setSel(null);setMenu(false);if(p!=="projects")setPid(null)};
  const openTask=id=>{setPage("tasks");setSel(id)};
  const cur=tasks.find(t=>t.id===sel),curP=projs.find(p=>p.id===pid);
  const nav=[["overview","Overview","grid"],["tasks","My tasks","check"],["projects","Projects","folder"],["calendar","Calendar","cal"],["gantt","Gantt","gantt"],["team","Team","team"],["reports","Reports","chart"],["settings","Settings","gear"]];
  const label=Object.fromEntries(nav.map(n=>[n[0],n[1]]));
  const searchGo=e=>{setQ(e.target.value);if(e.target.value&&page!=="tasks")go("tasks")};
  const alerts=tasks.filter(t=>t.s!=="done"&&t.date&&t.date<=TODAY);
  return <div className="app">
    {menu&&<div className="navscrim" onClick={()=>setMenu(false)}/>}
    <nav className={"side"+(menu?" open":"")} aria-label="Main"><div className="brand"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 5h14M3 12h18M3 19h10" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/></svg><span>Plutask</span></div>
      {nav.map(([k,l,i])=><button key={k} className={"nav"+(page===k?" on":"")} onClick={()=>go(k)} title={l}><Ic n={i}/><span>{l}</span>{k==="tasks"&&<span className="n">{tasks.filter(t=>t.s!=="done").length}</span>}{k==="projects"&&<span className="n">{projs.length}</span>}</button>)}
      <div className="me"><Avatar n={user.name}/><div style={{minWidth:0}}><div style={{fontWeight:500}}>{user.name}</div><div className="sub" style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis"}}>{user.email}</div></div></div></nav>
    <div className="main"><header className="top"><button className="ib hamb" aria-label="Open menu" onClick={()=>setMenu(true)}><Ic n="menu"/></button>
      <div className="crumb"><button onClick={()=>go("overview")}>Workspace</button> / <button onClick={()=>{go(page);setPid(null)}}><b>{label[page]}</b></button>{page==="projects"&&curP&&<> / <b>{curP.n}</b></>}</div>
      <label className="search"><Ic n="search"/><input ref={sr} placeholder="Search tasks" value={q} onChange={searchGo}/><kbd>Ctrl K</kbd></label>
      <button className="btn pri" onClick={()=>newTask()}><Ic n="plus"/><span className="tx">New task</span></button>
      <div style={{position:"relative"}}><button className="ib" aria-label="Notifications" onClick={()=>setBell(!bell)}><Ic n="bell"/>{st.notif&&alerts.length>0&&<span className="dot"/>}</button>
        {bell&&<div className="pop">{alerts.map(t=><div key={t.id} onClick={()=>{setBell(false);openTask(t.id)}} style={{cursor:"pointer"}}>{t.id} {t.date<TODAY?"is overdue":"is due today"}: {t.t}</div>)}{!alerts.length&&<div>You are all caught up.</div>}</div>}</div></header>
      {page==="overview"&&<Overview user={user} projs={projs} tasks={tasks} setTasks={setTasks} go={go} open={openTask} newTask={newTask}/>}
      {page==="tasks"&&<Tasks tasks={tasks} setTasks={setTasks} sel={sel} open={setSel} newTask={newTask} query={q}/>}
      {page==="projects"&&<Projects ps={projs} setPs={setProjs} tasks={tasks} team={team} pid={pid} setPid={setPid} open={openTask} newTask={newTask} toast={toast}/>}
      {page==="calendar"&&<Calendar tasks={tasks} open={openTask} newTask={newTask}/>}
      {page==="gantt"&&<Gantt ps={projs} setPid={setPid} go={go2=>{setPage("projects")}}/>}
      {page==="team"&&<Team team={team} setTeam={setTeam} toast={toast}/>}
      {page==="reports"&&<Reports tasks={tasks} projs={projs} team={team} toast={toast}/>}
      {page==="settings"&&<Settings user={user} setUser={setUser} st={st} setSt={setSt} data={{tasks,projects:projs,team}} toast={toast} out={()=>setUser(null)} reset={()=>{if(confirm("Delete all your tasks, projects and team members? This can't be undone.")){setTasks([]);setProjs([]);setTeam([{id:"m0",name:user.name,email:user.email,role:"Owner",load:0}]);toast("All data cleared")}}}/>}
    </div>
    {cur&&page==="tasks"&&<Drawer key={cur.id} t={cur} setTasks={setTasks} close={()=>setSel(null)} toast={toast} user={user}/>}
    {modal&&<Modal title="New task" onClose={()=>setModal(false)}>
      <label>Title<input autoFocus className="inp" value={nt.t} onChange={e=>setNt({...nt,t:e.target.value})} onKeyDown={e=>e.key==="Enter"&&add()}/></label>
      <div className="row"><label style={{flex:1}}>Priority<select value={nt.p} onChange={e=>setNt({...nt,p:e.target.value})}>{Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label><label style={{flex:1}}>Due<input type="date" className="inp" value={nt.date} onChange={e=>setNt({...nt,date:e.target.value})}/></label></div>
      <div className="row"><label style={{flex:1}}>Project<select value={nt.proj} onChange={e=>setNt({...nt,proj:e.target.value})}><option value="">None</option>{projs.map(p=><option key={p.id} value={p.id}>{p.n}</option>)}</select></label><label style={{flex:1}}>Tag<input className="inp" value={nt.tag} onChange={e=>setNt({...nt,tag:e.target.value})}/></label></div>
      <div className="row"><button className="btn sp" onClick={()=>setModal(false)}>Cancel</button><button className="btn pri" onClick={add}>Create task</button></div></Modal>}
    {msg&&<div className="toast" role="status">{msg}</div>}
  </div>}
function App(){
  const [user,setUser]=useLS("user",null);
  if(!user)return <Login onAuth={u=>setUser({...u,id:u.email})}/>;
  const uid=user.id||user.email;NS=uid+":";
  return <Shell key={uid} user={user} setUser={setUser}/>}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
