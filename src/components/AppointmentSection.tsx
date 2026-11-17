import { clearValidation, useLanguage } from '../language'
import { useServices } from '../ServicesContext'
import { useEffect, useRef, useState } from 'react'
import { isValidPhone } from '../phone'
import { clinicToday, isPastAppointmentTime } from '../appointment-time'
import { createFormTracker } from '../form-analytics'
import type { SubmitEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { clinic, founderContent } from '../content'
import { Arrow, Icon } from './UI'
import ServiceSelect from './ServiceSelect'
import './AppointmentIntro.css'

const steps = ['Details', 'Select date']
const timeGroups = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
  Evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'],
}
type TimePeriod = keyof typeof timeGroups
const timePeriods = Object.keys(timeGroups) as TimePeriod[]
function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function AppointmentSection() {
  const { t, isTamil, locale, localizeValidation } = useLanguage()
  function dateLabel(value: string) {
    return value ? new Date(`${value}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : (isTamil ? 'தேதியைத் தேர்ந்தெடுக்க உதவி தேவை' : 'Flexible — help me choose')
  }

  const { services } = useServices()
  const [params] = useSearchParams()
  const location = useLocation()
  const [track] = useState(() => createFormTracker(location.pathname.endsWith('/book-appointment') ? 'booking_page' : 'home'))
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(() => ({ service: params.get('service') || '', date: '', time: 'Flexible', name: '', phone: '', email: '', notes: '', consent: false }))
  const [error, setError] = useState('')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('Morning')
  const [now, setNow] = useState(() => new Date())
  const [month, setMonth] = useState(() => {
    const today = clinicToday(new Date())
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  useEffect(() => {
    const refresh = () => setNow(new Date())
    const timer = window.setInterval(refresh, 30_000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const today = clinicToday(now)
  const minDate = dateValue(today)
  const maxDate = dateValue(new Date(today.getFullYear(), today.getMonth() + 2, 0))
  const days = Array.from({ length: Math.ceil((month.getDay() + new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()) / 7) * 7 }, (_, index) => {
    const day = new Date(month.getFullYear(), month.getMonth(), index - month.getDay() + 1)
    return { value: dateValue(day), day, label: day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), outside: day.getMonth() !== month.getMonth() }
  })
  const selectedService = services.find(service => service.id === values.service)
  const request = isTamil
    ? `${clinic.name} — சந்திப்புக்கான கோரிக்கை\n\nபெயர்: ${values.name.trim()}\nதொலைபேசி: ${values.phone.trim()}\nமின்னஞ்சல்: ${values.email.trim() || 'வழங்கப்படவில்லை'}\nசேவை: ${selectedService ? t(selectedService.shortTitle) : 'சேவையைத் தேர்ந்தெடுக்க உதவி தேவை'}\nவிருப்பமான நாள்: ${dateLabel(values.date)}\nவிருப்பமான நேரம்: ${values.time === 'Flexible' ? 'எந்த நேரமும் ஏற்றது' : values.time}${values.notes.trim() ? `\nகுறிப்பு: ${values.notes.trim()}` : ''}\n\nஎனது சந்திப்பை ஏற்பாடு செய்வதற்காக மையம் என்னைத் தொடர்புகொள்ள ஒப்புக்கொள்கிறேன். கிடைக்கும் சந்திப்பு நேரத்தை உறுதிப்படுத்துங்கள்.`
    : `Appointment request for ${clinic.name}\n\nName: ${values.name.trim()}\nPhone: ${values.phone.trim()}\nEmail: ${values.email.trim() || 'Not provided'}\nService: ${selectedService?.title || 'Not sure yet — please guide me'}\nPreferred day: ${dateLabel(values.date)}\nPreferred time: ${values.time}${values.notes.trim() ? `\nNotes: ${values.notes.trim()}` : ''}\n\nI agree to the clinic contacting me to arrange my appointment. Please confirm availability and an appointment time.`

  function update<K extends keyof typeof values>(key: K, value: typeof values[K]) {
    const changedAt = new Date()
    setValues(current => ({ ...current, [key]: value,
      ...(key === 'date' && isPastAppointmentTime(String(value), current.time, changedAt) ? { time: 'Flexible' } : {}),
    }))
    setError('')
  }
  function goTo(next: number) {
    setError('')
    setStep(next)
    requestAnimationFrame(() => stepHeading.current?.focus())
  }
  function next(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const submittedAt = new Date()
    setNow(submittedAt)
    const currentDay = clinicToday(submittedAt)
    const earliest = dateValue(currentDay)
    const latest = dateValue(new Date(currentDay.getFullYear(), currentDay.getMonth() + 2, 0))
    if (step === 0 && !selectedService && values.service !== 'not-sure') { document.getElementById('appointment-service')?.focus(); setError('Choose a service, or select “Help me choose”.'); return }
    if (values.date && (values.date < earliest || values.date > latest)) { goTo(1); setError('Please choose a date from today through the end of next month.'); return }
    if (step === 0) {
      if (!values.name.trim()) { setError('Please enter your name.'); return }
      if (!isValidPhone(values.phone)) { document.getElementById('appointment-phone')?.focus(); setError('Please enter a valid contact number.'); return }
      if (!values.consent) { setError('Please agree to being contacted about your appointment.'); return }
    }
    if (step === 1) {
      if (isPastAppointmentTime(values.date, values.time, submittedAt)) { setError('That time has already passed. Please choose a later time or a flexible time.'); return }
      track('booking_whatsapp_handoff')
      window.open(`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(request)}`, '_blank', 'noopener,noreferrer')
      return
    }
    track('booking_details_complete')
    goTo(1)
  }

  return <section className="section appointment-section" id="appointment" tabIndex={-1} aria-labelledby="appointment-heading">
    <div className="agai-container appointment-layout">
      <div className="appointment-intro">
        <p className="home-unified-eyebrow">{t("Book an appointment")}</p>
        <h2 className="home-unified-title" id="appointment-heading">{t("Your recovery.")} <span>{t("Starts right here.")}</span></h2>
        <p>{t("A little about you. A day that suits you. Let’s find your next step towards moving better.")}</p>
        <div className="booking-practitioner">
          <div className="booking-practitioner-profile"><span className="booking-practitioner-avatar" aria-hidden="true">DR.</span><div><h3>{clinic.founder}</h3><p>{t(founderContent.credentials)}</p><p>{t(founderContent.role)}</p></div></div>
          <ul className="booking-practitioner-tags" aria-label={t("Care at AGAI")}><li>{t("Sports rehabilitation")}</li><li>{t("Movement & recovery")}</li><li>{t("Personalised care")}</li></ul>
          <ul className="booking-practitioner-steps" aria-label={t("Your care journey")}><li><strong>{t("Assess")}</strong><span>{t("Your movement")}</span></li><li><strong>{t("Plan")}</strong><span>{t("Care around you")}</span></li><li><strong>{t("Progress")}</strong><span>{t("Towards your goals")}</span></li></ul>
        </div>
        {clinic.whatsapp ? <div className="appointment-whatsapp">
          <a className="appointment-whatsapp-button" href={`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(isTamil ? 'வணக்கம் AGAI, இயன்முறை மருத்துவச் சந்திப்புக்கு முன்பதிவு செய்ய விரும்புகிறேன். கிடைக்கும் நேரத்தைத் தெரிவியுங்கள்.' : 'Hello AGAI, I would like to book a physiotherapy appointment. Please help me with availability.')}`} target="_blank" rel="noopener noreferrer">
            <span className="appointment-phone-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z" /><path d="m8 7 2 3-1.2 1.2a10 10 0 0 0 4 4L14 14l3 2c-1 3-4 2-7-1s-4-6-2-8Z" /></svg></span>
            <span><small>{t("Prefer instant messaging?")}</small><strong>{t("Chat on WhatsApp")}</strong><span className="booking-contact-caption">{t("Ask about appointment availability")}</span></span>
          </a>
        </div> : null}
        {clinic.phone ? <a className="appointment-phone" href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}><span className="appointment-phone-icon"><Icon name="phone" /></span><span><small>{t("Prefer to book by phone?")}</small><strong>{clinic.phone}</strong><span className="booking-contact-caption">{t("Call AGAI to arrange your visit")}</span></span></a> : null}
        <div className="booking-privacy-note"><Icon name="shield" /><p><strong>{t("Your appointment request:")}</strong> {t("Share only the details needed to arrange your visit. Please avoid sensitive medical information.")}</p></div>
      </div>
      <div className="appointment-card" id="appointment-form" tabIndex={-1}>
        <div className="booking-card-header"><div><p className="booking-label">{t("Book now")}</p><h3>{t("Schedule Your Clinical Appointment")}</h3></div><span className="booking-duration"><Icon name="clock" />{t("~2 mins to complete")}</span></div>
        <ol className="booking-steps" aria-label={t("Appointment progress")}>{steps.map((label, index) => <li key={label} className={index < step ? 'is-complete' : index === step ? 'is-current' : ''}><button type="button" disabled={index > step} aria-current={index === Math.min(step, steps.length - 1) ? 'step' : undefined} onClick={() => goTo(index)}><span>{index < step ? <Icon name="check" /> : index + 1}</span>{t(label)}</button></li>)}</ol>
        <div className="booking-progress" aria-hidden="true"><span style={{ width: `${Math.min((step + 1) / steps.length, 1) * 100}%` }} /></div>
        <form onInvalidCapture={localizeValidation} onInputCapture={clearValidation} onSubmit={next} className="booking-form" onFocusCapture={() => track('booking_start')} onChangeCapture={() => track('booking_start')}>
          <div className="booking-step-heading"><p className="booking-label">{isTamil ? `படி ${step + 1} / ${steps.length}` : `Step ${step + 1} of ${steps.length}`} </p><h4 ref={stepHeading} tabIndex={-1} className={step === 0 ? 'visually-hidden' : undefined}>{step === 0 ? t('Your details') : t('When works for you?')}</h4>{step === 1 ? <p>{t("Choose a preference. The clinic will confirm a suitable time.")}</p> : null}</div>
          {step === 0 ? <div className="booking-details"><div className="appointment-fields"><label className="agai-field appointment-field-wide" htmlFor="appointment-name">{t("Full name *")}<input className="agai-input" id="appointment-name" autoComplete="name" placeholder={t("Your full name")} maxLength={100} value={values.name} onChange={event => update('name', event.target.value)} required /></label><label className="agai-field" htmlFor="appointment-phone">{t("Contact number *")}<input className="agai-input" id="appointment-phone" type="tel" autoComplete="tel" placeholder={t("Your phone number")} maxLength={30} value={values.phone} onChange={event => update('phone', event.target.value)} required /></label><label className="agai-field" htmlFor="appointment-email">{t("Email")} <span className="required-label">{t("(optional)")}</span><input className="agai-input" id="appointment-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={200} value={values.email} onChange={event => update('email', event.target.value)} /></label><ServiceSelect value={values.service} onChange={value => update('service', value)} /></div><details className="booking-notes"><summary>{t("Add a note")} <span>{t("(optional)")}</span></summary><label className="visually-hidden" htmlFor="appointment-notes">{t("A note for the clinic")}</label><textarea className="agai-input" id="appointment-notes" rows={3} maxLength={1000} placeholder={t("Anything you’d like us to know? Please avoid sensitive medical details.")} value={values.notes} onChange={event => update('notes', event.target.value)} /></details><label className="appointment-consent"><input type="checkbox" checked={values.consent} onChange={event => update('consent', event.target.checked)} required /><span>{t("I agree to the clinic contacting me to arrange my appointment. *")}</span></label></div> : null}
          {step === 1 ? <div className="booking-schedule">
            <div className="booking-calendar" aria-label={t("Choose your preferred date")}>
              <div className="booking-calendar-nav">
                <button type="button" aria-label={t("Previous month")} disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg></button>
                <strong aria-live="polite">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</strong>
                <button type="button" aria-label={t("Next month")} disabled={month >= new Date(today.getFullYear(), today.getMonth() + 1, 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg></button>
              </div>
              <div className="booking-calendar-week" aria-hidden="true">{(isTamil ? ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(day => <span key={day}>{day}</span>)}</div>
              <div className="booking-calendar-days">{days.map(day => <button type="button" key={day.value} data-date={day.value} className={`${day.outside ? 'is-outside ' : ''}${values.date === day.value ? 'is-selected' : ''}`} aria-label={day.label} aria-pressed={values.date === day.value} aria-current={day.value === minDate ? 'date' : undefined} disabled={day.value < minDate || day.value > maxDate} onClick={() => { update('date', day.value); if (day.outside) setMonth(new Date(day.day.getFullYear(), day.day.getMonth(), 1)) }}>{day.day.getDate()}</button>)}</div>
              <div className="booking-calendar-selection"><span>{values.date ? dateLabel(values.date) : t('No preferred date')}</span><button className="booking-back" type="button" aria-pressed={!values.date} onClick={() => update('date', '')}>{t("Flexible date")}</button></div>
            </div>
            <fieldset className="booking-fieldset booking-time-picker"><legend>{t("Preferred time")}</legend><p>{t("All times are in India Standard Time (IST). The clinic will confirm availability.")}</p>
              <div className="booking-time-periods" role="group" aria-label={t("Time of day")}>{timePeriods.map(period => <button key={period} type="button" aria-pressed={timePeriod === period} aria-controls="booking-time-options" onClick={() => { if (period !== timePeriod) { setTimePeriod(period); update('time', 'Flexible') } }}>{t(period)}</button>)}</div>
              <div className="booking-times" id="booking-time-options" role="group" aria-label={isTamil ? `${t(timePeriod)} நேரங்கள்` : `${timePeriod} times`}>{timeGroups[timePeriod].map(time => <label className={`booking-time${values.time === time ? ' is-selected' : ''}`} key={time}><input type="radio" name="time" disabled={isPastAppointmentTime(values.date, time, now)} checked={values.time === time} onChange={() => update('time', time)} />{time}</label>)}</div><label className="booking-time-flexible"><input type="radio" name="time" checked={values.time === 'Flexible'} onChange={() => update('time', 'Flexible')} />{t("Any time works for me")}</label></fieldset>
            <p className="booking-info"><Icon name="clock" />{t("These are preferences, not live appointment slots.")}</p>
          </div> : null}

          {error ? <p className="form-error" role="alert">{t(error)}</p> : null}
          <div className="booking-actions">{step > 0 ? <button type="button" className="booking-back" onClick={() => goTo(step - 1)}>{t("Back")}</button> : null}<button className="agai-button appointment-submit" type="submit">{step === 0 ? t('Continue choosing date') : t('Book appointment')}<Arrow /></button></div>
          <p className="appointment-note"><Icon name="shield" />{step === 1 ? t('Continue in WhatsApp to send your request. The clinic will confirm your appointment.') : t('Your details stay in this tab until you choose to send.')}</p>
        </form>
      </div>
    </div>
  </section>
}
