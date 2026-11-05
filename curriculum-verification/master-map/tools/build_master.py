"""Build the canonical evidence dataset for the Classes 1-12 Mathematics master map.
Inputs: NCERT prelims + chapter PDFs (downloaded 2026-09-22 from ncert.nic.in),
CBSE 2026-27 syllabi (cbseacademic.nic.in). Every record carries its evidence."""
import json,re,hashlib,os
INSPECTED='2026-09-22'
PORTAL='https://ncert.nic.in/textbook.php'
PDF=lambda f:f'https://ncert.nic.in/textbook/pdf/{f}'
def sha(p): return hashlib.sha256(open(p,'rb').read()).hexdigest()
ed=json.load(open('editions.json'))
def history(code):
    return [dict(kind=k,date=d) for k,d in ed[code]['events']]

BOOKS=[
 # code, grade, title, subtitle-as-printed, part, chapters from contents (title,page), sectionsSource
 ('aejm1',1,'Joyful Mathematics','Textbook for Class 1',None,'contents_only'),
 ('bejm1',2,'Joyful Mathematics','Textbook for Class 2',None,'contents_only'),
 ('cemm1',3,'Maths Mela','Textbook of Mathematics for Class 3',None,'contents_only'),
 ('demm1',4,'Math-Mela','Textbook of Mathematics for Grade 4',None,'contents_only'),
 ('eemm1',5,'Math-Mela','Textbook of Mathematics for Grade 5',None,'contents_only'),
 ('fegp1',6,'Ganita Prakash','Textbook of Mathematics for Grade 6',None,'chapter_headings'),
 ('gegp1',7,'Ganita Prakash','Textbook of Mathematics for Grade 7 (Part I)','Part I','chapter_headings'),
 ('gegp2',7,'Ganita Prakash-II','Textbook of Mathematics for Grade 7 (Part II)','Part II','chapter_headings'),
 ('hegp1',8,'Ganita Prakash Part-I','Textbook of Mathematics for Grade 8 (Part-I)','Part I','chapter_headings'),
 ('hegp2',8,'Ganita Prakash Part-II','Textbook of Mathematics for Grade 8 (Part-II)','Part II','chapter_headings'),
 ('iemh1',9,'Ganita Manjari','Textbook of Mathematics for Grade 9 (Part I)','Part I','chapter_headings'),
 ('jemh1',10,'Mathematics','Textbook for Class X',None,'contents_page'),
 ('kemh1',11,'Mathematics','Textbook for Class XI',None,'contents_page'),
 ('lemh1',12,'Mathematics Part I','Textbook for Class XII',"Part I",'contents_page'),
 ('lemh2',12,'Mathematics Part II','Textbook for Class XII',"Part II",'contents_page'),
]
PORTAL_LABEL={'aejm1':'Joyful-Mathematics (English)','bejm1':'Joyful-Mathematics (English)','cemm1':'Maths Mela','demm1':'Math-Mela','eemm1':'Math-Mela','fegp1':'Ganita Prakash','gegp1':'Ganita Prakash','gegp2':'Ganita Prakash-II','hegp1':'Ganita Prakash Part-I','hegp2':'Ganita Prakash Part-II','iemh1':'Ganita Manjari','jemh1':'Mathematics','kemh1':'Mathematics','lemh1':'Mathematics Part-I','lemh2':'Mathematics Part-II'}

