import { approach, clinic } from '../content'
import type { Service } from '../services-api'
import type { ChatReply } from './chatReplies'
import tamil from '../tamil.json'
import mainTamil from '../tamil-main.json'

const translations: Record<string, string> = { ...tamil, ...mainTamil }
const t = (text: string) => translations[text] ?? text
const book = { label: 'Book an appointment', href: '/#appointment' }
const contact = { label: 'Talk on WhatsApp', href: `https://wa.me/${clinic.whatsapp}` }

// Tamil and English keywords both work while browsing in Tamil. No diagnosis or treatment selection.
export function getTamilChatReply(input: string, services: readonly Service[]): ChatReply {
  const text = input.toLowerCase().replace(/[‘’]/g, "'").trim()
  if (/அவசர|நெஞ்சு வலி|மார்பு வலி|மூச்சு|\b(emergency|urgent|chest pain|cannot breathe|can't breathe|difficulty breathing)\b/.test(text)) return { text: 'அவசர மருத்துவ உதவிக்கு இந்தத் தானியங்கி வழிகாட்டி உதவ முடியாது. உள்ளூர் அவசரச் சேவைகளைத் தொடர்புகொள்ளுங்கள் அல்லது அருகிலுள்ள அவசர சிகிச்சைப் பிரிவுக்குச் செல்லுங்கள்.' }
  if (/ரத்து|மாற்ற|\b(cancel|reschedule|change my appointment)\b/.test(text)) return { text: 'சந்திப்பை மாற்றவோ ரத்து செய்யவோ மையத்தைத் தொடர்புகொள்ளுங்கள். ஏற்கெனவே உள்ள முன்பதிவுகளை இந்த வழிகாட்டியால் பார்க்கவோ மாற்றவோ முடியாது.', actions: [contact] }
  if (/கட்டண|விலை|காப்பீடு|\b(fees?|cost|price|pricing|insurance|payment)\b/.test(text)) return { text: 'ஆலோசனைக் கட்டணம் மற்றும் பணம் செலுத்தும் விவரங்களை மையத்திடம் நேரடியாகக் கேளுங்கள். உறுதிப்படுத்தப்பட்ட கட்டணப் பட்டியல் என்னிடம் இல்லை.', actions: [contact] }
  if (/^(வணக்கம்|நன்றி|hi|hello|hey|thanks|thank you)[!.,\s]*$/.test(text)) return { text: 'வணக்கம்! நான் AGAI மையத்தின் தானியங்கி வழிகாட்டி. சேவைகள், முன்பதிவு மற்றும் மையத்தின் இருப்பிடம் குறித்து உதவ முடியும். என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?' }
  if (/முதல் வருகை|முதல்முறை|என்ன கொண்டு|\bfirst (visit|appointment|session)|\bwhat (to|should i) (expect|bring)/.test(text)) return { text: `உங்கள் முதல் வருகை உரையாடலுடன் தொடங்கும். ${approach.map(step => t(step.text)).join(' ')}`, actions: [{ label: 'About your first visit', href: '/about' }, book] }
  if (/நேரம்|எப்போது|இன்று|நாளை|திறந்திரு|\b(hours?|timings?|open|availability|slots?|today|tomorrow)\b/.test(text)) return { text: 'மையம் செயல்படும் நேரத்தையும் சந்திப்புக்குக் கிடைக்கும் நேரத்தையும் உங்களிடம் உறுதிப்படுத்தும். படிவத்தில் விருப்பமான தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுக்கலாம். இவை விருப்பங்கள் மட்டுமே; உறுதிப்படுத்தப்பட்ட சந்திப்பு நேரங்கள் அல்ல.', actions: [book, contact] }
  if (/முன்பதிவு|சந்திப்பு|\b(book|booking|schedule|appointment|consultation)\b/.test(text)) return { text: 'உங்கள் விவரங்களையும் விருப்பமான சேவையையும் தெரிவித்து, தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுங்கள். முன்பதிவு பொத்தான் உங்கள் கோரிக்கையுடன் WhatsApp-ஐத் திறக்கும். அங்கே செய்தியை அனுப்புங்கள். மையம் உங்கள் சந்திப்பை உறுதிப்படுத்தும்.', actions: [book] }
  const service = services.find(item => text.includes(t(item.shortTitle).toLowerCase()) || text.includes(item.shortTitle.toLowerCase()))
  if (service) return { text: `${t(service.title)}\n\n${t(service.description)}`, actions: [{ label: 'Explore this service', href: `/services#${service.id}` }, book] }
  if (/எங்கே|முகவரி|இருப்பிடம்|வழி|\b(where|address|location|directions|map|parking)\b/.test(text)) return { text: `AGAI மையத்தின் முகவரி: ${clinic.address}. வழியைக் காண வரைபடத்தைப் பயன்படுத்துங்கள் அல்லது மையத்தை அழையுங்கள்.`, actions: [{ label: 'Get directions', href: clinic.mapsUrl }, { label: 'Call the clinic', href: `tel:${clinic.phone.replace(/[^+\d]/g, '')}` }] }
  if (/மருத்துவர்|நிறுவனர்|ராசாத்தி|\b(doctor|founder|therapist|rasathi|qualifications|experience)\b/.test(text)) return { text: `${clinic.founder} — AGAI மையத்தின் நிறுவனர் மற்றும் விளையாட்டுத் துறை இயன்முறை மருத்துவர்.`, actions: [{ label: 'Meet our founder', href: '/about#founder' }] }
  if (/தொடர்பு|குழு|தொலைபேசி|மின்னஞ்சல்|\b(contact|call|phone|whatsapp|human|team|staff|email)\b/.test(text)) return { text: `மையத்தை ${clinic.phone} அல்லது ${clinic.email} மூலம் தொடர்புகொள்ளலாம். நேரடியாகப் பேச WhatsApp-இல் தொடருங்கள்.`, actions: [contact, { label: 'Contact details', href: '/contact' }] }
  if (/வலி|அறிகுறி|மருந்து|சிகிச்சை ஆலோசனை|\b(pain|symptom|diagnos|medicine|medication|exercise|treatment advice|hurt)/.test(text)) return { text: 'உங்கள் சிகிச்சைக்கு தனிப்பட்ட மதிப்பீடு தேவை. AGAI சேவைகளை விளக்க முடியும்; அறிகுறிகளை மதிப்பிடவோ சிகிச்சையைப் பரிந்துரைக்கவோ முடியாது. உங்கள் கவலைகள் குறித்து மையத்துடன் பேசுங்கள்.', actions: [book, contact] }
  if (/சேவை|உதவி|மறுவாழ்வு|\b(services?|care|offer|help|rehab|rehabilitation)\b/.test(text)) return { text: `AGAI சேவைகள்: ${services.map(item => t(item.shortTitle)).join(', ')}. எதைத் தேர்ந்தெடுப்பது என்று தெரியாவிட்டால், முன்பதிவுப் படிவத்தில் உதவி தேவை என்பதைத் தேர்ந்தெடுங்கள்.`, actions: [{ label: 'View all services', href: '/services' }, book] }
  return { text: 'முன்பதிவு, சேவைகள், வழிகாட்டுதல் மற்றும் தொடர்பு விவரங்களில் உதவ முடியும். இந்தக் கேள்விக்கு உறுதிப்படுத்தப்பட்ட பதில் என்னிடம் இல்லை. மேலும் விவரங்களுக்கு மையக் குழுவைத் தொடர்புகொள்ளுங்கள்.', actions: [contact] }
}
