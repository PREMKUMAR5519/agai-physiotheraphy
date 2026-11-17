from pathlib import Path
import json
p=Path('src/tamil-main.json');d=json.loads(p.read_text(encoding='utf8'))
d['Understand your needs.']='உங்கள் தேவைகளை அறியுங்கள்.'
d['Let’s find your']='உங்கள் அடுத்த படியை'
d['next step.']='அறிந்துகொள்வோம்.'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
s=json.loads(Path('src/cms-snapshot.json').read_text(encoding='utf8'))
print('Article categories:',sorted(set(x['category'] for x in s['articles'])))