def primary_contents(code):
    """chapter list from the contents page of the prelims (Classes 1-9)."""
    t=open(code+'ps.txt').read()
    lines=t.split('\n')
    i=next(k for k,l in enumerate(lines) if re.match(r'^\f?\s*contents\s*$',l,re.I))
    out=[];pend=None
    for l in lines[i+1:i+160]:
        s=l.replace('\f','').replace('\b',' ').replace('\t',' ').strip()
        if not s or 'indd' in s: continue
        if 'Reprint 20' in s and out: 
            continue
        if re.match(r'^(Foreword|About the Book|Note to the Teacher|A Note to Students)\b',s): continue
        if re.match(r'^(Puzzles|Learning Material Sheets|Graph Paper)\b',s):
            m=re.match(r'^(.*?)\s*(\d{1,3})?$',s); out.append(dict(kind='backmatter',title=m.group(1).strip(),page=int(m.group(2)) if m.group(2) else None)); 
            if s.startswith(('Learning','Graph')): break
            continue
        m=re.match(r'^Chapter\s*(\d{1,2})\s*:?\s*(.*?)\s+(\d{1,3})$',s)            # "Chapter 3: Title 16"
        if m: out.append(dict(kind='chapter',n=int(m.group(1)),title=m.group(2).strip(),page=int(m.group(3)))); continue
        m=re.match(r'^Chapter\s*(\d{1,2})$',s)                                      # "Chapter 1" then title line
        if m: pend=int(m.group(1)); continue
        m=re.match(r'^(\d{1,2})\.\s+(.*?)\s+(\d{1,3})$',s)                          # "3. Title 18"
        if m: out.append(dict(kind='chapter',n=int(m.group(1)),title=m.group(2).strip(),page=int(m.group(3)))); pend=None; continue
        m=re.match(r'^(\d{1,2})\.\s+(.*\S)$',s)                                     # "5. Title (wrapped"
        if m: out.append(dict(kind='chapter',n=int(m.group(1)),title=m.group(2).strip(),page=None)); continue
        m=re.match(r'^(.*?)\s+(\d{1,3})$',s)
        if pend is not None and m:
            out.append(dict(kind='chapter',n=pend,title=m.group(1).strip(),page=int(m.group(2)))); pend=None; continue
        if out and out[-1]['kind']=='chapter':
            # wrapped line: either a continuation of the title, or a parenthetical subtitle
            m=re.match(r'^(.*?)\s*(\d{1,3})?$',s)
            out[-1]['title']=(out[-1]['title']+' '+m.group(1).strip()).strip()
            if m.group(2) and out[-1]['page'] is None: out[-1]['page']=int(m.group(2))
            elif m.group(2): out[-1]['page']=out[-1]['page']
            continue
        if s.startswith('Reprint'): break
    return out
