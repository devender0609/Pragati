import json,sys,sections
code,n=sys.argv[1],int(sys.argv[2])
allc={ch:json.load(open(f'cache/{code}_{ch}.json')) for ch in range(1,n+1)}
size=max((c['size'] for cs in allc.values() for c in cs if c['bold']),default=0)
if size==0:
    # this book sets numbered headings in a regular weight; treat the dominant
    # numbered-line size as the heading size and accept that weight
    from collections import Counter
    cnt=Counter(c['size'] for cs in allc.values() for c in cs)
    size=cnt.most_common(1)[0][0]
    for cs in allc.values():
        for c in cs:
            if abs(c['size']-size)<0.3: c['bold']=True
    print('regular-weight headings at size',size)
res={}
for ch,cs in allc.items():
    p=sections.pick(cs,size); res[ch]=p
    nums=[c['n'] for c in p]
    flag='' if nums==list(range(1,len(nums)+1)) else f' !! {nums}'
    print(f'CH {ch}: {len(p)}{flag}')
    for c in p: print(f"   {ch}.{c['n']} {c['title']!r} pdf p{c['pdfPage']} printed {c['printed']} {c['method']}")
json.dump({str(k):v for k,v in res.items()},open(f'{code}_sections.json','w'),indent=1,ensure_ascii=False)
