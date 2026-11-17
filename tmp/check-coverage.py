from pathlib import Path
import json,re
D=json.loads(Path('src/tamil.json').read_text(encoding='utf8'));D.update(json.loads(Path('src/tamil-main.json').read_text(encoding='utf8')))
snapshot=json.loads(Path('src/cms-snapshot.json').read_text(encoding='utf8'))['content']
missing=[]
for group in ['services','faqs','approach']:
 for item in snapshot[group]:
  for key,value in item.items():
   if key in ['title','shortTitle','intro','description','forYou','focus','question','answer','text']:
    for v in value if isinstance(value,list) else [value]:
     if v not in D:missing.append(v)
print('Untranslated snapshot content:',missing)
for f in ['HomePage','AboutPage','ServicesPage','BlogsPage']:
 s=Path('src/pages/'+f+'.tsx').read_text(encoding='utf8')
 print(f, [x.strip() for x in re.findall(r'>([^<>{}\n]+)<',s) if re.search('[A-Za-z]{3}',x) and x.strip() not in D])
