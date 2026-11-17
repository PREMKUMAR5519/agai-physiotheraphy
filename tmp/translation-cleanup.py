from pathlib import Path
import json
base=Path('src/tamil.json');main=Path('src/tamil-main.json')
a=json.loads(base.read_text(encoding='utf8'));b=json.loads(main.read_text(encoding='utf8'))
b['Everyday wellbeing']='அன்றாட நலம்';b['Movement goals']='இயக்க இலக்குகள்'
for key in list(b):
 if key in a:a[key]=b.pop(key)
base.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n',encoding='utf8');main.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
p=Path('src/App.tsx');s=p.read_text(encoding='utf8')
s=s.replace('<Eyebrow>404 · Page not found</Eyebrow><h1>Let’s get you<br /><span>back on track.</span></h1><p>This page isn’t here. Explore our care or return to the homepage.</p>', '<Eyebrow>{isTamil ? \'404 · பக்கம் கிடைக்கவில்லை\' : \'404 · Page not found\'}</Eyebrow><h1>{isTamil ? \'முகப்புப் பக்கத்திற்குத் திரும்பலாம்.\' : <>Let’s get you<br /><span>back on track.</span></>}</h1><p>{isTamil ? \'இந்தப் பக்கம் இல்லை. எங்கள் சேவைகளைப் பாருங்கள் அல்லது முகப்புப் பக்கத்திற்குத் திரும்புங்கள்.\' : \'This page isn’t here. Explore our care or return to the homepage.\'}</p>')
s=s.replace('>Back to home <Arrow /></Link>', ">{isTamil ? 'முகப்புக்குத் திரும்புங்கள்' : 'Back to home'} <Arrow /></Link>")
p.write_text(s,encoding='utf8')
