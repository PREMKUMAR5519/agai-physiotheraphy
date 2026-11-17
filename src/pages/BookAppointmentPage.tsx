import AppointmentSection from '../components/AppointmentSection'
import PageIntro from '../components/PageIntro'
import { clinic } from '../content'

// A page of its own so search engines can list "Book appointment" as a link under the site.
export default function BookAppointmentPage() {
  return <>
    <PageIntro label="Book appointment" lead="Book your" accent="appointment." description={`Choose a service and tell us a little about what you are finding difficult. ${clinic.name} will help you plan your first visit.`} />
    <AppointmentSection />
  </>
}
