import { isTamilPath, languagePath } from '../locale-paths'
import { useLanguage } from '../language'
import { useServices } from '../ServicesContext'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { clinic } from '../content'
import { Arrow, Icon } from './UI'

const brandPath = `${import.meta.env.BASE_URL}brand-kit`
const year = new Date().getFullYear()

export function Header() {
  const { t, localPath } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const header = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const navigation = useRef<HTMLElement>(null)
  useEffect(() => {
    let previousY = window.scrollY
    let travel = 0
    function handleScroll() {
      // Clamp overscroll so bouncing at either end does not reverse the navbar.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const currentY = Math.max(0, Math.min(window.scrollY, maxY))
      const delta = currentY - previousY
      previousY = currentY
      if (menuOpen || currentY <= (header.current?.offsetHeight ?? 80)) {
        travel = 0
        setHidden(false)
        return
      }
      if (delta === 0) return
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta
      // Ignore small touch/trackpad movements to avoid flickering.
      if (Math.abs(travel) >= 8) {
        setHidden(travel > 0)
        travel = 0
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])
  function closeMenu() {
    setMenuOpen(false)
    menuButton.current?.focus()
  }
  useEffect(() => {
    if (!menuOpen) return
    const media = window.matchMedia('(max-width: 767px)')
    if (!media.matches) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = [...document.querySelectorAll<HTMLElement>('#main, .site-footer, .care-chat')]
    const previousInert = background.map(element => element.inert)
    background.forEach(element => { element.inert = true })
    navigation.current?.querySelector<HTMLButtonElement>('button')?.focus()
    function handleKeys(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return }
      if (event.key !== 'Tab') return
      const items = navigation.current?.querySelectorAll<HTMLElement>('a[href], button')
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    function handleResize() { if (!media.matches) setMenuOpen(false) }
    document.addEventListener('keydown', handleKeys)
    media.addEventListener('change', handleResize)
    return () => {
      document.body.style.overflow = overflow
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.removeEventListener('keydown', handleKeys)
      media.removeEventListener('change', handleResize)
    }
  }, [menuOpen])
  return <>
    <div className="utility-bar"><div className="utility-bar-inner">
      <div className="utility-left">
        {clinic.phone ? <a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}><Icon name="phone" />{clinic.phone}</a> : <Link to={localPath("/contact")}><Icon name="phone" />{t("Call us")}</Link>}
        {clinic.email ? <a href={`mailto:${clinic.email}`}><Icon name="mail" />{clinic.email}</a> : null}
      </div>
      <div className="utility-right"><a href={clinic.mapsUrl} target="_blank" rel="noreferrer"><Icon name="pin" />{clinic.address}</a></div>
    </div></div>
    <header ref={header} className={`site-header${hidden && !menuOpen ? ' is-hidden' : ''}`} onFocusCapture={() => setHidden(false)}><div className="site-header-inner">
      <Link className="agai-site-brand" to={localPath("/")} aria-label="AGAI Physiotherapy Centre - home" onClick={() => setMenuOpen(false)}>
        <img className="agai-horizontal-logo" src={`${brandPath}/assets/agai-horizontal-800.webp`} srcSet={`${brandPath}/assets/agai-horizontal-800.webp 800w, ${brandPath}/assets/agai-horizontal-1600.webp 1600w`} sizes="(max-width: 1100px) 160px, 200px" width="1589" height="512" alt="AGAI Physiotherapy Centre" />
        <span className="agai-header-brand"><img className="agai-emblem" src={`${brandPath}/assets/agai-emblem-128.webp`} width="64" height="64" alt="" /><span><strong>AGAI</strong><small>Physiotherapy Centre</small></span></span>
      </Link>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? t('Close navigation') : t('Open navigation')} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={menuOpen ? 'm6 6 12 12M6 18 18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg></button>
      <div className={`menu-backdrop ${menuOpen ? 'is-open' : ''}`} aria-hidden="true" onClick={closeMenu} />
      <nav ref={navigation} id="main-navigation" className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label={t("Main navigation")}>
        <div className="mobile-menu-heading"><span className="mobile-menu-brand"><strong>AGAI</strong><small>Physiotherapy Centre</small></span><button type="button" aria-label={t("Close menu")} onClick={closeMenu}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
        <NavLink to={localPath("/")} end onClick={() => setMenuOpen(false)}>{t("Home")}</NavLink>
        <NavLink to={localPath("/about")} onClick={() => setMenuOpen(false)}>{t("About us")}</NavLink>
        <NavLink to={localPath("/services")} onClick={() => setMenuOpen(false)}>{t("Our services")}</NavLink>
        <NavLink to={localPath("/blogs")} onClick={() => setMenuOpen(false)}>{t("Blogs")}</NavLink>
        <Link className="founder-nav" to={localPath("/about#founder")} onClick={() => setMenuOpen(false)}>{t("Meet our founder")}</Link>
        <NavLink to={localPath("/contact")} onClick={() => setMenuOpen(false)}>{t("Contact us")}</NavLink>
        <Link className="agai-button nav-cta" to={localPath("/#appointment")} onClick={() => setMenuOpen(false)}>{t("Book appointment")} <Arrow diagonal /></Link>
      </nav>
      <LanguageSwitch />
    </div></header>
  </>
}

export function Footer() {
  const { t, localPath } = useLanguage()
  const { services } = useServices()
  return <footer className="site-footer"><div className="footer-grid agai-container">
    <div className="footer-brand"><Link className="footer-logo" to={localPath("/")} aria-label="AGAI Physiotherapy Centre - home"><img src={`${brandPath}/assets/agai-horizontal-800.webp`} srcSet={`${brandPath}/assets/agai-horizontal-800.webp 800w, ${brandPath}/assets/agai-horizontal-1600.webp 1600w`} sizes="240px" width="1589" height="512" alt="AGAI Physiotherapy Centre" /></Link><p>{t("Rehab. Recover. Restore. Perform.")}</p><p>{t("Personalised, evidence-based care for the way you move.")}</p></div>
    <div><h2>{t("Explore")}</h2><Link to={localPath("/")}>{t("Home")}</Link><Link to={localPath("/about")}>{t("About us")}</Link><Link to={localPath("/services")}>{t("Our services")}</Link><Link to={localPath("/blogs")}>{t("Blogs")}</Link><Link to={localPath("/about#founder")}>{t("Meet our founder")}</Link><Link to={localPath("/book-appointment")}>{t("Book appointment")}</Link><Link to={localPath("/contact")}>{t("Contact us")}</Link></div>
    <div><h2>{t("Our care")}</h2>{services.filter((_, index) => [0, 2, 4, 6].includes(index)).map(service => <Link key={service.id} to={localPath(`/services#${service.id}`)}>{t(service.shortTitle)}</Link>)}</div>
    <div><h2>{t("Let’s connect")}</h2><p>{t("Have a question about care?")}<br />{t("Start with our contact page.")}</p>{clinic.phone ? <a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}>{clinic.phone}</a> : null}{clinic.email ? <a href={`mailto:${clinic.email}`}>{clinic.email}</a> : null}<Link className="footer-contact" to={localPath("/contact")}>{t("Get in touch")} <Arrow diagonal /></Link></div>
  </div><div className="footer-bottom agai-container"><span>© {year} AGAI Physiotherapy Centre</span><span>{t("Care that moves with you.")}</span><a href="#top">{t("Back to top ↑")}</a></div></footer>
}

function LanguageSwitch() {
  const { pathname, search, hash } = useLocation()
  const isTamil = isTamilPath(pathname)
  return <Link className="language-switch" to={`${languagePath(pathname, !isTamil)}${search}${hash}`} hrefLang={isTamil ? 'en' : 'ta'} aria-label={isTamil ? 'Switch to English' : 'தமிழுக்கு மாற்று'} title={isTamil ? 'Switch to English' : 'Switch to Tamil'}>
    {[{ code: 'en', label: 'EN', tamil: false }, { code: 'ta', label: 'த', tamil: true }].map(option => <span key={option.code} className={`language-option${isTamil === option.tamil ? ' is-selected' : ''}`} lang={option.code} aria-hidden="true">
      <span aria-hidden="true">{option.label}</span>
    </span>)}
  </Link>
}
