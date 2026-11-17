import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser=await chromium.launch({channel:'msedge',headless:true})
const context=await browser.newContext({viewport:{width:390,height:844}})
const page=await context.newPage()
const out={}
const axe=await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js').then(r=>r.text())
out.accessibility=[]
for(const path of ['/','/about','/services','/blogs','/book-appointment','/contact']){
 await page.goto('https://www.agaiphysiotherapy.com'+path,{waitUntil:'networkidle'})
 await page.addScriptTag({content:axe})
 out.accessibility.push({path,...await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}})})
}
await page.goto('https://www.agaiphysiotherapy.com/book-appointment',{waitUntil:'networkidle'})
await page.getByLabel('Full name').fill('Audit visitor')
await page.getByLabel('Contact number').fill('abc1234567')
await page.getByRole('combobox',{name:'Service *',exact:true}).click()
await page.getByRole('option',{name:'Not sure yet / help me choose',exact:true}).click()
await page.locator('.appointment-card').getByRole('checkbox').check()
await page.getByRole('button',{name:'Continue choosing date'}).click()
out.invalidPhoneAccepted=await page.locator('.booking-calendar').isVisible()
out.calendarToday=await page.locator('[aria-current="date"]').getAttribute('data-date')
out.morningTimes=await page.locator('.booking-time').allTextContents()
await page.screenshot({path:'tmp/site-audit/mobile-calendar.png',fullPage:true})
await page.goto('https://www.agaiphysiotherapy.com/contact',{waitUntil:'networkidle'})
out.openingHours=await page.locator('.contact-method').filter({hasText:'Opening hours'}).innerText()
out.headers=(await page.request.get('https://www.agaiphysiotherapy.com/')).headers()
out.articleLinks=await (await page.request.get('https://www.agaiphysiotherapy.com/blog-sitemap.xml')).text()
out.robots=await(await page.request.get('https://www.agaiphysiotherapy.com/robots.txt')).text()
out.generic404=(await page.request.get('https://www.agaiphysiotherapy.com/audit-missing-page')).status()
writeFileSync('tmp/site-audit/probes.json',JSON.stringify(out,null,2))
console.log(JSON.stringify(out,null,2))
await browser.close()
