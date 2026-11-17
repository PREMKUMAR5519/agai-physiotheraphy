import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const browser = await chromium.launch({channel:'msedge',headless:true})
const results=[]
for(const width of [390,1440]) {
 const context=await browser.newContext({viewport:{width,height:844}})
 const page=await context.newPage()
 for(const path of ['/','/about','/services','/blogs','/book-appointment','/contact','/blogs/audit-missing-page']) {
  const errors=[], failed=[]; const onError=e=>errors.push(e.message); const onResponse=r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})}
  page.on('pageerror',onError);page.on('response',onResponse)
  const response=await page.goto('https://www.agaiphysiotherapy.com'+path,{waitUntil:'networkidle'})
  const info=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),sections:[...document.querySelectorAll('main section')].map(e=>({class:e.className,bg:getComputedStyle(e).backgroundColor})),api:performance.getEntriesByType('resource').filter(r=>r.name.includes('/api/')).map(r=>({url:r.name,duration:r.duration})),smallInputs:[...document.querySelectorAll('input,textarea')].map(e=>({id:e.id,font:getComputedStyle(e).fontSize})),links:[...document.querySelectorAll('a')].filter(a=>/privacy|book appointment/i.test(a.textContent)).map(a=>({text:a.textContent,url:a.href}))}))
  await page.screenshot({path:`tmp/site-audit/${width}-${path.replaceAll('/','_')||'home'}.png`,fullPage:true})
  results.push({width,path,status:response.status(),headers:response.headers(),...info,errors,failed})
  page.off('pageerror',onError);page.off('response',onResponse)
 }
 await context.close()
}
writeFileSync('tmp/site-audit/results.json',JSON.stringify(results,null,2))
console.log(JSON.stringify(results.map(({headers,sections,links,smallInputs,...r})=>r),null,2))
await browser.close()
