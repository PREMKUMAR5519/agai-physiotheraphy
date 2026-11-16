import { expect, test } from '@playwright/test'
import { getChatReply } from '../src/components/chatReplies'
import { services } from '../src/content'

// Pure rule checks: no browser needed. Each row is a question a visitor might
// type and a phrase that only the correct reply contains.
const cases: [question: string, expected: string][] = [
  ['Good morning', 'automated clinic guide'],
  ['good evening!', 'automated clinic guide'],
  ['hello', 'automated clinic guide'],
  ['What services are available?', 'AGAI offers'],
  ['What services do you offer?', 'AGAI offers'],
  ['What happens on my first visit?', 'starts with a conversation'],
  ['What should I bring?', 'starts with a conversation'],
  ['How do I book my first appointment?', 'opens WhatsApp'],
  ['How do I book an appointment?', 'opens WhatsApp'],
  ['Who can help with pelvic floor weakness?', 'Pelvic floor rehabilitation'],
  ['I have knee pain after a sports injury', 'Sports injury prevention'],
  ['Do you help after a stroke?', 'Neurological rehabilitation'],
  ['Who is the physio here?', 'founder'],
  ['I can’t breathe', 'cannot help with emergencies'],
  ["I can't breathe", 'cannot help with emergencies'],
  ['I have chest pain', 'cannot help with emergencies'],
  ['Are you open on Sunday?', 'not live slots'],
  ['What are your opening hours?', 'not live slots'],
  ['Do you treat back pain?', 'individual assessment'],
  ['Where is the clinic?', 'You’ll find AGAI'],
  ['Contact the clinic team', 'You can reach the clinic'],
  ['I need to reschedule', 'change or cancel'],
  ['What are the fees?', 'verified price list'],
  ['Thank you', 'You’re welcome'],
  ['Can you arrange a taxi?', 'verified answer'],
]

for (const [question, expected] of cases) {
  test(`chat reply: ${question}`, () => {
    expect(getChatReply(question).text).toContain(expected)
  })
}

test('every service is found by its own name and links to its own section', () => {
  for (const service of services) {
    const reply = getChatReply(`Tell me about ${service.shortTitle}`)
    expect(reply.text, service.id).toContain(service.title)
    expect(reply.actions?.[0].href).toBe(`/services#${service.id}`)
  }
})
