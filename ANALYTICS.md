# Form measurement

The site sends explicit GA4 events through the existing Google tag, targeting `G-HZHXQFCBF5` (the destination published by container `GTM-TWPLL6GG`). This does not require adding a duplicate GA4 event tag in GTM. Do not create both a direct event and a GTM forwarding tag for these same milestones.

| Event | Meaning |
| --- | --- |
| `booking_start` | First focus or change within an appointment form |
| `booking_details_complete` | Valid step-one details, service and consent; calendar step opens |
| `booking_whatsapp_handoff` | Validated final action attempts to open WhatsApp |
| `enquiry_start` | First focus or change within the contact form |
| `enquiry_submitted` | Contact API returned a successful response with `ok: true` |

Each milestone is emitted once per mounted form. Going back a step or clicking the final button repeatedly does not inflate the funnel. Leaving/reopening or reloading the page begins another attempt. No patient-specific tracking ID or persistent form data is introduced.

A WhatsApp handoff is **not** proof the message was sent, received, or booked. No `booking_confirmed` or `booking_request_submitted` event is emitted for this flow. The appointment workflow still hands off to WhatsApp; this change does not add an appointment database.

## Event data

Custom events carry only fixed event names, `form_location` (`home`, `booking_page`, `contact_page`) and `step` (1 or 2), plus explicit safe page metadata and destination/privacy settings. They contain no names, emails, phone numbers, notes, service selections, dates, time preferences, submission IDs, raw referrers, query strings, fragments or WhatsApp URLs. The helper does not accept form data as an argument.

The bootstrap initializes the Google queue before loading GTM, sets `user_data: null`, disables Google signals/ad personalization, defaults advertising storage/user-data/personalization consent to denied, and strips the initial page URL's query and fragment. It does not invent consent for analytics storage or replace a site's consent manager.

These are safeguards for the code-controlled events, not a guarantee about every tag configured remotely. Google's standard Analytics cookies/device/session data are separate from submitted form details.

## Google account checks before rollout

The public Google tag configuration inspected during implementation enabled automatic user-provided data, enhanced form measurement, history page views and site-search measurement. Account settings could not be changed through an authenticated Google Analytics connection during this task. Review them before rollout:

1. Disable automatic user-provided data collection for this clinic's Google tag; do not configure enhanced conversions from patient form fields.
2. Disable enhanced-measurement **Form interactions** for this stream to avoid confusing automatic `form_submit` attempts with the acknowledged `enquiry_submitted` event.
3. Disable automatic **Site search** collection: patients may enter symptoms or other private text into searches.
4. Review automatic history/page-view collection and any custom GTM tags so raw `service`, search, email or other query values and URL fragments are not forwarded. The custom funnel events already override page metadata; a global bootstrap setting alone is not proof that all remote/history tags honor it.
5. Do not enable DOM/form-field variables or full outbound URLs on these events. Never forward the WhatsApp `text` query parameter.

## Viewing results

After deployment, verify the five custom event names in GA4 Realtime/DebugView using an agreed test visit. Code tests intercept Google requests rather than sending artificial test conversions to production.

Register an event-scoped custom dimension named **Form location** with parameter `form_location` to break reports down by form placement. Event names themselves distinguish the steps; no patient identifiers are needed.

Create a funnel exploration:

1. `booking_start`
2. `booking_details_complete`
3. `booking_whatsapp_handoff`

Break down by Form location or device category. Create a separate contact funnel from `enquiry_start` to `enquiry_submitted`. If marking an event as a key event, name the business outcome accurately: “WhatsApp handoff” versus “Enquiry received.” Neither means “Confirmed appointment.”

Use event counts for milestone totals and user/session metrics for visitor-based conversion rates; they are not interchangeable. Analytics blocking, consent, closed tabs and connectivity can reduce recorded counts. Backend enquiry records remain the authoritative source for received enquiries.

## Validation

`npx playwright test tests/form-analytics.spec.ts` verifies both booking locations, milestone deduplication, invalid details, safe payloads even with sensitive URL query values, server-acknowledged contact success, failed/retried contact requests and analytics failures. Google tag/collection requests are blocked in these tests.

References:
- [Google: configuring and sending events](https://developers.google.com/tag-platform/gtagjs/configure)
- [Google: avoiding personally identifiable information](https://support.google.com/analytics/answer/6366371)
- [Google: privacy settings](https://developers.google.com/tag-platform/security/guides/privacy)
