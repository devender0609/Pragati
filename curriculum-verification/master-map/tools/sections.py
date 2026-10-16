import pymupdf,re,json,sys,hashlib
def printed_page(page):
    H=page.rect.height; best=None
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines',[]):
            t=''.join(s['text'] for s in l['spans']).strip()
            y=l['bbox'][1]
            if re.fullmatch(r'\d{1,3}',t) and y>0.85*H:
                if best is None or y>best[0]: best=(y,int(t))
    return best[1] if best else None
def clean(t):
    t=re.sub(r'[\x00-\x1f]',' ',t); t=re.sub(r'\s+',' ',t).strip(); return t
def headings(pdf,ch,minsize=None):
    doc=pymupdf.open(pdf); cands=[]
    for pno,page in enumerate(doc):
        pp=printed_page(page)
        blocks=page.get_text('dict')['blocks']
        flat=[(bi,l) for bi,b in enumerate(blocks) for l in b.get('lines',[])]
        for li,(bi,l) in enumerate(flat):
                t=clean(''.join(s['text'] for s in l['spans']))
                m=re.match(r'^(\d{1,2})\.(\d{1,2})\.?\s+(.+)$',t)
                if not m or int(m.group(1))!=ch: continue
                s=l['spans'][0]; bold=('Bold' in s['font']) or (s['flags']&16)
                # a heading that wraps continues on the following line(s) in the same
                # font and size, starting below it at roughly the same indent
                title=m.group(3); k=li+1; lasty=l['bbox'][3]
                while (bold or s['size']>=13.5) and k<len(flat):
                    nl=flat[k][1]; ns=nl['spans'][0]; nt=clean(''.join(x['text'] for x in nl['spans']))
                    if nt and abs(ns['size']-s['size'])<0.3 and ns['font']==s['font'] and -0.5*s['size']<=nl['bbox'][1]-lasty<s['size']*0.9 and not re.match(r'^\d{1,2}\.\d',nt):
                        title=(title.rstrip()+nt) if title.rstrip().endswith(('–','-','—')) else (title+' '+nt); lasty=nl['bbox'][3]; k+=1
                    else: break
                cands.append(dict(n=int(m.group(2)),title=clean(title),pdfPage=pno+1,printed=pp,size=round(s['size'],1),bold=bool(bold),font=s['font'],y=l['bbox'][1],x=l['bbox'][0]))
    return cands
def pick(cands,size):
    out={}
    for c in cands:
        if c['bold'] and c['size']>=12.5 and len(c['title'])<90 and c['n'] not in out: out[c['n']]=dict(c,method='heading_font' if abs(c['size']-size)<0.6 else 'bold_numbered_smaller_font')
    top=max(out) if out else 0
    for n in range(1,top+1):
        if n in out: continue
        for c in cands:
            if c['n']==n and len(c['title'])<80:
                out[n]=dict(c,method='fallback_numbered_line'); break
    res=[out[k] for k in sorted(out)]
    for i,c in enumerate(res):
        if c['printed'] is None:
            # chapter-opening pages carry no folio; infer from the next page with one
            c['printedInferred']=True
    return res
if __name__=='__main__':
    d,code,n=sys.argv[1],sys.argv[2],int(sys.argv[3])
    allc={ch:headings(f'{d}/{code}{ch:02d}.pdf',ch) for ch in range(1,n+1)}
    sizes={}
    for ch,cs in allc.items():
        for c in cs:
            if c['bold']: sizes[c['size']]=sizes.get(c['size'],0)+1
    print('bold sizes',sorted(sizes.items(),key=lambda x:-x[0]))
    size=float(sys.argv[4]) if len(sys.argv)>4 else max(sizes)
    res={}
    for ch,cs in allc.items():
        p=pick(cs,size); res[ch]=p
        nums=[c['n'] for c in p]
        flag='' if nums==list(range(1,len(nums)+1)) else f'  !! NON-CONTIGUOUS {nums}'
        print(f'CH {ch}: {len(p)}{flag}')
        for c in p: print(f"   {ch}.{c['n']} {c['title']!r} pdf p{c['pdfPage']} printed {c['printed']}")
    json.dump({str(k):v for k,v in res.items()},open(f'{code}_sections.json','w'),indent=1,ensure_ascii=False)
