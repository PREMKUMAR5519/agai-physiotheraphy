// This API deliberately accepts no form values, URLs, service names or identifiers.
type FormLocation = 'home' | 'booking_page' | 'contact_page'
type FormEvent = 'booking_start' | 'booking_details_complete' | 'booking_whatsapp_handoff' | 'enquiry_start' | 'enquiry_submitted'
const measurementId = 'G-HZHXQFCBF5'
const pages = {
  home: { path: '/', title: 'AGAI home' },
  booking_page: { path: '/book-appointment', title: 'Request an appointment' },
  contact_page: { path: '/contact', title: 'Contact AGAI' },
} as const

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function createFormTracker(location: FormLocation) {
  const sent = new Set<FormEvent>()
  return (event: FormEvent) => {
    if (sent.has(event) || typeof window === 'undefined') return
    // Once per mounted form attempt; no patient-linked ID or persisted data.
    sent.add(event)
    const page = pages[location]
    try {
      window.gtag?.('event', event, {
        send_to: measurementId,
        form_location: location,
        step: event === 'booking_whatsapp_handoff' ? 2 : 1,
        page_location: `${window.location.origin}${page.path}`,
        page_title: page.title,
        page_referrer: '',
        user_data: null,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
    } catch {
      // Analytics must never prevent validation, submission or the WhatsApp handoff.
    }
  }
}
