import { Link } from 'react-router'
import { approach, clinic, faqs, services } from '../content'
import { Arrow, ContactBanner, Eyebrow, FAQ, Icon } from '../components/UI'
import AppointmentSection from '../components/AppointmentSection'

export default function HomePage() {
  return <div className="home-page">
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-inner agai-container">
        <div className="hero-copy">
          <h1 id="hero-heading">Your trusted partner <br />in movement and <br />recovery</h1>
          <Link className="hero-pill" to="/#appointment">Book appointment <span className="hero-pill-icon"><Arrow /></span></Link>
          <div className="hero-feature">
            <h2>Personalised care</h2>
            <p>Evidence-based physiotherapy led by a sports specialist. Book an appointment, call {clinic.phone} or visit us in {clinic.address || 'Chennai'}.</p>
          </div>
        </div>
        <div className="hero-media">
          <div className="hero-panel">
            <p className="hero-panel-status"><span className="hero-panel-dot" aria-hidden="true" />Now welcoming new patients</p>
            <Link className="hero-founder" to="/about#founder">
              <span className="hero-founder-avatar" aria-hidden="true">RR</span>
              <span className="hero-founder-copy"><strong>Dr. Rasathi Rajendren, PT</strong><span>Founder · MPT, Sports Physiotherapy</span></span>
              <span className="hero-founder-arrow"><Arrow diagonal /></span>
            </Link>
            <ul className="hero-tiles" aria-label="Key facts">
              <li><strong>10<span>+</span></strong><span>Years of clinical experience</span></li>
              <li><strong>7</strong><span>Areas of specialised care</span></li>
              <li><strong>1<span>:1</span></strong><span>Personalised sessions</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="section agai-container home-services" aria-labelledby="home-services-heading"><div className="section-heading"><div><Eyebrow>Our services</Eyebrow><h2 id="home-services-heading" className="home-section-title"><span className="home-title-lead">Different needs.</span><br /><span>The same thoughtful care.</span></h2></div><p>From returning to sport to moving more comfortably in everyday life, your goals give your care direction.</p></div>
      <div className="service-preview-grid">
        {services.map(service => <Link className="service-preview" key={service.id} to={`/services#${service.id}`}>
          <img
            className="service-preview-image"
            src={service.image}
            alt=""
            loading="lazy"
            decoding="async"
            width="120"
            height="170"
          />
          <div className="service-preview-copy">
            <h3>{service.shortTitle}</h3>
            <p>{service.intro}</p>
          </div>
        </Link>)}
      </div>
      <div className="section-bottom"><span>Seven services. One focus: your movement.</span><Link className="text-action" to="/services">View all services <Arrow /></Link></div>
    </section>

    <section className="approach-section" id="approach"><div className="agai-container section"><div className="section-heading"><div><Eyebrow>The AGAI approach</Eyebrow><h2 className="home-section-title"><span className="home-title-lead">More than pain relief.</span><br /><span>A way forward.</span></h2></div><p>Restoring movement, rebuilding strength and helping every individual work towards their full potential.</p></div><div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>

    <section className="section agai-container founder-section" id="founder" tabIndex={-1} aria-labelledby="founder-heading">
      <div className="founder-profile"><div className="profile-top"><span>Experience with purpose</span><Icon name="shield" /></div><div className="profile-number">10<span>+</span></div><p className="profile-number-label">years of clinical experience</p><div className="profile-rule" /><h3>Dr. Rasathi<br />Rajendren, PT</h3><p>Founder & Sports Physiotherapist</p><div className="profile-countries"><span>India</span><span>Saudi Arabia</span><span>Oman</span></div></div>
      <div className="founder-story"><Eyebrow>Meet our founder</Eyebrow><h2 id="founder-heading" className="home-section-title"><span className="home-title-lead">Expertise you can</span><br /><span>move forward with.</span></h2><p>Dr. Rasathi Rajendren brings over a decade of clinical experience across India and the Middle East to AGAI Physiotherapy Centre.</p><p>With a postgraduate specialisation in Sports Physiotherapy, she combines clinical assessment, hands-on therapy, individualised exercise and patient education. Her experience spans multispecialty hospital care, sports rehabilitation and women’s wellness.</p><ul className="qualifications"><li><Icon name="check" /><span><strong>MPT · Sports Physiotherapy</strong><small>Annamalai University, 2022</small></span></li><li><Icon name="check" /><span><strong>Postgraduate Diploma in Yoga</strong><small>Alagappa University, 2021</small></span></li><li><Icon name="check" /><span><strong>MSc · Applied Psychology</strong><small>Annamalai University, 2020 · Correspondence</small></span></li></ul></div>
    </section>
    <section className="experience-section agai-container" aria-labelledby="experience-heading"><div className="experience-heading"><Eyebrow>A foundation of clinical experience</Eyebrow><h2 id="experience-heading" className="home-section-title"><span className="home-title-lead">Experience that matters.</span><br /><span>Care you can trust.</span></h2></div><div className="experience-timeline">{[
      ['2016–2017', 'Pondicherry Institute of Medical Sciences', 'India'],
      ['2017–2019', 'Al Hayat National Hospital', 'Saudi Arabia'],
      ['2022–2024', 'Khalfan Nasser Al Farsi Physio Centre', 'Oman'],
      ['2024–2026', 'Apollo Super Speciality Hospital', 'Oman'],
    ].map(([dates, name, country]) => <article key={name}><span>{dates}</span><h3>{name}</h3><p>{country}</p></article>)}</div></section>

    <AppointmentSection />
    <section className="faq-section section home-faq" aria-labelledby="home-faq-heading">
      <div className="agai-container faq-layout">
        <div className="home-faq-intro">
          <div><Eyebrow>A little clarity</Eyebrow><h2 id="home-faq-heading" className="home-section-title"><span className="home-title-lead">Frequently asked</span><br /><span>questions.</span></h2></div>
          <div className="faq-contact-card">
            <h3>Still have a question?</h3>
            <p>We’re here to help you find the right next step.</p>
            <Link className="faq-contact-button" to="/contact">Contact us <Arrow diagonal /></Link>
          </div>
        </div>
        <FAQ items={faqs} numbered />
      </div>
    </section>
    <ContactBanner homeHeading />
  </div>
}
