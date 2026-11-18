"""Regenerate the website font subset; requires fonttools[woff]."""
import re
import subprocess
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
fonts = root / 'public/brand-kit/fonts'
coverage = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-27BF,U+FE00-FE0F,U+FEFF,U+FFFD'
subprocess.run([
    sys.executable, '-m', 'fontTools.subset', str(fonts / 'InterVariable.woff2'),
    '--output-file=' + str(fonts / 'InterVariable-latin.woff2'),
    '--flavor=woff2', '--unicodes=' + coverage,
], check=True)

# Limit the fallback to glyphs it actually provides. Otherwise emoji can cause
# a full-font download even when the font does not support those characters.
full = TTFont(fonts / 'InterVariable.woff2')
small = TTFont(fonts / 'InterVariable-latin.woff2')
ranges = []
for point in sorted(set(full.getBestCmap()) - set(small.getBestCmap())):
    if ranges and point == ranges[-1][1] + 1:
        ranges[-1][1] = point
    else:
        ranges.append([point, point])
extended = ','.join(f'U+{a:04X}' + (f'-{b:04X}' if a != b else '') for a, b in ranges)
css_path = root / 'public/brand-kit/web/brand.css'
css = css_path.read_text(encoding='utf-8')
for filename, unicode_range in [('InterVariable.woff2', extended), ('InterVariable-latin.woff2', coverage)]:
    pattern = r'(@font-face\{[^}]*' + re.escape(filename) + r'[^}]*;unicode-range:)[^}]+'
    css, count = re.subn(pattern, lambda match: match[1] + unicode_range, css)
    if count != 1:
        raise ValueError(f'Expected one font-face for {filename}')
css_path.write_text(css, encoding='utf-8')
print(f'Website font: {(fonts / "InterVariable-latin.woff2").stat().st_size} bytes')
