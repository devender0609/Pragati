// v0.74 §10/§12 — INTERACTION MATRIX. Click every visible primary CTA
// and record what it does. A control that changes nothing is a FAIL.
import puppeteer from 'puppeteer';
import fs from 'fs';
const BASE='http://127.0.0.1:4173/';
const WIDTHS=[390,768,1440];
const wait=m=>new Promise(r=>setTimeout(r,m));
const RS=[{id:'stu_demo_1',name:'Asha',grade:'Class 6',gradeId:'class6',curriculumId:'cbse',createdAt:Date.now()-8.64e7}];
const rows=[];

async function txt(p){return p.evaluate(()=>document.body.innerText);}
// Click the first VISIBLE match.
//
// The app renders BOTH navs at every width and hides one with CSS, so
// "the first button whose text matches" is often the hidden desktop
// nav — measuring 0x0 and doing nothing when clicked. visualQa.mjs
// already learned this and clicks the LAST exact match. Selecting on
// visibility is the same fix stated as what it means: a control a
// person cannot see is not a control they can use.
async function clickText(p,t,exact=false){
  return p.evaluate((t,exact)=>{
    const bs=[...document.querySelectorAll('button,a[href]')]
      .filter(x=>{const s=(x.textContent||'').trim();return exact?s===t:s.includes(t);});
    if(bs.length===0)return 'ABSENT';
    const vis=bs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0;});
    if(vis.length===0)return 'HIDDEN_AT_THIS_WIDTH';
    vis[0].scrollIntoView({block:'center'});vis[0].click();return 'CLICKED';
  },t,exact);
}
async function probe(p,width,surface,label,before,opts={}){
  const b=await txt(p);
  const status=await clickText(p,label,opts.exact);
  await wait(opts.wait??700);
  const a=await txt(p);
  const changed=a!==b;
  rows.push({width,surface,control:label,status,changed,
    dest:(a.split('\n').filter(Boolean)[opts.destLine??2]||'').slice(0,60)});
  return {status,changed};
}
async function dismiss(p){for(let i=0;i<8;i++){const r=await clickText(p,'Skip');if(r!=='CLICKED')break;await wait(250);}}
async function reset(p){
  await p.goto(BASE,{waitUntil:'domcontentloaded'});
  await p.evaluate(s=>{localStorage.clear();localStorage.setItem('pragati.students.v1',JSON.stringify(s));},RS);
  await p.goto(BASE,{waitUntil:'networkidle0'});await wait(700);await dismiss(p);
}
async function toTeacher(p){
  await reset(p);
  await clickText(p,'Student mode');await wait(900);
  await clickText(p,'Teacher dashboard');await wait(900);await dismiss(p);
}
const browser=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
for(const width of WIDTHS){
  const p=await browser.newPage();await p.setViewport({width,height:900});

  // ---------- STUDENT ----------
  await reset(p);
  for(const t of ['Learn','Practice','Progress','Home'])
    await probe(p,width,'Student nav',t,null,{exact:true});

  await reset(p);
  await clickText(p,'Learn',true);await wait(700);
  // v0.76 — the featured chapter moved from a tile labelled "Chapter 7"
  // into the hero band, whose action is "Open this chapter". The
  // capability being probed is unchanged: from Learn, one tap opens the
  // one chapter that is ready. Only the label it is carried on moved.
  await probe(p,width,'Student Learn','Open this chapter');
  await probe(p,width,'Student Fractions','Fractions as parts of a whole');
  // in a lesson now
  // NOTE: "Worked examples" / "Think deeper" are §7.4 lesson stages.
  // §7.4 is an unpublished draft reachable ONLY through the Admin
  // reviewer preview, so they are correctly absent from the student
  // route and are captured under admin_* by visualQa.mjs instead.

  await reset(p);
  await clickText(p,'Practice',true);await wait(700);
  for(const t of ['Practise a concept','Open chapter','Mixed practice','Chapter check']){
    await reset(p);await clickText(p,'Practice',true);await wait(700);
    await probe(p,width,'Student Practice',t);
  }

  await reset(p);
  await clickText(p,'Progress',true);await wait(700);
  // The Progress next-action. v0.72 §14 made it name what it actually
  // opens; the probe asserts the qualifier is still attached.
  await probe(p,width,'Student Progress','Start: Fractions as parts of a whole');

  // ---------- TEACHER ----------
  await toTeacher(p);
  for(const t of ['Classes','Assign','Assess','Insights','Resources']){
    await toTeacher(p);
    await probe(p,width,'Teacher nav',t,null,{exact:true});
  }
  await toTeacher(p);
  await probe(p,width,'Teacher Overview','Open Classes');
  await toTeacher(p);
  await probe(p,width,'Teacher Overview','Create assignment');
  await toTeacher(p);
  await probe(p,width,'Teacher Overview','View curriculum');

  await p.close();
}
await browser.close();
fs.writeFileSync('/tmp/interaction.json',JSON.stringify(rows,null,2));
const bad=rows.filter(r=>r.status!=='CLICKED'||!r.changed);
console.log('probes',rows.length,'problems',bad.length);
for(const b of bad)console.log(`  ${b.width} ${b.surface} :: "${b.control}" -> ${b.status} changed=${b.changed}`);
