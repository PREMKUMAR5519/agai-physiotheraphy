import { Link, useSearchParams } from 'react-router'
import { approach, categories, services } from '../content'
import { Arrow, Breadcrumb, ContactBanner, Eyebrow, Icon } from '../components/UI'

export default function ServicesPage() {
  const [params, setParams] = useSearchParams()
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category')! : 'all'
  const visibleServices = services.filter(service => category === 'all' || service.category === category)

  return <>
    <section className="page-intro"><div className="agai-container"><Breadcrumb current="Our services" /><div className="page-intro-layout"><div><Eyebrow>Our services</Eyebrow><h1>Care for every<br /><span>way you move.</span></h1><p>From rehabilitation to performance, explore personalised physiotherapy shaped around your needs and the life you want to get back to.</p></div><div className="services-index" aria-hidden="true"><span>07</span><p>Areas of care.<br />Individual care.</p></div></div></div></section>
    <section className="section agai-container services-section" aria-labelledby="services-heading"><div className="services-toolbar"><h2 id="services-heading">Find your focus.</h2><span className="result-count" role="status">{visibleServices.length} {visibleServices.length === 1 ? 'service' : 'services'}</span></div><div className="service-filters" role="group" aria-label="Filter services">{categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setParams(item.id === 'all' ? {} : { category: item.id }, { preventScrollReset: true })}>{item.label}</button>)}</div>
      <div className="service-catalogue">{visibleServices.map(service => <article className="service-detail" key={service.id} id={service.id} tabIndex={-1}><div className="service-detail-heading"><span className="service-icon"><Icon name={service.icon} /></span><span className="service-category">{categories.find(item => item.id === service.category)?.label}</span><h3>{service.title}</h3><p>{service.intro}</p></div><div className="service-detail-body"><p>{service.description}</p><h4>Care focus</h4><ul>{service.focus.map(focus => <li key={focus}><Icon name="check" />{focus}</li>)}</ul><Link className="text-action" to={`/contact?service=${service.id}`}>Enquire about this service <Arrow diagonal /></Link></div></article>)}</div>
      <aside className="service-help"><span className="service-icon"><Icon name="chat" /></span><div><h3>Not sure where to start?</h3><p>You don’t need to have it all figured out. Choose “Not sure yet” when you prepare your enquiry.</p></div><Link className="text-action" to="/contact">Get in touch <Arrow /></Link></aside>
    </section>
    <section className="care-expect section"><div className="agai-container"><div className="section-heading"><div><Eyebrow>A personal approach</Eyebrow><h2>Your goals guide<br /><span>the way forward.</span></h2></div><p>Across every service, the emphasis is on understanding your movement and building care around you.</p></div><div className="process-grid">{approach.map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>
    <ContactBanner />
  </>
}

