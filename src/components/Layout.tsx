import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { clinic, services } from '../content'
import { Arrow, Icon } from './UI'

const brandPath = `${import.meta.env.BASE_URL}brand-kit`
const year = new Date().getFullYear()

export function Header() {
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
        {clinic.phone ? <a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}><Icon name="phone" />{clinic.phone}</a> : <Link to="/contact"><Icon name="phone" />Call us</Link>}
        {clinic.email ? <a href={`mailto:${clinic.email}`}><Icon name="mail" />{clinic.email}</a> : null}
      </div>
      <div className="utility-right"><a href={clinic.mapsUrl} target="_blank" rel="noreferrer"><Icon name="pin" />{clinic.address}</a></div>
    </div></div>
    <header ref={header} className={`site-header${hidden && !menuOpen ? ' is-hidden' : ''}`} onFocusCapture={() => setHidden(false)}><div className="site-header-inner">
      <Link className="agai-site-brand" to="/" aria-label="AGAI Physiotherapy Centre - home" onClick={() => setMenuOpen(false)}>
        <img className="agai-horizontal-logo" src={`${brandPath}/assets/agai-horizontal-800.webp`} srcSet={`${brandPath}/assets/agai-horizontal-800.webp 800w, ${brandPath}/assets/agai-horizontal-1600.webp 1600w`} sizes="(max-width: 1100px) 160px, 200px" width="1589" height="512" alt="AGAI Physiotherapy Centre" />
        <span className="agai-header-brand"><img className="agai-emblem" src={`${brandPath}/assets/agai-emblem-128.webp`} width="64" height="64" alt="" /><span><strong>AGAI</strong><small>Physiotherapy Centre</small></span></span>
      </Link>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d={menuOpen ? 'm6 6 12 12M6 18 18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg></button>
      <div className={`menu-backdrop ${menuOpen ? 'is-open' : ''}`} aria-hidden="true" onClick={closeMenu} />
      <nav ref={navigation} id="main-navigation" className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <div className="mobile-menu-heading"><span className="mobile-menu-brand"><strong>AGAI</strong><small>Physiotherapy Centre</small></span><button type="button" aria-label="Close menu" onClick={closeMenu}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></div>
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About us</NavLink>
        <NavLink to="/services" onClick={() => setMenuOpen(false)}>Our services</NavLink>
        <NavLink to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</NavLink>
        <Link className="founder-nav" to="/about#founder" onClick={() => setMenuOpen(false)}>Meet our founder</Link>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact us</NavLink>
        <Link className="agai-button nav-cta" to="/#appointment" onClick={() => setMenuOpen(false)}>Book appointment <Arrow diagonal /></Link>
      </nav>
    </div></header>
  </>
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-grid agai-container">
    <div className="footer-brand"><Link className="footer-logo" to="/" aria-label="AGAI Physiotherapy Centre - home"><img src={`${brandPath}/assets/agai-horizontal-800.webp`} srcSet={`${brandPath}/assets/agai-horizontal-800.webp 800w, ${brandPath}/assets/agai-horizontal-1600.webp 1600w`} sizes="240px" width="1589" height="512" alt="AGAI Physiotherapy Centre" /></Link><p>Rehab. Recover. Restore. Perform.</p><p>Personalised, evidence-based care for the way you move.</p></div>
    <div><h2>Explore</h2><Link to="/">Home</Link><Link to="/about">About us</Link><Link to="/services">Our services</Link><Link to="/blogs">Blogs</Link><Link to="/about#founder">Meet our founder</Link><Link to="/contact">Contact us</Link></div>
    <div><h2>Our care</h2>{services.filter((_, index) => [0, 2, 4, 6].includes(index)).map(service => <Link key={service.id} to={`/services#${service.id}`}>{service.shortTitle}</Link>)}</div>
    <div><h2>Let’s connect</h2><p>Have a question about care?<br />Start with our contact page.</p>{clinic.phone ? <a href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}>{clinic.phone}</a> : null}{clinic.email ? <a href={`mailto:${clinic.email}`}>{clinic.email}</a> : null}<Link className="footer-contact" to="/contact">Get in touch <Arrow diagonal /></Link></div>
  </div><div className="footer-bottom agai-container"><span>© {year} AGAI Physiotherapy Centre</span><span>Care that moves with you.</span><a href="#top">Back to top ↑</a></div></footer>
}
