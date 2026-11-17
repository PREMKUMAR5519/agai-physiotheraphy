import { useLanguage } from '../language'
import { useState } from 'react'
import { Link } from 'react-router'
import { careNeeds, clinic } from '../content'
import { useServices } from '../ServicesContext'
import { Arrow, Icon } from './UI'
import './CareNeedsSection.css'

const pathways = [
  { category: 'Spine & joints', tags: ['Spine & joints', 'Everyday comfort'], focus: 'Support for comfortable movement in everyday life.', keywords: 'back neck joint pain stiffness', image: '01-pain-and-stiffness' },
  { category: 'Injury & surgery', tags: ['Recovery', 'Movement & strength'], focus: 'Rebuilding movement and strength during recovery.', keywords: 'injury surgery rehabilitation recovery', image: '02-injury-and-rehabilitation' },
  { category: 'Sport & exercise', tags: ['Return to sport', 'Active living'], focus: 'A gradual return to the activities you enjoy.', keywords: 'sport athlete running exercise training', image: '03-return-to-sport' },
  { category: 'Women’s health', tags: ['Women’s health', 'Pregnancy & beyond'], focus: 'Movement and exercise support through different life stages.', keywords: 'pregnancy maternal women postpartum fitness', image: '04-pregnancy-and-womens-health' },
  { category: 'Walking & balance', tags: ['Balance', 'Healthy ageing'], focus: 'Support with walking, balance and everyday movement.', keywords: 'walking balance older adults ageing mobility', image: '05-walking-and-balance' },
  { category: 'Neurological care', tags: ['Coordination', 'Daily activities'], focus: 'Working towards your movement and daily activity goals.', keywords: 'stroke neurological coordination movement', image: '06-stroke-and-movement-recovery' },
] as const

export default function CareNeedsSection() {
  const { t, isTamil, localPath } = useLanguage()
  const { services } = useServices()
  const [category, setCategory] = useState('All care paths')
  const [query, setQuery] = useState('')
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const visible = careNeeds.map((need, index) => ({ ...need, ...pathways[index], index }))
    .filter(need => (category === 'All care paths' || need.category === category) && words.every(word => `${t(need.title)} ${t(need.description)} ${need.keywords} ${need.tags.join(' ')}`.toLowerCase().includes(word)))

  return <section className="section care-needs-section" id="when-to-visit" tabIndex={-1} aria-labelledby="care-needs-heading"><div className="agai-container">
    <div className="care-path-heading">
      <div><p className="care-path-eyebrow"><span />{t("WHEN TO VISIT")}</p><h2 id="care-needs-heading">{t("Does this sound")} <span>{t("familiar?")}</span></h2><p className="care-path-intro">{t("Physiotherapy may help when pain or difficulty moving gets in the way of your day. An assessment helps us understand your needs and discuss the right next step.")}</p></div>
      <aside className="care-path-note"><Icon name="person" /><div><strong>{t("Care built around you")}</strong><p>{t("Start with a conversation about your movement, your comfort and what matters to you.")}</p><span>{t("Understand your needs. Find your next step.")}</span></div></aside>
    </div>
    <form className="care-path-search" role="search" aria-label={t("Find a care path")} onSubmit={event => { event.preventDefault(); document.getElementById('care-path-results')?.focus({ preventScroll: true }) }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
      <label className="visually-hidden" htmlFor="care-path-query">{t("Search care paths")}</label><input id="care-path-query" type="search" placeholder={t("Search your concern, e.g. back pain, pregnancy or balance…")} value={query} onChange={event => setQuery(event.target.value)} />
      <button type="submit">{t("Find care")} <Arrow /></button>
    </form>
    <div className="care-path-filters" role="group" aria-label={t("Filter care paths")}>{['All care paths', ...pathways.map(path => path.category)].map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{t(value)}</button>)}</div>
    <p id="care-path-results" className="care-path-count" role="status" tabIndex={-1}>{isTamil ? `${visible.length} ${visible.length === 1 ? 'சேவை வகை' : 'சேவை வகைகள்'}${query.trim() ? ` — “${query.trim()}”` : ''}` : <>{visible.length} care {visible.length === 1 ? 'path' : 'paths'}{query.trim() ? ` for “${query.trim()}”` : ' to explore'}</>}</p>
    <div className="care-needs-grid">{visible.map(need => {
      const service = services.find(service => service.id === need.serviceId)
      return <Link className="care-need" key={need.image} to={localPath(service ? `/services#${need.serviceId}` : '/contact')}>
        <div className="care-need-top"><span className="care-need-icon"><img src={`/images/care-symbols/${need.image}.svg`} alt="" width="64" height="64" loading="lazy" /></span><div className="care-need-tags">{need.tags.map(tag => <span key={tag}>{t(tag)}</span>)}</div></div>
        <h3>{t(need.title)}</h3><p className="care-need-description">{t(need.description)}</p>
        <div className="care-need-focus"><span>{t("CARE FOCUS")}</span><p>{t(need.focus)}</p></div>
        <ul className="care-need-topics">{service?.focus.slice(0, 2).map(focus => <li key={focus}>{t(focus)}</li>)}</ul>
        <span className="care-need-link"><span>{t(service ? need.linkLabel : 'Ask us about this care')} <Arrow /></span><span className="care-need-number">{isTamil ? 'வகை' : 'Path'} {String(need.index + 1).padStart(2, '0')}</span></span>
      </Link>
    })}</div>
    {!visible.length && <div className="care-path-empty"><Icon name="chat" /><h3>{t("Let’s find your next step.")}</h3><p>{t("Try a different phrase or explore all care paths.")}</p><button type="button" onClick={() => { setQuery(''); setCategory('All care paths') }}>{t("Show all care paths")} <Arrow /></button></div>}
    <div className="care-path-principles">{[{ icon: 'chat', title: 'Start with a conversation', text: 'Tell us what feels difficult' }, { icon: 'activity', title: 'Focus on your movement', text: 'Explore your needs and goals' }, { icon: 'person', title: 'Find your next step', text: 'Discuss care suited to you' }].map(item => <div key={item.title}><span><Icon name={item.icon as 'chat' | 'activity' | 'person'} /></span><div><strong>{t(item.title)}</strong><p>{t(item.text)}</p></div></div>)}</div>
    <div className="care-needs-footer"><div><p className="care-path-eyebrow">{t("LET’S TALK ABOUT YOUR NEEDS")}</p><h3>{t("Not sure which service you need?")}</h3><p>{t("You don’t need to have it all figured out. Tell us what you are finding difficult, and we’ll help you explore the next step.")}</p></div><div className="care-path-actions"><Link className="agai-button" to={localPath("/#appointment")}>{t("Start with an assessment")} <Arrow /></Link><a className="care-path-contact" href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent('Hello AGAI, I am not sure which physiotherapy service I need. Could you please guide me?')}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" />{t("Talk to us")}</a></div></div>
  </div></section>
}
