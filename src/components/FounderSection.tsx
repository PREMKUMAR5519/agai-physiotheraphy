import FounderDetails from './FounderDetails'
import { Link } from 'react-router'
import { Arrow, Eyebrow, Icon } from './UI'

export default function FounderSection() {
  return (
    <section className="section agai-container founder-section" id="founder" tabIndex={-1} aria-labelledby="founder-heading">
      <div className="founder-story">
        <Eyebrow>Meet your physiotherapist</Eyebrow>
        <h2 id="founder-heading" className="home-section-title"><span className="home-title-lead">Someone who listens.</span><br /><span>Care that fits you.</span></h2>
        <FounderDetails />
        <p>With over 10 years of clinical experience, Dr. Rasathi helps people work towards easier movement, injury recovery and a return to the activities they enjoy.</p>
      </div>
      <aside className="founder-care-note" aria-label="Your care at AGAI">
        <span className="care-note-icon"><Icon name="person" /></span>
        <h3>Your goals guide your care.</h3>
        <ul>{['Time to explain what is troubling you', 'A clear explanation of your care options', 'Exercises and advice suited to your daily routine'].map(item => <li key={item}><Icon name="check" /><span>{item}</span></li>)}</ul>
        <Link className="text-action" to="/#appointment">Talk to us about your needs <Arrow /></Link>
      </aside>
    </section>
  )
}
