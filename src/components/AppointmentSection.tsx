import { useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { clinic, services } from '../content'
import { Arrow, Eyebrow, Icon } from './UI'
import ServiceSelect from './ServiceSelect'

const steps = ['Your details', 'Your day']
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
function dateLabel(value: string) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible — help me choose'
}

export default function AppointmentSection() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({ service: '', date: '', time: 'Flexible', name: '', phone: '', email: '', notes: '', consent: false })
  const [error, setError] = useState('')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('Morning')
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const today = new Date()
  const minDate = dateValue(today)
  const maxDate = dateValue(new Date(today.getFullYear(), today.getMonth() + 2, 0))
  const days = Array.from({ length: Math.ceil((month.getDay() + new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()) / 7) * 7 }, (_, index) => {
    const day = new Date(month.getFullYear(), month.getMonth(), index - month.getDay() + 1)
    return { value: dateValue(day), day, label: day.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), outside: day.getMonth() !== month.getMonth() }
  })
  const selectedService = services.find(service => service.id === values.service)
  const request = `Appointment request for ${clinic.name}\n\nName: ${values.name.trim()}\nPhone: ${values.phone.trim()}\nEmail: ${values.email.trim() || 'Not provided'}\nService: ${selectedService?.title || 'Not sure yet — please guide me'}\nPreferred day: ${dateLabel(values.date)}\nPreferred time: ${values.time}${values.notes.trim() ? `\nNotes: ${values.notes.trim()}` : ''}\n\nI agree to the clinic contacting me to arrange my appointment. Please confirm availability and an appointment time.`

  function update<K extends keyof typeof values>(key: K, value: typeof values[K]) {
    setValues(current => ({ ...current, [key]: value }))
    setError('')
  }
  function goTo(next: number) {
    setError('')
    setStep(next)
    requestAnimationFrame(() => stepHeading.current?.focus())
  }
  function next(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 0 && !values.service) { document.getElementById('appointment-service')?.focus(); setError('Choose a service, or select “Help me choose”.'); return }
    if (values.date && (values.date < minDate || values.date > maxDate)) { goTo(1); setError('Please choose a date from today through the end of next month.'); return }
    if (step === 0) {
      if (!values.name.trim()) { setError('Please enter your name.'); return }
      if (values.phone.replace(/\D/g, '').length < 7) { setError('Please enter a valid contact number.'); return }
      if (!values.consent) { setError('Please agree to being contacted about your appointment.'); return }
    }
    if (step === 1) {
      window.open(`https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(request)}`, '_blank', 'noopener,noreferrer')
      return
    }
    goTo(1)
  }

  return <section className="section appointment-section" id="appointment" tabIndex={-1} aria-labelledby="appointment-heading">
    <div className="agai-container appointment-layout">
      <div className="appointment-intro">
        <Eyebrow>Book an appointment</Eyebrow>
        <h2 className="home-section-title" id="appointment-heading"><span className="home-title-lead">Your recovery.</span><br /><span>Starts right here.</span></h2>
        <p>A little about you. A day that suits you. Let’s find your next step towards moving better.</p>
        <div className="booking-clinician"><span className="booking-avatar">RR</span><div><strong>Dr. Rasathi Rajendren, PT</strong><span>MPT · Sports Physiotherapy</span></div><Icon name="shield" /></div>
        <a className="appointment-phone" href={`tel:${clinic.phone.replace(/[^+\d]/g, '')}`}><span className="appointment-phone-icon"><Icon name="phone" /></span><span><small>Prefer to book by phone?</small><strong>{clinic.phone}</strong></span></a>
      </div>
      <div className="appointment-card">
        <div className="booking-card-header"><div><p className="booking-label">Book now</p><h3>Schedule Your Appointment</h3></div><span className="booking-header-icon"><Icon name="clock" /></span></div>
        <ol className="booking-steps" aria-label="Appointment progress">{steps.map((label, index) => <li key={label} className={index < step ? 'is-complete' : index === step ? 'is-current' : ''}><button type="button" disabled={index > step} aria-current={index === Math.min(step, steps.length - 1) ? 'step' : undefined} onClick={() => goTo(index)}><span>{index < step ? <Icon name="check" /> : index + 1}</span>{label}</button></li>)}</ol>
        <div className="booking-progress" aria-hidden="true"><span style={{ width: `${Math.min((step + 1) / steps.length, 1) * 100}%` }} /></div>
        <form onSubmit={next} className="booking-form">
          <div className="booking-step-heading"><p className="booking-label">Step {step + 1} of {steps.length}</p><h4 ref={stepHeading} tabIndex={-1} className={step === 0 ? 'visually-hidden' : undefined}>{step === 0 ? 'Your details' : 'When works for you?'}</h4>{step === 1 ? <p>Choose a preference. The clinic will confirm a suitable time.</p> : null}</div>
          {step === 0 ? <div className="booking-details"><div className="appointment-fields"><label className="agai-field appointment-field-wide" htmlFor="appointment-name">Full name *<input className="agai-input" id="appointment-name" autoComplete="name" placeholder="Your full name" maxLength={100} value={values.name} onChange={event => update('name', event.target.value)} required /></label><label className="agai-field" htmlFor="appointment-phone">Contact number *<input className="agai-input" id="appointment-phone" type="tel" autoComplete="tel" placeholder="Your phone number" maxLength={30} value={values.phone} onChange={event => update('phone', event.target.value)} required /></label><label className="agai-field" htmlFor="appointment-email">Email <span className="required-label">(optional)</span><input className="agai-input" id="appointment-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={200} value={values.email} onChange={event => update('email', event.target.value)} /></label><ServiceSelect value={values.service} onChange={value => update('service', value)} /></div><details className="booking-notes"><summary>Add a note <span>(optional)</span></summary><label className="visually-hidden" htmlFor="appointment-notes">A note for the clinic</label><textarea className="agai-input" id="appointment-notes" rows={3} maxLength={1000} placeholder="Anything you’d like us to know? Please avoid sensitive medical details." value={values.notes} onChange={event => update('notes', event.target.value)} /></details><label className="appointment-consent"><input type="checkbox" checked={values.consent} onChange={event => update('consent', event.target.checked)} required /><span>I agree to the clinic contacting me to arrange my appointment. *</span></label></div> : null}
          {step === 1 ? <div className="booking-schedule">
            <div className="booking-calendar" aria-label="Choose your preferred date">
              <div className="booking-calendar-nav">
                <button type="button" aria-label="Previous month" disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m14 7-5 5 5 5" /></svg></button>
                <strong aria-live="polite">{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
                <button type="button" aria-label="Next month" disabled={month >= new Date(today.getFullYear(), today.getMonth() + 1, 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m10 7 5 5-5 5" /></svg></button>
              </div>
              <div className="booking-calendar-week" aria-hidden="true">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}</div>
              <div className="booking-calendar-days">{days.map(day => <button type="button" key={day.value} data-date={day.value} className={`${day.outside ? 'is-outside ' : ''}${values.date === day.value ? 'is-selected' : ''}`} aria-label={day.label} aria-pressed={values.date === day.value} aria-current={day.value === minDate ? 'date' : undefined} disabled={day.value < minDate || day.value > maxDate} onClick={() => { update('date', day.value); if (day.outside) setMonth(new Date(day.day.getFullYear(), day.day.getMonth(), 1)) }}>{day.day.getDate()}</button>)}</div>
              <div className="booking-calendar-selection"><span>{values.date ? dateLabel(values.date) : 'No preferred date'}</span><button className="booking-back" type="button" aria-pressed={!values.date} onClick={() => update('date', '')}>Flexible date</button></div>
            </div>
            <fieldset className="booking-fieldset booking-time-picker"><legend>Preferred time</legend><p>The clinic will confirm availability.</p>
              <div className="booking-time-periods" role="group" aria-label="Time of day">{timePeriods.map(period => <button key={period} type="button" aria-pressed={timePeriod === period} aria-controls="booking-time-options" onClick={() => { if (period !== timePeriod) { setTimePeriod(period); update('time', 'Flexible') } }}>{period}</button>)}</div>
              <div className="booking-times" id="booking-time-options" role="group" aria-label={`${timePeriod} times`}>{timeGroups[timePeriod].map(time => <label className={`booking-time${values.time === time ? ' is-selected' : ''}`} key={time}><input type="radio" name="time" checked={values.time === time} onChange={() => update('time', time)} />{time}</label>)}</div><label className="booking-time-flexible"><input type="radio" name="time" checked={values.time === 'Flexible'} onChange={() => update('time', 'Flexible')} />Any time works for me</label></fieldset>
            <p className="booking-info"><Icon name="clock" />These are preferences, not live appointment slots.</p>
          </div> : null}

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <div className="booking-actions">{step > 0 ? <button type="button" className="booking-back" onClick={() => goTo(step - 1)}>Back</button> : null}<button className="agai-button appointment-submit" type="submit">{step === 0 ? 'Continue choosing date' : 'Book appointment'}<Arrow /></button></div>
          <p className="appointment-note"><Icon name="shield" />{step === 1 ? 'Continue in WhatsApp to send your request. The clinic will confirm your appointment.' : 'Your details stay in this tab until you choose to send.'}</p>
        </form>
      </div>
    </div>
  </section>
}
