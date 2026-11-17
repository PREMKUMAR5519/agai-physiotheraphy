import { useLanguage } from '../language'
import FounderSection from '../components/FounderSection'
import AboutClinicSection from '../components/AboutClinicSection'
import PageIntro from '../components/PageIntro'
import { approach, clinic } from '../content'
import { ContactBanner, Eyebrow } from '../components/UI'

export default function AboutPage() {
  const { t, isTamil } = useLanguage()
  return <>
    <PageIntro label={t("About us")} lead={t("Care that starts")} accent={t("with you.")} description={isTamil ? `சென்னை அம்பத்தூரில் உள்ள AGAI மையம் வலி, இறுக்கம், காயங்கள் மற்றும் இயக்கச் சிரமங்கள் உள்ளவர்களுக்கு உதவுகிறது. உங்கள் அன்றாட வாழ்க்கையில் உள்ள சிரமங்களைப் புரிந்துகொண்டு, தேவைகளுக்கு ஏற்ற சிகிச்சையைத் திட்டமிடுகிறோம்.` : `${clinic.name} in ${clinic.address || 'Chennai'} helps people with pain, stiffness, injuries and difficulty moving. We start by understanding what is making everyday life harder, then discuss care that fits your needs.`} />
    <AboutClinicSection imageSrc={`${import.meta.env.BASE_URL}images/aboutus/frontview.webp`} />
    <FounderSection />
    <section className="approach-section"><div className="agai-container section">
      <div className="section-heading"><div><Eyebrow>{t("Your first visit")}</Eyebrow><h2>{t("Understand your needs.")}<br />{t("Plan your next step.")}</h2></div><p>{t("You do not need to know the name of a treatment before you visit. Tell us what you are finding difficult and what you would like to get back to.")}</p></div>
      <div className="approach-grid">{approach.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1}</span><h3>{t(step.title)}</h3><p>{t(step.text)}</p></article>)}</div>
    </div></section>
    <ContactBanner variant="home" />
  </>
}
