"""Compact page digest of one chapter PDF: printed page number, headings and
the first lines of each page. Enough to judge what mathematics a page
teaches without pulling the whole book into the reply."""
import sys,re,pymupdf
pdf=sys.argv[1]; maxchars=int(sys.argv[2]) if len(sys.argv)>2 else 320
doc=pymupdf.open(pdf)
for pno,page in enumerate(doc):
    d=page.get_text('dict'); H=page.rect.height
    folio=None; heads=[]; body=[]
    for b in d['blocks']:
        for l in b.get('lines',[]):
            sp=l['spans']; t=re.sub(r'\s+',' ',''.join(s['text'] for s in sp)).strip()
            if not t: continue
            big=max(sp,key=lambda s:s['size'])
            if re.fullmatch(r'\d{1,3}',t) and l['bbox'][1]>0.85*H: folio=int(t); continue
            if big['size']>=13 and ('Bold' in big['font'] or big['flags']&16): heads.append(t)
            else: body.append(t)
    txt=' '.join(body)[:maxchars]
    print(f"p{pno+1}|{folio}| HEAD: {' // '.join(heads[:6])}")
    print(f"   {txt}")
