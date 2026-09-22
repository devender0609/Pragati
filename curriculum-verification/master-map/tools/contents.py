import re,sys,json
def parse(txt,start_pat=r'^\f?\s*Contents\s*$'):
    lines=txt.split('\n')
    i=max(k for k,l in enumerate(lines) if re.match(start_pat,l,re.I))
    out=[];cur=None;pending=None
    for l in lines[i+1:]:
        l=l.replace('\f','').rstrip()
        if not l.strip() or 'indd' in l or 'Reprint 20' in l or re.fullmatch(r'\s*[xivl]+\s*',l) or re.fullmatch(r'\s*PART I+\s*',l): continue
        s=l.strip()
        m=re.match(r'^(\d{1,2})\.(?:(\d{1,2})(?:\.(\d{1,2}))?)?\s+(.*?)\s+(\d{1,3})$',s)
        mapx=re.match(r'^(Appendix \d+:?|A\.\d+\.\d+|Answers|Supplementary Material|Foreword|Preface|Rationalisation.*|About the Book)\b\s*(.*?)\s+([ivx\d]{1,4})$',s)
        mnp=re.match(r'^(\d{1,2})\.(?:(\d{1,2})(?:\.(\d{1,2}))?)?\s+(.*\S)$',s)
        if m:
            a,b,c,t,p=m.groups()
            if pending: t=pending+' '+t; pending=None
            lvl='chapter' if b is None else ('section' if c is None else 'subsection')
            out.append(dict(level=lvl,chapter=int(a),section=int(b) if b else None,sub=int(c) if c else None,title=t,page=int(p)))
        elif mapx:
            out.append(dict(level='backmatter',title=(mapx.group(1)+' '+mapx.group(2)).strip(),page=mapx.group(3)))
        elif mnp:
            pending=None
            a,b,c,t=mnp.groups()
            lvl='chapter' if b is None else ('section' if c is None else 'subsection')
            out.append(dict(level=lvl,chapter=int(a),section=int(b) if b else None,sub=int(c) if c else None,title=t,page=None,wrapped=True))
        else:
            # continuation of a wrapped title
            m2=re.match(r'^(.*?)\s+(\d{1,3})$',s)
            if out and out[-1].get('wrapped'):
                if m2: out[-1]['title']+=' '+m2.group(1); out[-1]['page']=int(m2.group(2)); out[-1].pop('wrapped')
                else: out[-1]['title']+=' '+s
            else:
                if s.startswith('(') or 'Constitution' in s or 'Fundamental Duties' in s or s.startswith('*'): break
                if out and out[-1]['level'] in ('chapter','section','subsection') and not m2:
                    out[-1]['title']+=' '+s; out[-1]['continued']=True
                else:
                    if out and out[-1]['level']=='UNPARSED': out.pop(); break
                    out.append(dict(level='UNPARSED',text=s))
    return out
if __name__=='__main__':
    r=parse(open(sys.argv[1]).read())
    json.dump(r,open(sys.argv[2],'w'),indent=1,ensure_ascii=False)
    for x in r: print(x)
