import { Link } from 'react-router'
import { approach, clinic } from '../content'
import { Arrow, Breadcrumb, ContactBanner, Eyebrow, Icon } from '../components/UI'

const clinicalAreas = ['Orthopaedic', 'Neurological', 'Paediatric', 'Geriatric', 'Cardio-respiratory', 'Women’s wellness', 'Sports injury rehabilitation']

const qualifications = [
  ['Master of Physiotherapy (MPT), Sports Physiotherapy', 'Annamalai University, 2022'],
  ['Postgraduate Diploma in Yoga', 'Alagappa University, 2021'],
  ['MSc Applied Psychology', 'Annamalai University, 2020 · Correspondence'],
  ['Bachelor of Physiotherapy', 'Sri Venkateswara College of Physiotherapy, 2015'],
]

const experience = [
  ['2016–2017', 'Pondicherry Institute of Medical Sciences', 'India', 'Multispecialty hospital care across orthopaedics, neurology, general surgery and paediatrics, including ICU, CCU and PICU settings.'],
  ['2017–2019', 'Al Hayat National Hospital', 'Saudi Arabia', 'Physiotherapy for orthopaedic, neurological, rheumatological, paediatric and postoperative cases in a multispecialty hospital.'],
  ['2022–2024', 'Khalfan Nasser Al Farsi Physio Centre', 'Oman', 'Outpatient rehabilitation for stroke and spinal conditions, sports rehabilitation, orthopaedic and paediatric care.'],
  ['2024–2026', 'Apollo Super Speciality Hospital', 'Oman', 'Orthopaedics, sports injury post-operative rehabilitation, women’s health, pre- and postpartum rehab and inpatient care.'],
]

export default function AboutPage() {
  return <>
    <section className="page-intro"><div className="agai-container"><Breadcrumb current="About us" /><div className="page-intro-layout"><div><Eyebrow>About us</Eyebrow><h1>Get to know<br /><span>our clinic.</span></h1><p>{clinic.name} is a physiotherapy practice in {clinic.address || 'Chennai'} focused on injury prevention, rehabilitation and better physical performance through personalised, evidence-based care.</p></div><div className="services-index" aria-hidden="true"><span>10<small>+</small></span><p>Years of clinical<br />experience.</p></div></div></div></section>

    <section className="section agai-container about-commitment" aria-labelledby="commitment-heading">
      <div className="section-heading"><div><Eyebrow>Our commitment</Eyebrow><h2 id="commitment-heading">Rehabilitation is more<br /><span>than pain relief.</span></h2></div><p>It is about restoring movement, rebuilding strength, preventing future injuries and helping every individual reach their full potential.</p></div>
      <div className="process-grid">{approach.map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </section>

    <section className="approach-section"><div className="agai-container section"><div className="section-heading"><div><Eyebrow>Areas of clinical practice</Eyebrow><h2>Experience across<br />the specialties.</h2></div><p>Clinical experience gained in multispecialty hospitals and outpatient rehabilitation centres across India and the Middle East.</p></div><ul className="area-list">{clinicalAreas.map(area => <li key={area}><Icon name="check" />{area}</li>)}</ul></div></section>

    <section className="section agai-container founder-section" id="founder" tabIndex={-1} aria-labelledby="about-founder-heading">
      <div className="founder-profile"><div className="profile-top"><span>Experience with purpose</span><Icon name="shield" /></div><div className="profile-number">10<span>+</span></div><p className="profile-number-label">years of clinical experience</p><div className="profile-rule" /><h3>Dr. Rasathi<br />Rajendren, PT</h3><p>Founder & Sports Physiotherapist</p><div className="profile-countries"><span>India</span><span>Saudi Arabia</span><span>Oman</span></div></div>
      <div className="founder-story"><Eyebrow>Meet our founder</Eyebrow><h2 id="about-founder-heading">Expertise you can<br /><span>move forward with.</span></h2><p>Dr. Rasathi Rajendren is an experienced sports physiotherapist with over 10 years of clinical experience across India and the Middle East. With a postgraduate specialisation in Sports Physiotherapy, she is passionate about helping athletes prevent injuries, recover effectively and achieve their peak physical performance.</p><p>She combines clinical assessment, hands-on therapy, individualised exercise programmes and patient education to support recovery, improve functional movement and enhance overall well-being. As founder of {clinic.name}, she aims to provide personalised, evidence-based physiotherapy with a strong focus on sports injury prevention, rehabilitation, speed, strength and conditioning.</p><ul className="qualifications">{qualifications.map(([title, detail]) => <li key={title}><Icon name="check" /><span><strong>{title}</strong><small>{detail}</small></span></li>)}</ul></div>
    </section>

    <section className="experience-section agai-container" aria-labelledby="about-experience-heading"><div className="experience-heading"><Eyebrow>Professional experience</Eyebrow><h2 id="about-experience-heading" className="visually-hidden">The founder’s professional experience</h2></div><div className="experience-timeline experience-timeline--detailed">{experience.map(([dates, name, country, summary]) => <article key={name}><span>{dates}</span><h3>{name}</h3><p>{country}</p><p className="experience-summary">{summary}</p></article>)}</div></section>

    <section className="section agai-container about-next" aria-label="Explore further"><Link className="text-action" to="/services">Explore our services <Arrow /></Link><Link className="text-action" to="/contact">Contact us <Arrow diagonal /></Link></section>
    <ContactBanner />
  </>
}