records=[];sources=[];findings=[]
def rec(**k): records.append(k)
for code,grade,title,subtitle,part,method in BOOKS:
    ps=code+'ps.pdf'
    srcid=f'ncert_{code}'
    arch=f'books/{code}dd.zip'
    hist=history(code)
    src=dict(sourceId=srcid,grade=grade,authority='NCERT',kind='textbook',title=title,printedSubtitle=subtitle,part=part,
        portalLabel=PORTAL_LABEL[code],portalCode=code,portalUrl=PORTAL+'?'+code+'=0-',
        prelimsUrl=PDF(ps),prelimsSha256=sha(ps),archiveUrl=PDF(code+'dd.zip') if os.path.exists(arch) else None,
        archiveSha256=sha(arch) if os.path.exists(arch) else None,isbn=ed[code]['isbn'],editionHistory=hist,
        currentApplicability='Reprint 2026-27' if 'Reprint 2026-27' in open(code+'ps.txt').read() else f'First Edition {hist[0]["date"]}',
        inspectedOn=INSPECTED,
        identityStatus='primary_source_verified',applicabilityStatus='primary_source_verified',
        contentsPageBasis='prelims PDF contents page')
    sources.append(src)
    if method=='contents_page':
        cj=json.load(open(code+'_contents.json'))
        for x in cj:
            if x['level']=='chapter':
                cid=f'{srcid}_ch{x["chapter"]:02d}'
                rec(recordId=cid,sourceId=srcid,grade=grade,level='chapter',number=str(x['chapter']),title=x['title'],parentId=None,startPage=x['page'],pageBasis='printed page, from contents page',evidence='contents page')
            elif x['level']=='section':
                rec(recordId=f'{srcid}_s{x["chapter"]}_{x["section"]}',sourceId=srcid,grade=grade,level='section',number=f'{x["chapter"]}.{x["section"]}',title=x['title'],parentId=f'{srcid}_ch{x["chapter"]:02d}',startPage=x['page'],pageBasis='printed page, from contents page',evidence='contents page')
            elif x['level']=='subsection':
                rec(recordId=f'{srcid}_s{x["chapter"]}_{x["section"]}_{x["sub"]}',sourceId=srcid,grade=grade,level='subsection',number=f'{x["chapter"]}.{x["section"]}.{x["sub"]}',title=x['title'],parentId=f'{srcid}_s{x["chapter"]}_{x["section"]}',startPage=x['page'],pageBasis='printed page, from contents page',evidence='contents page')
            elif x['level']=='backmatter':
                src.setdefault('backmatter',[]).append(dict(title=x['title'],page=str(x['page'])))
        src['levels']=dict(chapter='primary_source_verified',section='primary_source_verified',
            subsection='primary_source_verified' if code=='jemh1' else 'not_defined_by_source',topic='not_defined_by_source')
        src['levelEvidence']='Chapters, numbered sections (and, for Class 10, two numbered sub-sections) are listed on the contents page of the current prelims PDF. Chapter titles were NOT separately cross-checked against each chapter PDF in this phase.'
        continue
    chs=primary_contents(code)
    chaps=[c for c in chs if c['kind']=='chapter']
    src['backmatter']=[dict(title=c['title'],page=str(c['page']) if c['page'] else None) for c in chs if c['kind']=='backmatter']
    for c in chaps:
        cid=f'{srcid}_ch{c["n"]:02d}'
        ttl=c['title'];desc=None
        if grade<=2:
            m=re.match(r'^(.*\S)\s+(\([^()]*\))$',ttl)
            if m: ttl,desc=m.group(1),m.group(2)[1:-1]
        rec(recordId=cid,sourceId=srcid,grade=grade,level='chapter',number=str(c['n']),title=ttl,descriptor=desc,parentId=None,startPage=c['page'],pageBasis='printed page, from contents page',evidence='contents page; chapter PDF present in full-book archive' if os.path.exists(arch) else 'contents page')
    if method=='contents_only':
        src['levels']=dict(chapter='primary_source_verified',section='not_defined_by_source',subsection='not_defined_by_source',topic='not_defined_by_source')
        src['levelEvidence']=('The contents page lists chapters only. Every chapter PDF in the full-book archive was scanned: none carries a numbered '
            'section heading. Chapters are organised by unnumbered activity headings (for example "Let us Do", "Let us Read"), which are not '
            'source-defined sections and are not counted.')
    else:
        js=json.load(open(code+'_sections.json'))
        chstart={c['n']:c['page'] for c in chaps}
        for ch,cs in js.items():
            ch=int(ch)
            for s in cs:
                page=chstart[ch]+s['pdfPage']-1 if chstart.get(ch) else None
                folio=s.get('printed')
                r=dict(recordId=f'{srcid}_s{ch}_{s["n"]}',sourceId=srcid,grade=grade,level='section',number=f'{ch}.{s["n"]}',title=s['title'],
                    parentId=f'{srcid}_ch{ch:02d}',startPage=page,pageBasis='printed page = chapter start page (contents) + PDF page offset',
                    evidence=f'numbered heading in {code}{ch:02d}.pdf, PDF page {s["pdfPage"]} ({s["method"]})')
                rec(**r)
        src['levels']=dict(chapter='primary_source_verified',section='primary_source_verified',
            subsection='partially_enumerated' if code=='iemh1' else 'not_defined_by_source',topic='not_defined_by_source')
        src['levelEvidence']=('The contents page lists chapters only. Sections were read from the numbered headings (N.M) inside every chapter PDF of '
            'the full-book archive, using heading typography, with gaps re-checked in the page text. Unnumbered sub-headings are not counted as sections.')
        if code=='iemh1':
            src['levelEvidence']+=(' This book also prints numbered sub-sections (N.M.K) in Chapters 3, 6, 7 and 8. They were detected but not fully enumerated '
                '(some numbers, e.g. 3.2.1, 3.4.1, 7.2.1, were not found by text extraction), so the sub-section count is UNKNOWN.')
json.dump(dict(inspectedOn=INSPECTED,sources=sources,records=records),open('master_evidence.json','w'),indent=1,ensure_ascii=False)
from collections import Counter
for s in sources:
    c=Counter(r['level'] for r in records if r['sourceId']==s['sourceId'])
    print(s['sourceId'],s['grade'],s['title'],dict(c))
