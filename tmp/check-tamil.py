from pathlib import Path
import re,json
p=Path('src/components/UI.tsx');s=p.read_text(encoding='utf8');p.write_text(s.replace('\ufeff',''),encoding='utf8')
for route in ['book-appointment','contact']:
 s=Path('dist/ta/'+route+'.html').read_text(encoding='utf8')
 assert '<html lang="ta">' in s
 assert 'hreflang="en"' in s and 'hreflang="ta"' in s
 assert 'https://www.agaiphysiotherapy.com/ta/'+route in s
 assert '\ufffd' not in s
print('Tamil prerendered HTML: language, canonical/alternate URLs and Unicode checks passed.')
