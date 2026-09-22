import pymupdf,sys,re
doc=pymupdf.open(sys.argv[1]); mn=float(sys.argv[2]) if len(sys.argv)>2 else 13
for pno,page in enumerate(doc):
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines',[]):
            sp=l['spans']; t=re.sub(r'[\x00-\x1f]',' ',''.join(s['text'] for s in sp)).strip()
            if not t: continue
            s=max(sp,key=lambda s:s['size'])
            if s['size']>=mn and ('Bold' in s['font'] or s['flags']&16):
                print(pno+1, round(s['size'],1), s['font'][:22], repr(t[:70]))
