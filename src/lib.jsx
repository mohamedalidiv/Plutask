const {useState,useMemo,useRef,useEffect}=React;
const pad=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const off=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const pd=s=>{const[a,b,c]=s.split("-");return new Date(+a,b-1,+c)};
const fmt=s=>s?pd(s).toLocaleDateString("en",{month:"short",day:"numeric"}):"No date";
const dd=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const TODAY=off(0);
let NS="";
const useLS=(k,d)=>{
  const key=useRef("tl:"+NS+k).current;
  const [v,s]=useState(()=>{try{const x=localStorage.getItem(key);return x?JSON.parse(x):d}catch(e){return d}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}},[key,v]);
  return [v,s];
};
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hash=s=>{let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return h.toString(36)};
