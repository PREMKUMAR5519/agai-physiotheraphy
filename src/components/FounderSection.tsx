import FounderDetails from './FounderDetails'
import { Eyebrow, Icon } from './UI'

export default function FounderSection() {
  return (
    <section className="section agai-container founder-section" id="founder" tabIndex={-1} aria-labelledby="founder-heading">
      <div className="founder-portrait" aria-hidden="true" />
      <div className="founder-story"><Eyebrow>Meet our founder</Eyebrow><h2 id="founder-heading" className="home-section-title"><span className="home-title-lead">Expertise you can</span><br /><span>move forward with.</span></h2><FounderDetails /><p>Dr. Rasathi Rajendren brings over a decade of clinical experience across India and the Middle East to AGAI Physiotherapy Centre.</p><p>With a postgraduate specialisation in Sports Physiotherapy, she combines clinical assessment, hands-on therapy, individualised exercise and patient education. Her experience spans multispecialty hospital care, sports rehabilitation and women’s wellness.</p><ul className="qualifications"><li><Icon name="check" /><span><strong>MPT · Sports Physiotherapy</strong><small>Annamalai University, 2022</small></span></li><li><Icon name="check" /><span><strong>Postgraduate Diploma in Yoga</strong><small>Alagappa University, 2021</small></span></li><li><Icon name="check" /><span><strong>MSc · Applied Psychology</strong><small>Annamalai University, 2020 · Correspondence</small></span></li></ul></div>
    </section>
  )
}
