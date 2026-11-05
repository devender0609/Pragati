import pup from 'puppeteer';
import { seedStudentForBrowserQa, clickByText } from './studentFixture.mjs';
const STAGES = ['Learn the idea', 'See it', 'Worked examples', 'Try it', 'Think deeper'];
const errs = [], warns = [];
const b = await pup.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const p = await b.newPage();
p.on('console', (m) => { const t = m.text().slice(0, 90); if (m.type() === 'error') errs.push(t); else if (m.type() === 'warning') warns.push(t); });
p.on('pageerror', (e) => errs.push('UNCAUGHT: ' + String(e.message).slice(0, 90)));
await p.setViewport({ width: 1280, height: 900 });
const seed = await seedStudentForBrowserQa(p);
console.log('ACTIVE:', seed.confirmedBy);
const cat = await p.evaluate(() => [...document.body.innerText.matchAll(/CHAPTER (\d+)\s*\n([^\n]+)\s*\n(\d+) lessons/g)].map((m)=>({n:+m[1],t:m[2].trim(),l:+m[3]})));
console.log('CATALOGUE:', JSON.stringify(cat));
await clickByText(p, 'Complex Numbers');
const ids = await p.evaluate(() => [...document.querySelectorAll('[data-artifact-id]')].map((e)=>e.getAttribute('data-artifact-id')));
console.log('CH4 ROWS:', ids.length, '| unique:', new Set(ids).size, '| foreign:', ids.filter((i)=>!/kemh1/.test(i||'')).length);
let walked = 0, maxOv = 0;
for (let i = 0; i < ids.length; i += 1) {
  await seedStudentForBrowserQa(p); await clickByText(p, 'Complex Numbers');
  await p.evaluate((n) => { const r=[...document.querySelectorAll('[data-artifact-id]')][n]; (r?.querySelector('button,a,[role=button]')||r)?.click(); }, i);
  await new Promise((r)=>setTimeout(r,600));
  let st = 0;
  for (const s of STAGES) { if (await clickByText(p, s, 280)) st += 1; }
  const fin = await clickByText(p, 'Finish');
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  maxOv = Math.max(maxOv, ov);
  if (st === 5 && fin) walked += 1;
  console.log(`  ${String(ids[i]).replace('ncert_kemh1_','').padEnd(34)} stages ${st}/5 finish ${fin} ov ${ov}px`);
}
console.log('WALKED:', walked + '/' + ids.length, '| max overflow', maxOv + 'px');
// Argand figure in the DOM
await seedStudentForBrowserQa(p); await clickByText(p, 'Complex Numbers');
await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-artifact-id]')][4];(r?.querySelector('button,a,[role=button]')||r)?.click();});
await new Promise((r)=>setTimeout(r,600)); await clickByText(p, 'See it');
const g = await p.evaluate(() => {
  const svgs=[...document.querySelectorAll('svg')];
  const named=svgs.filter((s)=>(s.getAttribute('aria-label')||'').length>40);
  return { total:svgs.length, named:named.length, decorative:svgs.filter((s)=>s.getAttribute('aria-hidden')==='true').length,
    alts:named.map((s)=>s.getAttribute('aria-label')), pts:named.map((s)=>s.querySelectorAll('circle').length) };
});
console.log('ARGAND: svgs', g.total, '| named', g.named, '| plotted points per figure', JSON.stringify(g.pts));
for (const a of g.alts) console.log(`  [${a.length}] colour=${/\b(red|blue|green|colour|color)\b/i.test(a)} axes=${/real|imaginary/i.test(a)}\n     "${a.slice(0,130)}"`);
for (const [w,h,label] of [[1280,900,'1280'],[834,1112,'834'],[360,740,'360']]) {
  await p.setViewport({width:w,height:h});
  let worst=0, over=0;
  for (let i=0;i<ids.length;i+=1){
    await seedStudentForBrowserQa(p); await clickByText(p,'Complex Numbers');
    await p.evaluate((n)=>{const r=[...document.querySelectorAll('[data-artifact-id]')][n];(r?.querySelector('button,a,[role=button]')||r)?.click();},i);
    await new Promise((r)=>setTimeout(r,450));
    for (const s of ['See it','Worked examples','Try it']) {
      await clickByText(p,s,200);
      const m = await p.evaluate(()=>{const de=document.documentElement;return{ov:de.scrollWidth-de.clientWidth,
        over:[...document.querySelectorAll('svg,table,pre,code')].filter((e)=>e.getBoundingClientRect().width>de.clientWidth+1).length};});
      worst=Math.max(worst,m.ov); over+=m.over;
    }
  }
  console.log(`  ${label}px page overflow ${worst}px | elements wider than viewport ${over}`);
}
console.log('CONSOLE errors=' + errs.length, 'warnings=' + warns.length);
if (errs.length) console.log(' ', JSON.stringify(errs.slice(0,3)));
await b.close();
