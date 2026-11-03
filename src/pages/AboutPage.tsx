import FounderSection from '../components/FounderSection'
import PageIntro from '../components/PageIntro'
import { Link } from 'react-router'
import { clinic } from '../content'
import { Arrow, ContactBanner, Eyebrow, Icon } from '../components/UI'

const clinicalAreas = ['Orthopaedic', 'Neurological', 'Paediatric', 'Geriatric', 'Cardio-respiratory', 'Women’s wellness', 'Sports injury rehabilitation']

const experience = [
  ['2016–2017', 'Pondicherry Institute of Medical Sciences', 'India', 'Multispecialty hospital care across orthopaedics, neurology, general surgery and paediatrics, including ICU, CCU and PICU settings.'],
  ['2017–2019', 'Al Hayat National Hospital', 'Saudi Arabia', 'Physiotherapy for orthopaedic, neurological, rheumatological, paediatric and postoperative cases in a multispecialty hospital.'],
  ['2022–2024', 'Khalfan Nasser Al Farsi Physio Centre', 'Oman', 'Outpatient rehabilitation for stroke and spinal conditions, sports rehabilitation, orthopaedic and paediatric care.'],
  ['2024–2026', 'Apollo Super Speciality Hospital', 'Oman', 'Orthopaedics, sports injury post-operative rehabilitation, women’s health, pre- and postpartum rehab and inpatient care.'],
]

export default function AboutPage() {
  return <>
    <PageIntro label="About us" lead="Get to know" accent="our clinic." description={`${clinic.name} is a physiotherapy practice in ${clinic.address || 'Chennai'} focused on injury prevention, rehabilitation and better physical performance through personalised, evidence-based care.`} metric={<>10<small>+</small></>} metricCaption={<>Years of clinical<br />experience.</>} />

    <FounderSection />

    <section className="approach-section"><div className="agai-container section"><div className="section-heading"><div><Eyebrow>Areas of clinical practice</Eyebrow><h2>Experience across<br />the specialties.</h2></div><p>Clinical experience gained in multispecialty hospitals and outpatient rehabilitation centres across India and the Middle East.</p></div><ul className="area-list">{clinicalAreas.map(area => <li key={area}><Icon name="check" />{area}</li>)}</ul></div></section>

    <section className="experience-section agai-container home-experience about-experience" aria-labelledby="about-experience-heading"><div className="experience-heading"><Eyebrow>Professional experience</Eyebrow><h2 id="about-experience-heading" className="visually-hidden">The founder’s professional experience</h2></div><div className="experience-timeline experience-timeline--detailed">{experience.map(([dates, name, country, summary], index) => <article key={name}><div className="experience-card-top"><span className="experience-date">{dates}</span><span className="experience-order" aria-hidden="true">0{index + 1}</span></div><h3>{name}</h3><p className="experience-summary">{summary}</p><p className="experience-location"><Icon name="pin" />{country}</p></article>)}</div></section>

    <section className="section agai-container about-next" aria-label="Explore further"><Link className="text-action" to="/services">Explore our services <Arrow /></Link><Link className="text-action" to="/contact">Contact us <Arrow diagonal /></Link></section>
    <ContactBanner />
  </>
}
