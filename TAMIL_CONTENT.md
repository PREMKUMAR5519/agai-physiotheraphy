# Tamil content

Tamil is available for all six main pages: `/ta`, `/ta/about`, `/ta/services`, `/ta/blogs`, `/ta/book-appointment` and `/ta/contact`. These share the English forms, validation, submission logic and analytics milestones. Switching between equivalent English and Tamil pages retains the form state in memory; nothing is saved to browser storage. Reloading clears unsent input as before.

The header English / தமிழ் switch opens the equivalent page, retaining its query and fragment. Navigation, service links, breadcrumbs, booking CTAs and chat links retain the selected language. The URL is the language preference; opening an explicit English URL shows English. Tamil search terms work in the care finder, and service filters retain their stable IDs across languages. The chat has Tamil controls and keyword-based guidance for Tamil and English questions. Names, qualifications, contact details and the clinic address are retained from the CMS rather than transliterated speculatively.

Edit `src/tamil.json` for booking/contact wording and `src/tamil-main.json` for the other main pages and shared interface wording. English phrases are translation keys: when changing an English phrase, update its matching key. Unknown CMS service names fall back to their original text; add a reviewed Tamil translation when adding or renaming a service. Do not translate service IDs, phone numbers, email addresses, URL slugs or backend field names. The Tamil WhatsApp request and native validation messages are in `AppointmentSection.tsx` and `language.ts` respectively. Tamil chat replies are in `components/tamilChatReplies.ts`.

Keep Tamil wording patient-friendly and preserve the distinction between requesting a visit and a confirmed appointment. Have the clinic review new clinical terminology when content changes. Tamil text is stored as UTF-8; do not convert it to a legacy Tamil encoding.

Published articles and quoted Google reviews retain their original English wording, explicitly labelled as original-language content. Tamil article routes retain Tamil navigation; they are noindex and excluded from sitemaps and hreflang until full article translations exist. Unknown Tamil article URLs retain actual HTTP 404 handling in Vercel middleware. Do not present an untranslated article as a fully translated SEO alternate.

Each translated main page is prerendered with `lang="ta"`, its own title, description and canonical URL, reciprocal English/Tamil `hreflang` links, and a sitemap entry. No automatic language redirect is used. Analytics events continue to use their existing fixed, privacy-safe page categories, with no new personal data or language identifier.

Checks: `npx playwright test tests/tamil.spec.ts tests/booking-validation.spec.ts tests/form-analytics.spec.ts tests/contact-phone.spec.ts`, `npm run sitemap`, and `npm run build --ignore-scripts`. The build flag avoids refreshing the local CMS snapshot while checking code changes.
