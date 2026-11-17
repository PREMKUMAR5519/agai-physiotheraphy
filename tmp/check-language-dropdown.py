from pathlib import Path
p=Path('tests/tamil.spec.ts');s=p.read_text(encoding='utf8');start=s.index("test('English header still fits");end=s.index("test('each page switches",start)
part=s[start:end];needle="    await expect(page.locator('.language-switch')).toBeVisible()"
part=part.replace(needle,needle+"\n    await page.locator('.language-trigger').click()\n    await expect(page.locator('.language-options')).toBeVisible()\n    if (width === 390) await page.screenshot({ path: 'tmp/language-dropdown-mobile.png' })\n    await page.locator('.language-trigger').press('Escape')\n    await expect(page.locator('.language-options')).not.toBeVisible()")
s=s[:start]+part+s[end:];p.write_text(s,encoding='utf8')
