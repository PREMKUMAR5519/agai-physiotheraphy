import type { Service } from '../services-api'
import { approach, clinic, services as defaultServices } from '../content'

export type ChatAction = { label: string; href: string }
export type ChatReply = { text: string; actions?: ChatAction[] }

const book: ChatAction = { label: 'Book an appointment', href: '/#appointment' }
const contact: ChatAction = { label: 'Talk on WhatsApp', href: `https://wa.me/${clinic.whatsapp}` }

// Keyed by service id, so reordering services cannot attach the wrong reply.
// A service without an entry here (for example one added later) is matched by its own name.
const serviceTerms: Record<string, RegExp> = {
  'sports-injury': /\bsport|\bathlet|\binjury rehabilitation/,
  'strength-conditioning': /\bstrength|\bconditioning|\bspeed training/,
  orthopaedic: /\borthop/,
  neurological: /\bneuro|\bstroke\b/,
  'womens-wellness': /\bwomen|\bpostpartum|\bprenatal|\bpregnan/,
  'pelvic-floor': /\bpelvic/,
  geriatric: /\bgeriatric|\belderly|\bolder adult/,
}

function findService(text: string, services: readonly Service[]) {
  return services.find(service => serviceTerms[service.id]?.test(text) || text.includes(service.shortTitle.toLowerCase().replace(/’/g, "'")))
}

// Rules run top to bottom and the first match wins, so order matters:
// safety first, then specific intents, then broad keywords, then the fallback.
export function getChatReply(input: string, services: readonly Service[] = defaultServices): ChatReply {
  // Phone keyboards type curly apostrophes ("can’t"); match them like straight ones.
  const text = input.toLowerCase().replace(/[‘’]/g, "'").trim()
  if (/\b(emergency|urgent|chest pain|cannot breathe|can'?t breathe|(trouble|difficulty) breathing)\b/.test(text)) return {
    text: 'This automated guide cannot help with emergencies. If you need urgent medical help, contact local emergency services or go to the nearest emergency department.',
  }
  // Whole-message greetings only, checked early so "good morning" is not read as a question about hours.
  if (/^(hi|hello|hey|good (morning|afternoon|evening))( there)?[!.,\s]*$/.test(text)) return { text: 'Hello! I’m AGAI’s automated clinic guide. I can help you explore services, request an appointment, or find the clinic. What would you like to know?' }
  if (/\b(cancel|reschedule|change my appointment)\b/.test(text)) return {
    text: 'Please contact the clinic to change or cancel an appointment. This guide cannot access or update existing bookings.', actions: [contact],
  }
  if (/\b(fee|fees|cost|price|pricing|insurance|payment)\b/.test(text)) return {
    text: 'Please check consultation fees and payment details directly with the clinic. I don’t have a verified price list to share.', actions: [contact],
  }
  const wantsToBook = /\b(book|booking|schedule)\b/.test(text)
  if (!wantsToBook && /\bfirst (visit|appointment|session|time)\b|\bwhat (to|should i|do i) (expect|bring)\b/.test(text)) return {
    text: `Your first visit starts with a conversation. ${approach.map(step => step.text).join(' ')}`,
    actions: [{ label: 'About your first visit', href: '/about' }, book],
  }
  if (/\b(hours?|timings?|open|opening|closed?|closing|availability|slots?|sunday|saturday|weekends?|weekdays?|morning|afternoon|evening|today|tomorrow)\b/.test(text)) return {
    text: 'The clinic will confirm its hours and available appointment times with you. You can choose a preferred date and time in the booking form; these are preferences, not live slots.', actions: [book, contact],
  }
  if (wantsToBook || /\b(appointment|consultation)\b/.test(text)) return {
    text: 'Start with your details and the service you’re interested in, then choose a preferred date and time. “Book appointment” opens WhatsApp with your request. Send it there, and the clinic will confirm your visit.', actions: [book],
  }
  // Named services only; this guide does not select treatment from symptoms.
  const service = findService(text, services)
  if (service) return { text: `${service.title}\n\n${service.description}`, actions: [{ label: 'Explore this service', href: `/services#${service.id}` }, book] }
  if (/\b(where|address|location|located|directions|map|parking)\b/.test(text)) return {
    text: `You’ll find AGAI Physiotherapy Centre in ${clinic.address}. Use the map for directions, or call the clinic for help finding us.`,
    actions: [{ label: 'Get directions', href: clinic.mapsUrl }, { label: 'Call the clinic', href: `tel:${clinic.phone.replace(/[^+\d]/g, '')}` }],
  }
  if (/\b(doctor|founder|therapist|physio|rasathi|qualifications?|experience)\b|\bwho (is|runs|owns|founded|will)\b/.test(text)) return {
    text: `${clinic.founder} is AGAI’s founder, with an MPT in Sports Physiotherapy and over 10 years of clinical experience across India and the Middle East.`, actions: [{ label: 'Meet our founder', href: '/about#founder' }],
  }
  if (/\b(contact|call|phone|whatsapp|human|person|team|staff|email)\b/.test(text)) return {
    text: `You can reach the clinic at ${clinic.phone} or ${clinic.email}. For a personal conversation, continue on WhatsApp.`, actions: [contact, { label: 'Contact details', href: '/contact' }],
  }
  if (/\b(pain|symptom|diagnos|medicine|medication|exercise|treatment advice|hurt)\b/.test(text)) return {
    text: 'Your care needs an individual assessment. I can explain AGAI’s services, but I can’t assess symptoms or recommend treatment. Please speak with the clinic about your concerns.', actions: [book, contact],
  }
  if (/\b(service|services|care|offer|help me choose|not sure|rehab|rehabilitation)\b/.test(text)) return {
    text: `AGAI offers ${services.map(service => service.shortTitle).join(', ')}. Not sure where to start? Choose Help me choose in the booking form.`,
    actions: [{ label: 'View all services', href: '/services' }, book],
  }
  if (/\b(thanks|thank you)\b/.test(text)) return { text: 'You’re welcome. If you need anything else, I’m here to help with clinic information and your next step.' }
  return {
    text: 'I can help with appointments, services, directions, and clinic contact details. I don’t have a verified answer to that question. The clinic team can help with anything more specific.', actions: [contact],
  }
}
