import { useLanguage } from '../language'
import AppointmentSection from '../components/AppointmentSection'

// A page of its own so search engines can list "Book appointment" as a link under the site.
export default function BookAppointmentPage() {
  const { t } = useLanguage()
  return <div className="book-appointment-page">
    <h1 className="visually-hidden">{t("Book your appointment")}</h1>
    <AppointmentSection />
  </div>
}
