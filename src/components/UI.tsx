import type { ReactNode } from 'react'
import { Link } from 'react-router'

const paths = {
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  strength: 'M6 8v8m-3-6v4m15-6v8m3-6v4M6 12h12',
  joint: 'm8 3 3 5-3 5 5 8m3-18-3 5 3 5-5 8M8 13h8',
  brain: 'M12 6C8 1 4 5 5 9c-5 3-2 9 2 9 0 4 5 4 5 0V6Zm0 0c4-5 8-1 7 3 5 3 2 9-2 9 0 4-5 4-5 0M7 10l2 2m8-2-2 2M8 16l2-1m6 1-2-1',
  leaf: 'M5 19C-1 8 8 3 21 3c0 13-5 20-16 16Zm0 0L16 8',
  flower: 'M12 12C2 12 3 3 7 4c3 0 5 5 5 8Zm0 0c0-10 9-9 8-5 0 3-5 5-8 5Zm0 0c10 0 9 9 5 8-3 0-5-5-5-8Zm0 0c0 10-9 9-8 5 0-3 5-5 8-5Z',
  person: 'M9 5a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 12l7-2 7 2m-7-2v6m0 0-5 6m5-6 5 6',
  phone: 'm5 3 4 4-2 3c2 3 4 5 7 7l3-2 4 4c-1 5-6 2-10-1S1 6 5 3Z',
  mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  pin: 'M20 9c0 6-8 12-8 12S4 15 4 9a8 8 0 1 1 16 0ZM9 9a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  clock: 'M12 7v5l3 2M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0',
  check: 'm5 12 4 4L19 6',
  shield: 'm12 3 7 3v6c0 4-7 8-7 8s-7-4-7-8V6l7-3Zm-4 9 3 3 5-6',
  chat: 'M4 4h16v12H9l-5 4V4Zm4 5h8m-8 3h5',
}
export type IconName = keyof typeof paths
export function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} /></svg>
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}
export function Breadcrumb({ current }: { current: string }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{current}</span></nav>
}
export function ContactBanner() {
  return <section className="contact-banner"><div className="contact-banner-inner agai-container"><div><Eyebrow>Your next step</Eyebrow><h2 className="home-section-title"><span className="home-title-lead">Let’s make movement</span><br /><span>part of your story.</span></h2><p>Explore care that starts with you and your goals.</p></div><Link className="agai-button" to="/contact">Get in touch <Arrow /></Link></div></section>
}
export function FAQ({ items, numbered = false }: { items: { question: string; answer: string }[]; numbered?: boolean }) {
  return <div className={`faq-list${numbered ? ' faq-list--numbered' : ''}`}>{items.map((item, index) => <details key={item.question}>
    <summary>
      {numbered ? <><span className="faq-number" aria-hidden="true">{index + 1}.</span><span>{item.question}</span><svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg></> : <>{item.question}<span className="faq-plus" aria-hidden="true">+</span></>}
    </summary>
    <p>{item.answer}</p>
  </details>)}</div>
}
