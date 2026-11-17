from pathlib import Path
p=Path('src/components/Layout.tsx');s=p.read_text(encoding='utf8');a=s.index('function LanguageSwitch() {')
s=s[:a]+'''function LanguageSwitch() {
  const { pathname, search, hash } = useLocation()
  const isTamil = isTamilPath(pathname)
  return <div className="language-switch" role="group" aria-label={isTamil ? 'மொழியைத் தேர்ந்தெடுங்கள்' : 'Choose language'}>
    {[{ code: 'en', label: 'EN', name: 'English', tamil: false }, { code: 'ta', label: 'த', name: 'தமிழ்', tamil: true }].map(option => <Link key={option.code} className={`language-option${isTamil === option.tamil ? ' is-selected' : ''}`} to={`${languagePath(pathname, option.tamil)}${search}${hash}`} lang={option.code} hrefLang={option.code} aria-label={option.name} aria-current={isTamil === option.tamil ? 'true' : undefined}>
      <span aria-hidden="true">{option.label}</span>
    </Link>)}
  </div>
}
''';p.write_text(s,encoding='utf8')
p=Path('src/App.css');s=p.read_text(encoding='utf8');a=s.index('.language-switch {');b=s.index('.article-language-note',a)
s=s[:a]+'''.language-switch { display: inline-flex; align-items: center; flex-shrink: 0; border: 1.5px solid #999; border-radius: 8px; background: #fff; font-family: Arial, "Nirmala UI", sans-serif; }
.language-option { position: relative; display: grid; place-items: center; width: 47px; min-height: 42px; color: #999; font-size: 23px; font-weight: 400; line-height: 1; text-decoration: none; border-radius: 6px; }
.language-option + .language-option::before { content: ''; position: absolute; left: 0; top: 7px; bottom: 7px; width: 1.5px; border-radius: 2px; background: #999; }
.language-option[lang="ta"] { font-family: "Nirmala UI", "Tamil Sangam MN", Latha, sans-serif; font-size: 26px; }
.language-option.is-selected { color: #075bb6; }
.language-option:hover { background: #f5f8fc; }
.language-option:focus-visible { outline: 3px solid #1a73e8; outline-offset: 3px; }
'''+s[b:];s=s.replace('  .site-header .language-trigger { font-size: 12px; padding-inline: 8px; gap: 6px; }\n','');p.write_text(s,encoding='utf8')
p=Path('tests/tamil.spec.ts');s=p.read_text(encoding='utf8');s=s.replace("  await page.locator('.language-trigger').click()\n",'')
a=s.index("test('English header still fits");b=s.index("test('each page switches",a);part=s[a:b]
part=part.replace("    await expect(page.locator('.language-options')).toBeVisible()\n",'').replace("    await page.locator('.language-trigger').press('Escape')\n",'').replace("    await expect(page.locator('.language-options')).not.toBeVisible()\n",'').replace('language-dropdown-mobile.png','language-toggle-mobile.png')
s=s[:a]+part+s[b:];p.write_text(s,encoding='utf8')
