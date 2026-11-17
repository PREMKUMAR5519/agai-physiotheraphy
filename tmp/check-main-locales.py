from pathlib import Path
for route in ['ta','ta/about','ta/services','ta/blogs','ta/book-appointment','ta/contact']:
 s=Path('dist/'+route+'.html').read_text(encoding='utf8')
 assert '<html lang="ta">' in s,route
 assert 'hreflang="en"' in s and 'hreflang="ta"' in s,route
 assert 'href="https://www.agaiphysiotherapy.com/'+route+'"' in s,route
 assert '\ufffd' not in s,route
for p in Path('dist/ta/blogs').glob('*.html'):
 s=p.read_text(encoding='utf8');assert 'content="noindex, follow"' in s
print('All six Tamil pages have valid language and alternate metadata; original-language article views remain noindex.')
