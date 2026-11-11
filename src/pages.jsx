Object.assign(P,{cal:"M7 3v4M17 3v4M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",gantt:"M4 6h8M8 12h10M6 18h9",team:"M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2-2.8M16 5.2a3 3 0 0 1 0 5.6",gear:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12l2-1 .5-1.7-1-2 1.4-1.4 2 1L10.600 6l1-2h2l1 2 1.700.5 2-1 1.400 1.400-1 2L19 11l2 1v2l-2 1-.5 1.700 1 2-1.400 1.400-2-1L14 20l-1 2h-2l-1-2-1.700-.5-2 1-1.400-1.400 1-2L5 15l-2-1z",trash:"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",menu:"M4 6h16M4 12h16M4 18h16",out:"M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9",left:"M15 6l-6 6 6 6",right:"M9 6l6 6-6 6"});
const ROLES=["Owner","Engineer","Designer","Product manager","QA"];
const Modal=({title,onClose,children})=><div className="scrim" onClick={onClose}><div className="modal" role="dialog" aria-label={title} onClick={e=>e.stopPropagation()}><h3 style={{fontSize:20}}>{title}</h3>{children}</div></div>;

function LineChart({labels,series,h=250,fmtV=v=>v}){
  const ref=useRef();const [i,setI]=useState(null);const uid=useRef("g"+Math.random().toString(36).slice(2,7)).current;
  const n=labels.length,W=720,pl=36,pr=16,pt=16,pb=28,sw=(W-pl-pr)/Math.max(n-1,1);
  const mx=Math.max(10,Math.ceil(Math.max(...series.flatMap(s=>s.d))/10)*10);
  const x=k=>pl+k*sw,y=v=>pt+(1-v/mx)*(h-pt-pb);
  const path=d=>d.map((v,k)=>{if(!k)return`M${x(0)} ${y(v)}`;const m=(x(k)+x(k-1))/2;return`C${m} ${y(d[k-1])} ${m} ${y(v)} ${x(k)} ${y(v)}`}).join("");
  const mv=e=>{const r=ref.current.getBoundingClientRect();setI(Math.max(0,Math.min(n-1,Math.round(((e.clientX-r.left)/r.width*W-pl)/sw))))};
  const step=Math.ceil(n/7);
  return <div style={{position:"relative"}}>
    <svg ref={ref} viewBox={`0 0 ${W} ${h}`} style={{width:"100%",display:"block",touchAction:"pan-y"}} onPointerMove={mv} onPointerDown={mv} onPointerLeave={()=>setI(null)} role="img" aria-label="Line chart">
      <defs>{series.map((s,j)=><linearGradient key={j} id={uid+j} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.c} stopOpacity=".22"/><stop offset="1" stopColor={s.c} stopOpacity="0"/></linearGradient>)}</defs>
      {[0,1,2,3,4].map(t=><g key={t}><line x1={pl} x2={W-pr} y1={y(mx*t/4)} y2={y(mx*t/4)} stroke="#292b33" strokeDasharray={t?"3 4":""}/><text x={pl-8} y={y(mx*t/4)+4} textAnchor="end" fill="#6b7280" fontSize="11" fontFamily="JetBrains Mono">{Math.round(mx*t/4)}</text></g>)}
      {labels.map((l,k)=>k%step===0&&<text key={k} x={x(k)} y={h-8} textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="JetBrains Mono">{l}</text>)}
      {series.map((s,j)=>s.area&&<path key={"a"+j} d={path(s.d)+`L${x(n-1)} ${y(0)}L${x(0)} ${y(0)}Z`} fill={`url(#${uid}${j})`}/>)}
      {series.map((s,j)=><path key={j} d={path(s.d)} fill="none" stroke={s.c} strokeWidth="2" strokeDasharray={s.dash} strokeLinecap="round"/>)}
      {i!=null&&<g><line x1={x(i)} x2={x(i)} y1={pt} y2={h-pb} stroke="#6b7280" strokeDasharray="3 3"/>{series.map((s,j)=><circle key={j} cx={x(i)} cy={y(s.d[i])} r="4.5" fill="#101114" stroke={s.c} strokeWidth="2"/>)}</g>}
    </svg>
    {i!=null&&<div className="tip" style={{left:`clamp(75px,${x(i)/W*100}%,calc(100% - 75px))`}}><div className="mono sub" style={{marginBottom:4}}>{labels[i]}</div>{series.map(s=><div key={s.n} className="row" style={{gap:6}}><i style={{width:8,height:8,borderRadius:"50%",background:s.c}}/>{s.n}<b className="sp" style={{fontWeight:500}}>{fmtV(s.d[i])}</b></div>)}</div>}
  </div>}

function Chart({range,tasks}){
  const n={"7D":7,"14D":14,"30D":30}[range]||7;
  const days=Array.from({length:n},(_,k)=>off(k-n+1));
  return <LineChart labels={days.map(fmt)} series={[{n:"Created",c:"#60a5fa",d:days.map(d=>tasks.filter(t=>t.created===d).length)},{n:"Completed",c:"#8b5cf6",d:days.map(d=>tasks.filter(t=>t.doneAt===d).length),area:1}]} fmtV={v=>v+(v===1?" task":" tasks")}/>}

function Reports({tasks,projs,team,toast}){
  const [r,setR]=useState("14D"),[q,setQ]=useState("");
  const n={"7D":7,"14D":14,"30D":30}[r],days=Array.from({length:n},(_,k)=>off(k-n+1));
  const tot=tasks.length,done=tasks.filter(t=>t.s==="done").length;
  const dl=tasks.filter(t=>t.doneAt&&t.date),ont=dl.length?pct(dl.filter(t=>t.doneAt<=t.date).length,dl.length)+"%":"—";
  const dn=tasks.filter(t=>t.doneAt&&t.created),cyc=dn.length?(dn.reduce((a,t)=>a+dd(t.created,t.doneAt),0)/dn.length).toFixed(1)+" days avg cycle":"No cycle time yet";
  const rem=days.map(d=>tasks.filter(t=>(t.created||"0")<=d&&!(t.doneAt&&t.doneAt<=d)).length),cum=days.map(d=>tasks.filter(t=>t.doneAt&&t.doneAt<=d).length);
  const cnt=k=>tasks.filter(t=>t.p===k).length,data=[["urgent","#f43f5e"],["high","#f59e0b"],["med","#60a5fa"],["low","#10b981"]];
  let acc=0;const R=62,C=2*Math.PI*R;
  const rows=projs.filter(p=>(p.n+p.lead).toLowerCase().includes(q.toLowerCase()));
  const exp=()=>{const c=[["Project","Lead","Done","Total","Linked tasks","Status","Due"],...rows.map(p=>[p.n,p.lead,p.done,p.tot,tasks.filter(t=>t.proj===p.id).length,PS[p.st],p.due])].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([c],{type:"text/csv"}));a.download="report.csv";a.click();toast("report.csv downloaded")};
  return <div className="page">
    <div className="ph"><div><h1>Reports</h1><p className="sub">Built from your tasks, projects and team.</p></div><div className="sp"><button className="btn" onClick={exp}><Ic n="down"/>Export CSV</button></div></div>
    <div className="kpis">{[["Completed",done,"of "+tot+" tasks"],["Open tasks",tot-done,cyc],["Completion rate",tot?pct(done,tot)+"%":"—","all tasks"],["On-time delivery",ont,dl.length?dl.length+" finished with a due date":"No finished tasks yet"]].map(k=><div key={k[0]} className="card kpi"><span className="l">{k[0]}</span><span className="v">{k[1]}</span><span className="d" style={{color:"var(--t2)"}}>{k[2]}</span></div>)}</div>
    <div className="g2"><div className="card pad"><div className="row"><div><h3>Open vs completed</h3><p className="sub" style={{fontSize:13}}>Tasks over the selected period</p></div><div className="seg sp">{["7D","14D","30D"].map(x=><button key={x} className={r===x?"on":""} onClick={()=>setR(x)}>{x}</button>)}</div></div>
      <LineChart labels={days.map(fmt)} series={[{n:"Open",c:"#8b5cf6",d:rem,area:1},{n:"Completed",c:"#10b981",d:cum}]} fmtV={v=>v+(v===1?" task":" tasks")}/></div>
      <div className="card pad"><h3>Priority split</h3><p className="sub" style={{fontSize:13}}>{tot} tasks</p>
        {tot?<><svg viewBox="0 0 160 160" style={{width:160,display:"block",margin:"10px auto"}}><g transform="rotate(-90 80 80)">{data.map(([k,c])=>{const L=cnt(k)/tot*C;const el=<circle key={k} cx="80" cy="80" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${Math.max(L-2,0)} ${C}`} strokeDashoffset={-acc}/>;acc+=L;return el})}</g><text x="80" y="86" textAnchor="middle" fill="#f9fafb" fontSize="26" fontWeight="600">{tot}</text></svg>
        {data.map(([k,c])=><div key={k} className="row" style={{padding:"3px 0"}}><i style={{width:8,height:8,borderRadius:"50%",background:c}}/>{PRI[k][0]}<span className="sp mono sub">{cnt(k)}</span></div>)}</>:<div className="empty">Create tasks to see the split.</div>}</div></div>
    <div className="card pad"><h3 style={{marginBottom:12}}>Team workload</h3>{team.map(t=><div key={t.id} className="row" style={{marginBottom:10}}><Avatar n={t.name}/><span style={{width:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span><div className="bar" style={{flex:1}}><i style={{width:t.load+"%",background:t.load>90?"var(--bad)":"var(--v)"}}/></div><span className="mono" style={{width:40,textAlign:"right",color:t.load>90?"var(--bad)":"var(--t2)"}}>{t.load}%</span></div>)}{!team.length&&<div className="empty">Add team members to track workload.</div>}</div>
    <div className="card pad"><div className="row" style={{marginBottom:10}}><h3>Projects</h3><input className="inp sp" placeholder="Filter projects" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <table><thead><tr><th>Project</th><th>Lead</th><th>Progress</th><th>Linked tasks</th><th>Status</th><th>Due</th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td>{p.n}</td><td className="sub">{p.lead}</td><td className="mono">{p.done}/{p.tot} ({pct(p.done,p.tot)}%)</td><td className="mono">{tasks.filter(t=>t.proj===p.id).length}</td><td><span className={"badge s-"+p.st}>{PS[p.st]}</span></td><td className="mono sub">{p.due}</td></tr>)}{!rows.length&&<tr><td colSpan="6" className="empty">{projs.length?"No projects match.":"No projects yet."}</td></tr>}</tbody></table></div>
  </div>}

function Login({onAuth}){
  const [mode,setMode]=useState("in");const [f,setF]=useState({name:"",email:"",pw:""});const [err,setErr]=useState({});
  const set=k=>e=>setF({...f,[k]:e.target.value});
  const submit=e=>{e.preventDefault();const er={},em=f.email.trim().toLowerCase();
    if(mode==="up"&&f.name.trim().length<2)er.name="Enter your full name";
    if(!EMAIL.test(em))er.email="Enter a valid email, like name@company.com";
    if(f.pw.length<6)er.pw="Use at least 6 characters";
    setErr(er);if(Object.keys(er).length)return;
    const acc=JSON.parse(localStorage.getItem("tl:accounts")||"[]"),ex=acc.find(a=>a.email===em);
    if(mode==="up"){if(ex)return setErr({email:"This email already has an account. Sign in instead."});
      localStorage.setItem("tl:accounts",JSON.stringify([...acc,{name:f.name.trim(),email:em,pw:hash(f.pw)}]));onAuth({name:f.name.trim(),email:em})}
    else{if(!ex||ex.pw!==hash(f.pw))return setErr({pw:"Email or password is incorrect"});onAuth({name:ex.name,email:em})}};
  return <main className="login"><form className="card" onSubmit={submit} noValidate>
    <div className="brand" style={{padding:0}}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 5h14M3 12h18M3 19h10" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/></svg>Plutask</div>
    <div><h1 style={{fontSize:24}}>{mode==="in"?"Sign in to your workspace":"Create your account"}</h1><p className="sub">{mode==="in"?"Pick up where you left off.":"Free to try. Your data stays in this browser."}</p></div>
    {mode==="up"&&<label className="fl">Full name<input className="inp" autoComplete="name" value={f.name} onChange={set("name")}/>{err.name&&<span className="err">{err.name}</span>}</label>}
    <label className="fl">Email<input className="inp" type="email" autoComplete="email" placeholder="name@company.com" value={f.email} onChange={set("email")}/>{err.email&&<span className="err">{err.email}</span>}</label>
    <label className="fl">Password<input className="inp" type="password" autoComplete={mode==="in"?"current-password":"new-password"} value={f.pw} onChange={set("pw")}/>{err.pw&&<span className="err">{err.pw}</span>}</label>
    <button className="btn pri" style={{justifyContent:"center"}}>{mode==="in"?"Sign in":"Create account"}</button>
    <button type="button" className="btn" style={{justifyContent:"center"}} onClick={()=>onAuth({name:"Alex Vance",email:"alex@plutask.dev"})}>Continue with demo account</button>
    <p className="sub" style={{textAlign:"center"}}>{mode==="in"?"New here? ":"Already registered? "}<button type="button" style={{color:"var(--b)"}} onClick={()=>{setMode(mode==="in"?"up":"in");setErr({})}}>{mode==="in"?"Create an account":"Sign in"}</button></p>
  </form></main>}

function Projects({ps,setPs,tasks,team,pid,setPid,open,newTask,toast}){
  const [f,setF]=useState("all"),[q,setQ]=useState(""),[sort,setSort]=useState("due"),[pf,setPf]=useState("all"),[m,setM]=useState(false);
  const [nw,setNw]=useState({n:"",d:"",lead:team[0]?team[0].name:"",end:off(30),pr:"med"});
  const p=ps.find(x=>x.id===pid);
  if(p){
    const pt=tasks.filter(t=>t.proj===p.id),u=o=>setPs(a=>a.map(x=>x.id===p.id?{...x,...o}:x));
    const del=()=>{if(confirm("Delete "+p.n+"? This can't be undone.")){setPs(a=>a.filter(x=>x.id!==p.id));setPid(null);toast("Project deleted")}};
    const dup=()=>{setPs(a=>[{...p,id:"p"+Date.now(),n:p.n+" (copy)"},...a]);setPid(null);toast("Project duplicated")};
    return <div className="page"><div className="ph"><button className="btn sm" onClick={()=>setPid(null)}><Ic n="left" s={14}/>All projects</button><div className="sp"><button className="btn sm" onClick={dup}>Duplicate</button><button className="btn sm" style={{color:"var(--bad)"}} onClick={del}><Ic n="trash" s={14}/>Delete</button></div></div>
      <div className="g2b" style={{gridTemplateColumns:"1.3fr 1fr"}}>
        <div className="card pad" style={{display:"flex",flexDirection:"column",gap:12}}>
          <input className="inp" style={{fontSize:22,height:44,fontWeight:600}} value={p.n} onChange={e=>u({n:e.target.value})} aria-label="Project name"/>
          <textarea className="inp" style={{height:80,padding:10,resize:"none"}} value={p.d} onChange={e=>u({d:e.target.value})} aria-label="Description"/>
          <div className="fgrid">
            <label className="fl">Status<select value={p.st} onChange={e=>u({st:e.target.value})}>{Object.entries(PS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
            <label className="fl">Priority<select value={p.pr} onChange={e=>u({pr:e.target.value})}>{Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
            <label className="fl">Lead<select value={p.lead} onChange={e=>u({lead:e.target.value})}>{team.map(t=><option key={t.id}>{t.name}</option>)}</select></label>
            <label className="fl">Start<input type="date" className="inp" value={p.start} onChange={e=>u({start:e.target.value})}/></label>
            <label className="fl">Due<input type="date" className="inp" value={p.end} onChange={e=>u({end:e.target.value,due:fmt(e.target.value)})}/></label>
            <div className="fl">Tasks done<div className="row"><button className="btn sm" onClick={()=>u({done:Math.max(0,p.done-1)})} aria-label="Decrease">-</button><span className="mono">{p.done}/{p.tot}</span><button className="btn sm" onClick={()=>u({done:Math.min(p.tot,p.done+1)})} aria-label="Increase">+</button><button className="btn sm" onClick={()=>u({tot:p.tot+1})}>+ scope</button></div></div></div>
          <div className="bar"><i style={{width:pct(p.done,p.tot)+"%"}}/></div></div>
        <div className="card pad"><div className="row" style={{marginBottom:10}}><h3>Tasks</h3><button className="btn sm sp" onClick={()=>newTask("",p.id)}><Ic n="plus" s={14}/>Add</button></div>
          {pt.map(t=><button key={t.id} className="row" style={{width:"100%",padding:"9px 0",borderBottom:"1px solid var(--bd2)",textAlign:"left"}} onClick={()=>open(t.id)}><span className={"badge s-"+t.s}>{SL[t.s]}</span><span className={t.s==="done"?"done":""} style={{flex:1}}>{t.t}</span><span className="mono sub">{t.due}</span></button>)}
          {!pt.length&&<div className="empty">No tasks yet. Add the first one.</div>}</div></div></div>}
  const list=ps.filter(x=>(f==="all"||x.st===f)&&(pf==="all"||x.pr===pf)&&(x.n+x.tags.join()+x.lead).toLowerCase().includes(q.toLowerCase()))
    .sort((a,b)=>sort==="name"?a.n.localeCompare(b.n):sort==="progress"?pct(b.done,b.tot)-pct(a.done,a.tot):(a.end||"").localeCompare(b.end||""));
  const csv=()=>{const r=[["Project","Lead","Status","Done","Total","Due"],...ps.map(x=>[x.n,x.lead,PS[x.st],x.done,x.tot,x.due])].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([r],{type:"text/csv"}));a.download="projects.csv";a.click();toast("projects.csv downloaded")};
  const add=()=>{if(!nw.n.trim())return;const id="p"+Date.now();setPs([{id,n:nw.n.trim(),d:nw.d||"No description yet.",tags:["New"],pr:nw.pr,st:"plan",done:0,tot:10,lead:nw.lead,start:TODAY,end:nw.end,due:fmt(nw.end)},...ps]);setNw({...nw,n:"",d:""});setM(false);toast("Project created")};
  return <div className="page">
    <div className="ph"><h1>Projects</h1><span className="badge s-backlog">{ps.length} total</span><div className="sp"><button className="btn" onClick={csv}><Ic n="down"/>Export CSV</button><button className="btn pri" onClick={()=>setM(true)}><Ic n="plus"/>New project</button></div></div>
    <div className="filters"><input className="inp" style={{flex:"1 1 220px",maxWidth:300}} placeholder="Filter by name, tag or lead" value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="seg scrollx">{[["all","All"],...Object.entries(PS)].map(([k,v])=><button key={k} className={f===k?"on":""} onClick={()=>setF(k)}>{v}</button>)}</div>
      <select value={pf} onChange={e=>setPf(e.target.value)}><option value="all">Priority: all</option>{Object.entries(PRI).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select>
      <select value={sort} onChange={e=>setSort(e.target.value)}><option value="due">Sort: due date</option><option value="name">Sort: name</option><option value="progress">Sort: progress</option></select></div>
    <div className="pgrid">{list.map(x=><div key={x.id} className="card pad pc" tabIndex="0" role="button" onClick={()=>setPid(x.id)} onKeyDown={e=>e.key==="Enter"&&setPid(x.id)} style={{display:"flex",flexDirection:"column",gap:12,cursor:"pointer"}}>
      <div className="row">{x.tags.map(t=><span key={t} className="tag">{t}</span>)}<span className="pri-t sp"><i style={{background:PRI[x.pr][1]}}/>{PRI[x.pr][0]}</span></div>
      <div><h3 style={{fontSize:18}}>{x.n}</h3><p className="sub" style={{marginTop:4}}>{x.d}</p></div>
      <div><div className="row mono" style={{marginBottom:6}}><span className={"badge s-"+x.st}>{PS[x.st]}</span><span className="sp sub">{x.done}/{x.tot} ({pct(x.done,x.tot)}%)</span></div><div className="bar"><i style={{width:pct(x.done,x.tot)+"%",background:x.st==="done"?"var(--b)":x.st==="progress"?"var(--warn)":x.st==="ok"?"var(--ok)":"var(--v)"}}/></div></div>
      <div className="row sub" style={{fontSize:13}}><Avatar n={x.lead}/>{x.lead}<span className="sp mono">Due {x.due}</span></div></div>)}
      {!list.length&&<div className="card empty" style={{gridColumn:"1/-1"}}>{ps.length?"No projects match. Clear a filter or create a new project.":"No projects yet. Create your first project to get started."}</div>}</div>
    {m&&<Modal title="New project" onClose={()=>setM(false)}>
      <label>Name<input autoFocus className="inp" value={nw.n} onChange={e=>setNw({...nw,n:e.target.value})} onKeyDown={e=>e.key==="Enter"&&add()}/></label>
      <label>Description<textarea className="inp" value={nw.d} onChange={e=>setNw({...nw,d:e.target.value})}/></label>
      <div className="row"><label style={{flex:1}}>Lead<select value={nw.lead} onChange={e=>setNw({...nw,lead:e.target.value})}>{team.map(t=><option key={t.id}>{t.name}</option>)}</select></label><label style={{flex:1}}>Due<input type="date" className="inp" value={nw.end} onChange={e=>setNw({...nw,end:e.target.value})}/></label></div>
      <div className="row"><button className="btn sp" onClick={()=>setM(false)}>Cancel</button><button className="btn pri" onClick={add}>Create project</button></div></Modal>}
  </div>}

function Calendar({tasks,open,newTask}){
  const [m,setM]=useState(()=>{const d=new Date();d.setDate(1);return d});
  const y=m.getFullYear(),mo=m.getMonth(),first=(new Date(y,mo,1).getDay()+6)%7,dim=new Date(y,mo+1,0).getDate();
  const cells=Array.from({length:Math.ceil((first+dim)/7)*7},(_,k)=>k-first+1),by={};
  tasks.forEach(t=>{if(t.date)(by[t.date]=by[t.date]||[]).push(t)});
  const mv=n=>setM(new Date(y,mo+n,1));
  return <div className="page"><div className="ph"><h1>{m.toLocaleDateString("en",{month:"long",year:"numeric"})}</h1>
    <div className="sp"><button className="btn" onClick={()=>mv(-1)} aria-label="Previous month"><Ic n="left"/></button><button className="btn" onClick={()=>{const d=new Date();d.setDate(1);setM(d)}}>Today</button><button className="btn" onClick={()=>mv(1)} aria-label="Next month"><Ic n="right"/></button><button className="btn pri" onClick={()=>newTask()}><Ic n="plus"/>New task</button></div></div>
    <div className="card cal"><div className="cg">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} className="ch2">{d}</div>)}
      {cells.map((n,k)=>{const ok=n>=1&&n<=dim,ds=ok?`${y}-${pad(mo+1)}-${pad(n)}`:"",ts=by[ds]||[];
        return <div key={k} className={"day"+(ok?"":" out")+(ds===TODAY?" today":"")} onClick={()=>ok&&newTask(ds)}><span className="dn">{ok?n:""}</span>
          {ts.slice(0,3).map(t=><button key={t.id} className="chip" style={{borderLeftColor:PRI[t.p][1]}} onClick={e=>{e.stopPropagation();open(t.id)}}>{t.t}</button>)}
          {ts.length>3&&<span className="more">+{ts.length-3} more</span>}</div>})}</div></div></div>}

function Gantt({ps,setPid,go}){
  const [z,setZ]=useState(10);const w=ps.filter(p=>p.start&&p.end);
  const s0=w.reduce((a,p)=>p.start<a?p.start:a,TODAY),e0=w.reduce((a,p)=>p.end>a?p.end:a,TODAY);
  const st=pd(s0);st.setDate(st.getDate()-7);const start=iso(st),total=dd(start,e0)+14;
  const months=[];for(let d=0;d<total;d++){const t=pd(start);t.setDate(t.getDate()+d);const l=t.toLocaleDateString("en",{month:"short",year:"2-digit"});const L=months[months.length-1];L&&L.l===l?L.n++:months.push({l,n:1})}
  const grid={width:total*z,backgroundImage:`repeating-linear-gradient(90deg,var(--bd2) 0 1px,transparent 1px ${7*z}px)`};
  const tx=dd(start,TODAY)*z;
  return <div className="page"><div className="ph"><div><h1>Gantt</h1><p className="sub">Project timelines. Select a bar to open the project.</p></div>
    <div className="sp"><div className="seg">{[[6,"Compact"],[10,"Normal"],[18,"Wide"]].map(([v,l])=><button key={v} className={z===v?"on":""} onClick={()=>setZ(v)}>{l}</button>)}</div></div></div>
    <div className="card gt"><div style={{width:190+total*z,position:"relative"}}>
      <div className="row" style={{position:"sticky",top:0,zIndex:3,background:"var(--p1)",borderBottom:"1px solid var(--bd)",gap:0}}><div className="gl" style={{color:"var(--t3)"}}>Project</div>{months.map((m,k)=><div key={k} className="mono sub" style={{width:m.n*z,padding:"10px 6px",overflow:"hidden",whiteSpace:"nowrap"}}>{m.l}</div>)}</div>
      {w.map(p=>{const L=dd(start,p.start)*z,W=(dd(p.start,p.end)+1)*z,c=p.st==="done"?"#60a5fa":p.st==="progress"?"#f59e0b":p.st==="ok"?"#10b981":"#8b5cf6";
        return <div key={p.id} className="row" style={{gap:0,height:46,borderBottom:"1px solid var(--bd2)"}}><div className="gl">{p.n}</div>
          <div style={{...grid,position:"relative",height:"100%"}}><button className="gbar" title={`${p.n}: ${fmt(p.start)} to ${fmt(p.end)}, ${pct(p.done,p.tot)}% done`} style={{left:L,width:W,background:c+"33",borderColor:c}} onClick={()=>{setPid(p.id);go("projects")}}><i style={{width:pct(p.done,p.tot)+"%",background:c}}/><span>{pct(p.done,p.tot)}%</span></button>
            <div style={{position:"absolute",left:tx,top:0,bottom:0,width:1,background:"var(--bad)"}}/></div></div>})}
      {!w.length&&<div className="empty">Add start and due dates to a project to see it here.</div>}</div></div></div>}

function Team({team,setTeam,toast}){
  const [q,setQ]=useState(""),[m,setM]=useState(false),[nm,setNm]=useState({name:"",email:"",role:"Engineer"}),[er,setEr]=useState("");
  const list=team.filter(t=>(t.name+t.email+t.role).toLowerCase().includes(q.toLowerCase()));
  const add=()=>{const e=nm.email.trim().toLowerCase();if(nm.name.trim().length<2)return setEr("Enter a name");if(!EMAIL.test(e))return setEr("Enter a valid email");if(team.some(t=>t.email===e))return setEr("This person is already on the team");
    setTeam([...team,{id:"m"+Date.now(),name:nm.name.trim(),email:e,role:nm.role,load:0}]);setNm({name:"",email:"",role:"Engineer"});setEr("");setM(false);toast("Invitation sent to "+e)};
  return <div className="page"><div className="ph"><h1>Team</h1><span className="badge s-backlog">{team.length} members</span><div className="sp"><input className="inp" placeholder="Search people" value={q} onChange={e=>setQ(e.target.value)}/><button className="btn pri" onClick={()=>setM(true)}><Ic n="plus"/>Invite member</button></div></div>
    <div className="pgrid">{list.map(t=><div key={t.id} className="card pad" style={{display:"flex",flexDirection:"column",gap:12}}>
      <div className="row"><Avatar n={t.name}/><div style={{minWidth:0}}><div style={{fontWeight:500}}>{t.name}</div><div className="sub mono" style={{overflow:"hidden",textOverflow:"ellipsis"}}>{t.email}</div></div><button className="ib sp" aria-label={"Remove "+t.name} onClick={()=>{setTeam(team.filter(x=>x.id!==t.id));toast(t.name+" removed")}}><Ic n="trash"/></button></div>
      <select value={t.role} onChange={e=>setTeam(team.map(x=>x.id===t.id?{...x,role:e.target.value}:x))}>{ROLES.map(r=><option key={r}>{r}</option>)}</select>
      <div><div className="row mono sub" style={{marginBottom:6}}>Workload<span className="sp" style={{color:t.load>90?"var(--bad)":"var(--t2)"}}>{t.load}%</span></div><input type="range" min="0" max="100" value={t.load} style={{width:"100%",accentColor:t.load>90?"#f43f5e":"var(--v)"}} onChange={e=>setTeam(team.map(x=>x.id===t.id?{...x,load:+e.target.value}:x))} aria-label="Workload"/></div></div>)}
      {!list.length&&<div className="card empty" style={{gridColumn:"1/-1"}}>{team.length?"No one matches that search.":"No team members yet. Invite someone by email."}</div>}</div>
    {m&&<Modal title="Invite member" onClose={()=>setM(false)}>
      <label>Name<input autoFocus className="inp" value={nm.name} onChange={e=>setNm({...nm,name:e.target.value})}/></label>
      <label>Email<input type="email" className="inp" value={nm.email} onChange={e=>setNm({...nm,email:e.target.value})}/></label>
      <label>Role<select value={nm.role} onChange={e=>setNm({...nm,role:e.target.value})}>{ROLES.map(r=><option key={r}>{r}</option>)}</select></label>
      {er&&<span className="err">{er}</span>}<div className="row"><button className="btn sp" onClick={()=>setM(false)}>Cancel</button><button className="btn pri" onClick={add}>Send invite</button></div></Modal>}</div>}

function Settings({user,setUser,st,setSt,data,toast,out,reset}){
  const [n,setN]=useState(user.name),[e,setE]=useState(user.email),[er,setEr]=useState("");
  const save=()=>{if(n.trim().length<2)return setEr("Enter your name");if(!EMAIL.test(e.trim()))return setEr("Enter a valid email");setEr("");setUser({...user,name:n.trim(),email:e.trim().toLowerCase()});toast("Profile saved")};
  const Tog=({k,l,d})=><div className="row" style={{padding:"10px 0",borderBottom:"1px solid var(--bd2)"}}><div><div>{l}</div><div className="sub" style={{fontSize:13}}>{d}</div></div><button className={"tog sp"+(st[k]?" on":"")} role="switch" aria-checked={!!st[k]} aria-label={l} onClick={()=>setSt({...st,[k]:!st[k]})}><i/></button></div>;
  const exp=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="plutask-data.json";a.click();toast("Data exported")};
  return <div className="page" style={{maxWidth:760}}><div className="ph"><h1>Settings</h1></div>
    <div className="card pad" style={{display:"flex",flexDirection:"column",gap:12}}><h3>Profile</h3><div className="fgrid"><label className="fl">Name<input className="inp" value={n} onChange={x=>setN(x.target.value)}/></label><label className="fl">Email<input type="email" className="inp" value={e} onChange={x=>setE(x.target.value)}/></label></div>{er&&<span className="err">{er}</span>}<div><button className="btn pri" onClick={save}>Save changes</button></div></div>
    <div className="card pad"><h3>Appearance</h3><div className="row" style={{padding:"12px 0"}}>Accent color<div className="row sp">{["#8b5cf6","#60a5fa","#10b981","#f59e0b","#f43f5e"].map(c=><button key={c} className="sw" aria-label={"Accent "+c} style={{background:c,outline:st.accent===c?"2px solid #f9fafb":"none"}} onClick={()=>setSt({...st,accent:c})}/>)}</div></div>
      <Tog k="compact" l="Compact density" d="Tighter rows in tables and lists."/><Tog k="notif" l="Notifications" d="Show the unread dot on the bell."/></div>
    <div className="card pad" style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="btn" onClick={exp}><Ic n="down"/>Export data</button><button className="btn" onClick={reset}>Clear all data</button><button className="btn sp" onClick={out}><Ic n="out"/>Sign out</button></div></div>}
