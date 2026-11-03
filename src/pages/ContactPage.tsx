import PageIntro from '../components/PageIntro'
import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { clinic, services } from '../content'
import { Arrow, Eyebrow, FAQ, Icon } from '../components/UI'
import type { IconName } from '../components/UI'

function ContactMethod({ icon, title, value, pending, href }: { icon: IconName; title: string; value: string; pending: string; href?: string }) {
  return <div className="contact-method"><span className="contact-icon"><Icon name={icon} /></span><div><h3>{title}</h3>{value && href ? <a href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noreferrer' : undefined}>{value}<Arrow diagonal /></a> : <p>{value || pending}</p>}</div></div>
}

export default function ContactPage() {
  const [params] = useSearchParams()
  const requestedService = params.get('service')
  const [draft, setDraft] = useState('')
  const [feedback, setFeedback] = useState('')
  const [formError, setFormError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const phoneInput = useRef<HTMLInputElement>(null)
  const draftHeading = useRef<HTMLHeadingElement>(null)
  const hasDelivery = Boolean(clinic.email || clinic.whatsapp)
  const phoneLink = clinic.phone ? `tel:${clinic.phone.replace(/[^+\d]/g, '')}` : undefined
  const whatsappLink = clinic.whatsapp ? `https://wa.me/${clinic.whatsapp.replace(/\D/g, '')}` : undefined

  function prepareEnquiry(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const message = String(data.get('message') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const phoneDigits = phone.replace(/\D/g, '')
    if (!/^\+?[\d\s().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setPhoneError('Enter a phone number with 7–15 digits. Spaces, brackets, hyphens and a leading + are allowed.')
      phoneInput.current?.focus()
      return
    }
    setPhoneError('')
    if (!name || message.length < 10) {
      setFormError('Please enter your name and a message of at least 10 characters, excluding extra spaces.')
      return
    }
    setFormError('')
    const service = services.find(item => item.id === requestedService)?.title || 'General enquiry'
    const text = [`Enquiry for ${clinic.name}`, '', `Name: ${name}`, `Email: ${String(data.get('email') || '').trim() || 'Not provided'}`, `Phone: ${phone}`, `Service: ${service}`, '', message].join('\n')
    setDraft(text)
    setFeedback('')
    requestAnimationFrame(() => { draftHeading.current?.focus(); draftHeading.current?.scrollIntoView({ block: 'center', behavior: 'instant' }) })
  }

  async function copyDraft() {
    try { await navigator.clipboard.writeText(draft); setFeedback('Enquiry copied. It has not been sent to the centre.') }
    catch { setFeedback('Copy is unavailable in this browser. Select the draft text to copy it, or use Download draft.') }
  }
  function downloadDraft() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'agai-enquiry.txt'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setFeedback('Draft downloaded. It has not been sent to the centre.')
  }

  return <>
    <PageIntro label="Contact us" lead="Every next step starts" accent="with a conversation." description="A question about rehabilitation, a service or your next appointment? We're here to help you find your way forward." />
    <section className="section agai-container contact-layout" aria-label="Contact and enquiry details">
      <div className="contact-information"><Eyebrow>Reach the centre</Eyebrow><h2>Let’s talk about<br /><span>your movement.</span></h2><p>Use the centre’s contact details below, or prepare a short enquiry with the service you’re interested in.</p>
        <div className="contact-methods"><ContactMethod icon="phone" title="Call the centre" value={clinic.phone} pending="Phone number will be available soon." href={phoneLink} /><ContactMethod icon="chat" title="WhatsApp" value={clinic.whatsapp} pending="WhatsApp contact will be available soon." href={whatsappLink} /><ContactMethod icon="mail" title="Email us" value={clinic.email} pending="Email address will be available soon." href={clinic.email ? `mailto:${clinic.email}` : undefined} /><ContactMethod icon="clock" title="Opening hours" value={clinic.hours} pending="Clinic hours will be available soon." /></div>
      </div>
      <div className="enquiry-card"><Eyebrow>Your enquiry</Eyebrow><h2>How can we help?</h2><p>{hasDelivery ? 'Prepare your message, then choose email or WhatsApp to send it from your own app.' : 'Online enquiry delivery is not available yet. You can prepare and save a draft below; it will not be sent to the centre.'}</p>
        <form onSubmit={prepareEnquiry} onChange={() => { if (draft) setDraft(''); setFeedback(''); setFormError(''); setPhoneError('') }}>
          <div className="form-grid"><label className="agai-field" htmlFor="enquiry-name">Your name <span className="required-label">(required)</span><input id="enquiry-name" className="agai-input" name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label><label className="agai-field" htmlFor="enquiry-email">Email address <span className="required-label">(optional)</span><input id="enquiry-email" className="agai-input" name="email" type="email" autoComplete="email" maxLength={200} placeholder="you@example.com" /></label></div>
          <label className="agai-field" htmlFor="enquiry-phone">Phone number <span className="required-label">(required)</span><input ref={phoneInput} id="enquiry-phone" className="agai-input" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="Include country code" aria-invalid={phoneError ? true : undefined} aria-describedby={phoneError ? 'enquiry-phone-error' : undefined} /></label>
          {phoneError ? <p id="enquiry-phone-error" className="form-error" role="alert">{phoneError}</p> : null}
          <label className="agai-field" htmlFor="enquiry-message">Your message <span className="required-label">(required)</span><textarea id="enquiry-message" className="agai-input" name="message" rows={4} required minLength={10} maxLength={1500} aria-describedby="message-help" placeholder="Let us know your question or preferred appointment day." /></label><p className="form-help" id="message-help">10–1,500 characters. A general question is enough; you don’t need to include medical records.</p>
          {formError ? <p className="form-error" role="alert">{formError}</p> : null}
          <button className="agai-button prepare-button" type="submit">Submit enquiry <Arrow /></button><p className="form-privacy">Your draft stays in this tab until you choose to copy, download or open a contact app.</p>
        </form>
        {draft ? <section className="draft-preview" aria-labelledby="draft-heading"><h3 id="draft-heading" tabIndex={-1} ref={draftHeading}>Your draft is ready.</h3><p>This is a draft, not a sent enquiry or a confirmed appointment.</p><label className="visually-hidden" htmlFor="enquiry-draft">Enquiry draft</label><textarea id="enquiry-draft" readOnly value={draft} rows={10} className="agai-input" /><div className="draft-actions">{clinic.email ? <a className="agai-button" href={`mailto:${clinic.email}?subject=${encodeURIComponent('Physiotherapy enquiry')}&body=${encodeURIComponent(draft)}`}>Open email <Arrow /></a> : null}{whatsappLink ? <a className="agai-button" href={`${whatsappLink}?text=${encodeURIComponent(draft)}`} target="_blank" rel="noreferrer">Open WhatsApp <Arrow /></a> : null}<button className="agai-button agai-button--secondary" type="button" onClick={copyDraft}>Copy draft</button><button className="text-action" type="button" onClick={downloadDraft}>Download draft ↓</button></div><p role="status" className="copy-feedback">{feedback}</p></section> : null}
      </div>
    </section>
    <section className="visit-section"><div className="agai-container visit-layout"><div className="location-visual"><iframe src={clinic.mapsEmbedUrl} title="AGAI Physiotherapy Centre location on Google Maps" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div><div><Eyebrow>Visit the centre</Eyebrow><h2 className="home-section-title"><span className="home-title-lead">A place to focus</span><br /><span>on your recovery.</span></h2><p>{clinic.address || 'Our clinic address and directions will be published here once available.'}</p>{clinic.mapsUrl ? <a className="agai-button" href={clinic.mapsUrl} target="_blank" rel="noreferrer">Get directions <Arrow diagonal /></a> : <span className="availability-note"><Icon name="pin" />Location details coming soon</span>}</div></div></section>
    <section className="faq-section section home-faq" aria-labelledby="contact-faq-heading"><div className="agai-container faq-layout">
      <div className="home-faq-intro">
        <div><Eyebrow>Before you reach out</Eyebrow><h2 id="contact-faq-heading" className="home-section-title"><span className="home-title-lead">A few helpful</span><br /><span>answers.</span></h2></div>
        <div className="faq-contact-card"><h3>Not sure where to start?</h3><p>Explore our care to find the right next step for you.</p><Link className="faq-contact-button" to="/services">Explore our services <Arrow diagonal /></Link></div>
      </div><FAQ numbered items={[
      { question: 'Does preparing an enquiry book an appointment?', answer: 'No. Preparing an enquiry creates a message draft only. If email or WhatsApp contact is available, send the draft from your own app. An appointment is confirmed only after you hear back from the centre.' },
      { question: 'What should I include in my message?', answer: 'Your name, a way to contact you, the service you are interested in and a brief question or preferred appointment day are a useful starting point.' },
      { question: 'Can I enquire without choosing a service?', answer: 'Yes. Simply explain what you would like help with in your message. You do not need to choose a service before getting in touch.' },
    ]} /></div></section>
  </>
}
