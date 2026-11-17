import {chromium} from '@playwright/test'
import {writeFileSync} from 'node:fs'
const browser=await chromium.launch({channel:'msedge',headless:true})
const context=await browser.newContext({viewport:{width:390,height:844}})
const page=await context.newPage(); const out={articles:[]}
const xml=await (await page.request.get('https://www.agaiphysiotherapy.com/blog-sitemap.xml')).text()
for(const [,url] of xml.matchAll(/<loc>(.*?)<\/loc>/g)){
 const response=await page.goto(url,{waitUntil:'networkidle'})
 out.articles.push({url,status:response.status(),...await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,canonical:document.querySelector('link[rel=canonical]')?.href,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash),overflow:document.documentElement.scrollWidth>innerWidth,bodyLength:document.querySelector('.journal-article-body')?.textContent.length}))})
}
await page.goto('https://www.agaiphysiotherapy.com/book-appointment',{waitUntil:'networkidle'})
await page.locator('.appointment-submit').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-780))
await page.waitForTimeout(400)
out.chatOverlap=await page.evaluate(()=>{const input=document.querySelector('.appointment-submit').getBoundingClientRect(),chat=document.querySelector('.care-chat-launcher').getBoundingClientRect();return {input:input.toJSON(),chat:chat.toJSON(),overlap:input.left<chat.right&&input.right>chat.left&&input.top<chat.bottom&&input.bottom>chat.top}})
await page.screenshot({path:'tmp/site-audit/chat-overlap.png'})
const slow=await browser.newContext({viewport:{width:390,height:844}}); const slowPage=await slow.newPage()
await slowPage.route('**/api/public/content',async route=>{await new Promise(r=>setTimeout(r,5000));await route.abort().catch(()=>{})})
const start=Date.now(); await slowPage.goto('https://www.agaiphysiotherapy.com/',{waitUntil:'domcontentloaded'})
await slowPage.getByRole('button',{name:'Open navigation'}).click(); await slowPage.waitForTimeout(300)
out.slowCms={elapsed:Date.now()-start,ariaBusy:await slowPage.locator('#root').getAttribute('aria-busy'),menuOpened:await slowPage.getByRole('button',{name:'Close navigation'}).count()}
await slow.close();await context.close();await browser.close()
writeFileSync('tmp/site-audit/final-checks.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2))
