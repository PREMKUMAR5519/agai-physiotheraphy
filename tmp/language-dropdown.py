from pathlib import Path
p=Path('src/App.css');s=p.read_text(encoding='utf8');a=s.index('.language-switch {');b=s.index('.article-language-note',a)
s=s[:a]+'''.language-switch { position: relative; flex-shrink: 0; color: #3c4043; font-family: Arial, "Nirmala UI", sans-serif; }
.language-trigger { display: flex; align-items: center; gap: 8px; min-height: 42px; padding: 0 12px; border: 1px solid #dadce0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; list-style: none; white-space: nowrap; }
.language-trigger::-webkit-details-marker { display: none; }
.language-trigger:hover, .language-switch[open] .language-trigger { background: #f8fafd; border-color: #b8c8dd; }
.language-trigger:focus-visible, .language-option:focus-visible { outline: 3px solid #1a73e8; outline-offset: 3px; }
.language-trigger .language-globe { width: 18px; height: 18px; color: #5f6368; }
.language-trigger .language-chevron { width: 16px; height: 16px; transition: transform .15s ease; }
.language-switch[open] .language-chevron { transform: rotate(180deg); }
.language-options { position: absolute; top: calc(100% + 8px); right: 0; z-index: 50; width: 208px; max-width: calc(100vw - 24px); padding: 8px; border: 1px solid #e4e7eb; border-radius: 12px; background: #fff; box-shadow: 0 6px 24px #20334d24, 0 2px 6px #20334d0d; }
.language-options > p { margin: 4px 10px 8px; font-size: 11px; line-height: 1.6; color: #667085; }
.language-option { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 8px 12px; border-radius: 7px; font-size: 14px; line-height: 1.6; color: #3c4043; text-decoration: none; }
.language-option:hover { background: #f1f3f4; }
.language-option.is-selected { color: #1967d2; background: #e8f0fe; font-weight: 600; }
.language-option svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .language-trigger .language-chevron { transition: none; } }
'''+s[b:]
s=s.replace('.site-header .language-switch { font-size: 11px; padding-inline: 5px; }','.site-header .language-trigger { font-size: 12px; padding-inline: 8px; gap: 6px; }')
s=s.replace('.site-header-inner > .language-switch { margin-left: auto; padding-inline: 8px; }','.site-header-inner > .language-switch { margin-left: auto; }')
p.write_text(s,encoding='utf8')
p=Path('tests/tamil.spec.ts');s=p.read_text(encoding='utf8');s=s.replace("await page.locator('.language-switch').click()", "await page.locator('.language-trigger').click()\n  await page.locator('.language-option:not(.is-selected)').click()")
s=s.replace("!link.classList.contains('language-switch')", "!link.classList.contains('language-option')")
p.write_text(s,encoding='utf8')
