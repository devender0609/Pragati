import sys,json,os,sections
pdf,ch,out=sys.argv[1],int(sys.argv[2]),sys.argv[3]
c=sections.headings(pdf,ch)
json.dump(c,open(out,'w'),ensure_ascii=False)
print(pdf,ch,len(c))
