const P={grid:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",check:"M20 6 9 17l-5-5",folder:"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",chart:"M3 3v18h18M7 15l4-4 3 3 5-6",plus:"M12 5v14M5 12h14",search:"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",x:"M18 6 6 18M6 6l12 12",down:"M12 3v12m0 0 4-4m-4 4-4-4M4 21h16",list:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",board:"M4 4h5v16H4zM15 4h5v10h-5z",arrow:"M5 12h14m-6-6 6 6-6 6",bell:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4",clock:"M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",grid2:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",send:"M22 2 11 13M22 2l-7 20-4-9-9-4z"};
const Ic=({n,s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={P[n]}/></svg>;
const PRI={urgent:["Urgent","#f43f5e"],high:["High","#f59e0b"],med:["Medium","#60a5fa"],low:["Low","#6b7280"]};
const ST=[["backlog","Backlog"],["progress","In progress"],["review","In review"],["done","Done"]];
const SL=Object.fromEntries(ST);
const init=[],initProj=[];
const stamp=(t,s)=>({...t,s,doneAt:s==="done"?TODAY:null});
const PS={ok:"On track",progress:"Needs attention",review:"In review",plan:"Planning",done:"Completed"};
const ini=n=>n.split(" ").map(w=>w[0]).join("");
const Avatar=({n})=><span className="av" title={n}>{ini(n)}</span>;
const pct=(a,b)=>Math.round(a/b*100);

function Overview({tasks,setTasks,go,open,newTask,projs,user}){
  const [range,setRange]=useState("7D");const [q,setQ]=useState("");const [st,setSt]=useState("all");
  const mine=tasks.filter(t=>t.s!=="done").slice(0,4);
  const toggle=id=>setTasks(ts=>ts.map(t=>t.id===id?stamp(t,t.s==="done"?"progress":"done"):t));
  const open_=tasks.filter(t=>t.s!=="done").length,done_=tasks.filter(t=>t.s==="done").length;
  const dueW=tasks.filter(t=>t.s!=="done"&&t.date&&t.date>=TODAY&&t.date<=off(7)).length,rate=tasks.length?pct(done_,tasks.length):0;
  const dn=tasks.filter(t=>t.doneAt&&t.created),cyc=dn.length?(dn.reduce((a,t)=>a+dd(t.created,t.doneAt),0)/dn.length).toFixed(1)+" days":"—";
  const dl=tasks.filter(t=>t.doneAt&&t.date),ont=dl.length?pct(dl.filter(t=>t.doneAt<=t.date).length,dl.length)+"%":"—";
  const urg=tasks.filter(t=>t.s!=="done"&&t.p==="urgent").length;
  const acts=tasks.flatMap(t=>[t.created&&{d:t.created,m:"created "+t.t},t.doneAt&&{d:t.doneAt,m:"completed "+t.t}]).filter(Boolean).sort((a,b)=>b.d.localeCompare(a.d)).slice(0,4);
  const pj=projs.filter(p=>p.n.toLowerCase().includes(q.toLowerCase())&&(st==="all"||p.st===st));
  return <div className="page">
    <div className="ph"><div><h1>{new Date().getHours()<12?"Good morning":new Date().getHours()<18?"Good afternoon":"Good evening"}, {user.name.split(" ")[0]}</h1><p className="sub">{tasks.length||projs.length?`Across ${projs.length} projects you have ${open_} open tasks.`:"Your workspace is empty. Start with a project or a task."}</p></div>
      <div className="sp"><button className="btn pri" onClick={newTask}><Ic n="plus"/>New task</button></div></div>
    {!tasks.length&&!projs.length&&<div className="card pad row" style={{flexWrap:"wrap"}}><div><h3>Start here</h3><p className="sub">Create a project to group your work, or jump straight into a task.</p></div><div className="sp"><button className="btn" onClick={()=>go("projects")}>Create a project</button><button className="btn pri" onClick={newTask}><Ic n="plus"/>Create a task</button></div></div>}
    <div className="kpis">
      {[["Projects",projs.length,projs.filter(p=>p.st!=="done").length+" active"],["Open tasks",open_,dueW+" due in 7 days"],["Completed",done_,"of "+tasks.length+" total"],["Completion rate",rate+"%","across all tasks"]].map(k=><div key={k[0]} className="card kpi"><span className="l">{k[0]}</span><span className="v">{k[1]}</span><span className="d">{k[2]}</span></div>)}
    </div>
    <div className="g2">
      <div className="card pad"><div className="row" style={{marginBottom:6}}><div><h3>Weekly velocity</h3><p className="sub" style={{fontSize:13}}>Tasks completed against tasks created</p></div>
        <div className="sp"><div className="legend"><span><i style={{background:"#8b5cf6"}}/>Completed</span><span><i style={{background:"#60a5fa"}}/>Created</span></div>
        <div className="seg">{["7D","14D","30D"].map(r=><button key={r} className={range===r?"on":""} onClick={()=>setRange(r)}>{r}</button>)}</div></div></div>
        <Chart range={range} tasks={tasks}/>
        <div className="row" style={{gap:36,paddingTop:8}}>{[["Avg cycle time",cyc],["On-time delivery",ont],["Urgent open",urg]].map(m=><div key={m[0]}><div className="sub" style={{fontSize:13}}>{m[0]}</div><div style={{fontWeight:500,fontSize:16}}>{m[1]}</div></div>)}</div></div>
      <div className="card pad"><h3 style={{marginBottom:14}}>Recent activity</h3>
        {acts.length?acts.map((a,k)=><div key={k} className="row" style={{alignItems:"flex-start",marginBottom:14}}><Avatar n={user.name}/><div><div><b style={{fontWeight:500}}>{user.name}</b> <span className="sub">{a.m}</span></div><div className="mono" style={{color:"var(--t3)"}}>{fmt(a.d)}</div></div></div>):<p className="sub" style={{marginBottom:14}}>Nothing yet. Activity shows up as you create and complete tasks.</p>}
        <button className="btn sm" onClick={()=>go("reports")}>View reports <Ic n="arrow" s={14}/></button></div>
    </div>
    <div className="g2b">
      <div className="card pad"><div className="row" style={{marginBottom:12}}><h3>Assigned to me</h3><span className="badge s-backlog sp">{mine.length} remaining</span></div>
        {mine.length?mine.map(t=><div key={t.id} className="row" style={{padding:"10px 0",borderBottom:"1px solid var(--bd2)"}}>
          <button className="chk" onClick={()=>toggle(t.id)} aria-label="Complete task"></button>
          <button style={{textAlign:"left",flex:1}} onClick={()=>open(t.id)}><div>{t.t}</div><div className="mono" style={{color:PRI[t.p][1]}}>{PRI[t.p][0]} <span style={{color:"var(--t3)"}}>{t.tag} · {t.due}</span></div></button></div>):<div className="empty">All clear. Create a task to get started.</div>}
        <button className="btn sm" style={{marginTop:12,width:"100%",justifyContent:"center"}} onClick={newTask}><Ic n="plus" s={14}/>Quick add task</button></div>
      <div className="card pad"><div className="row" style={{marginBottom:12}}><h3>Active projects</h3><div className="sp"><input className="inp" placeholder="Filter projects" value={q} onChange={e=>setQ(e.target.value)} style={{width:150}}/>
        <select value={st} onChange={e=>setSt(e.target.value)}><option value="all">All status</option>{Object.entries(PS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div></div>
        <table><thead><tr><th>Project</th><th>Lead</th><th>Progress</th><th>Status</th></tr></thead><tbody>
          {pj.slice(0,5).map(p=><tr key={p.n}><td>{p.n}</td><td className="sub">{p.lead}</td><td style={{width:110}}><div className="bar"><i style={{width:pct(p.done,p.tot)+"%"}}/></div></td><td><span className={"badge s-"+p.st}>{PS[p.st]}</span></td></tr>)}
          {!pj.length&&<tr><td colSpan="4" className="empty">{projs.length?"No projects match this filter.":"No projects yet. Create your first one from the Projects page."}</td></tr>}</tbody></table>
        <div className="row" style={{marginTop:10}}><span className="sub" style={{fontSize:13}}>Showing {Math.min(5,pj.length)} of {projs.length}</span><button className="btn sm sp" onClick={()=>go("projects")}>All projects</button></div></div>
    </div></div>}

function Tasks({tasks,setTasks,sel,open,newTask,query}){
  const [view,setView]=useState("board");const [pf,setPf]=useState("all");const [over,setOver]=useState(null);const [drag,setDrag]=useState(null);
  const list=tasks.filter(t=>(pf==="all"||t.p===pf)&&(t.t+t.id+t.tag).toLowerCase().includes(query.toLowerCase()));
  const drop=s=>{if(drag)setTasks(ts=>ts.map(t=>t.id===drag?stamp(t,s):t));setOver(null);setDrag(null)};
  return <div className="page">
    <div className="ph"><h1>My tasks</h1><span className="badge s-backlog">{list.length} shown</span>
      <div className="sp"><div className="seg"><button className={view==="board"?"on":""} onClick={()=>setView("board")}><Ic n="board" s={14}/> Board</button><button className={view==="list"?"on":""} onClick={()=>setView("list")}><Ic n="list" s={14}/> List</button></div>
      <select value={pf} onChange={e=>setPf(e.target.value)}><option value="all">Priority: all</option>{Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select>
      <button className="btn pri" onClick={newTask}><Ic n="plus"/>Add task</button></div></div>
    {!tasks.length&&<div className="card empty"><p>No tasks yet.</p><button className="btn pri" style={{marginTop:12}} onClick={newTask}>Create your first task</button></div>}
    {view==="board"?<div className="board">{ST.map(([k,l])=>{const c=list.filter(t=>t.s===k);return <div key={k} className={"col"+(over===k?" over":"")} onDragOver={e=>{e.preventDefault();setOver(k)}} onDragLeave={()=>setOver(null)} onDrop={()=>drop(k)}>
      <div className="ch">{l}<span className="mono" style={{color:"var(--t3)"}}>{c.length}</span></div>
      {c.map(t=><div key={t.id} draggable className={"tk"+(sel===t.id?" sel":"")+(drag===t.id?" drag":"")} onDragStart={()=>setDrag(t.id)} onDragEnd={()=>{setDrag(null);setOver(null)}} onClick={()=>open(t.id)}>
        <div className="row"><span className="tag">{t.tag}</span><span className="pri-t sp"><i style={{background:PRI[t.p][1]}}/>{PRI[t.p][0]}</span></div>
        <div className={t.s==="done"?"done":""}>{t.t}</div>
        <div className="row mono" style={{color:"var(--t3)"}}><span>{t.id}</span>{t.sub.length>0&&<span>{t.sub.filter(x=>x[1]).length}/{t.sub.length}</span>}<span className="sp">{t.due}</span></div></div>)}
      {!c.length&&<div className="empty" style={{padding:16,fontSize:13}}>Drop a task here</div>}
      <button className="btn sm" style={{width:"100%",justifyContent:"center",marginTop:4}} onClick={newTask}><Ic n="plus" s={14}/>Create issue</button></div>})}</div>
    :<div className="card"><table><thead><tr><th>ID</th><th>Task</th><th>Priority</th><th>Status</th><th>Due</th></tr></thead><tbody>
      {list.map(t=><tr key={t.id} style={{cursor:"pointer"}} onClick={()=>open(t.id)}><td className="mono sub">{t.id}</td><td>{t.t}</td><td><span className="pri-t"><i style={{background:PRI[t.p][1]}}/>{PRI[t.p][0]}</span></td><td><span className={"badge s-"+t.s}>{SL[t.s]}</span></td><td className="sub">{t.due}</td></tr>)}
      {!list.length&&<tr><td colSpan="5" className="empty">No tasks match. Clear the search or filter.</td></tr>}</tbody></table></div>}
  </div>}

function Drawer({t,setTasks,close,toast,user}){
  const [c,setC]=useState("");
  const up=f=>setTasks(ts=>ts.map(x=>x.id===t.id?f(x):x));
  const send=()=>{if(!c.trim())return;up(x=>({...x,c:[...x.c,[user.name,c.trim(),"just now"]]}));setC("")};
  const dn=t.sub.filter(s=>s[1]).length;
  return <aside className="drawer" aria-label="Task details">
    <div className="row"><span className="mono sub">{t.id}</span><div className="sp"><button className="ib" title="Copy link" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href+"#"+t.id);toast("Link copied")}}><Ic n="link"/></button><button className="ib" title="Delete task" aria-label="Delete task" onClick={()=>{if(confirm("Delete this task?")){setTasks(ts=>ts.filter(x=>x.id!==t.id));close();toast("Task deleted")}}}><Ic n="trash"/></button><button className="ib" onClick={close} aria-label="Close"><Ic n="x"/></button></div></div>
    <div><h3 style={{fontSize:20,lineHeight:"28px",fontWeight:500}}>{t.t}</h3><p className="sub" style={{marginTop:6}}>{t.d}</p></div>
    <div className="card pad" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,boxShadow:"none"}}>
      <label className="sub">Status<select style={{width:"100%",marginTop:4}} value={t.s} onChange={e=>{up(x=>stamp(x,e.target.value));toast("Moved to "+SL[e.target.value])}}>{ST.map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>
      <label className="sub">Priority<select style={{width:"100%",marginTop:4}} value={t.p} onChange={e=>up(x=>({...x,p:e.target.value}))}>{Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
      <div className="sub">Assignee<div className="row" style={{color:"var(--t1)",marginTop:6}}><Avatar n={user.name}/>{user.name}</div></div>
      <label className="sub">Due<input type="date" className="inp" style={{width:"100%",marginTop:4}} value={t.date||""} onChange={e=>up(x=>({...x,date:e.target.value,due:fmt(e.target.value)}))}/></label></div>
    {t.sub.length>0&&<div><div className="row" style={{marginBottom:8}}><h3>Subtasks</h3><span className="sub sp mono">{dn} of {t.sub.length}</span></div>
      {t.sub.map((s,i)=><button key={i} className="row" style={{padding:"7px 0",width:"100%",textAlign:"left"}} onClick={()=>up(x=>({...x,sub:x.sub.map((q,j)=>j===i?[q[0],q[1]?0:1]:q)}))}><span className={"chk"+(s[1]?" on":"")}>{s[1]?<Ic n="check" s={12}/>:null}</span><span className={s[1]?"done":""}>{s[0]}</span></button>)}</div>}
    <div><h3 style={{marginBottom:8}}>Activity</h3>{t.c.length?t.c.map((m,i)=><div key={i} className="row" style={{alignItems:"flex-start",marginBottom:12}}><Avatar n={m[0]}/><div style={{background:"var(--p1)",borderRadius:12,padding:"8px 12px",flex:1}}><div className="row"><b style={{fontWeight:500}}>{m[0]}</b><span className="mono sp" style={{color:"var(--t3)"}}>{m[2]}</span></div><div className="sub">{m[1]}</div></div></div>):<p className="sub">No comments yet.</p>}</div>
    <div className="row" style={{marginTop:"auto"}}><input className="inp" style={{flex:1}} placeholder="Write a comment" value={c} onChange={e=>setC(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="btn pri" onClick={send} aria-label="Send"><Ic n="send"/></button></div>
  </aside>}

