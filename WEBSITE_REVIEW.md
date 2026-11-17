# AGAI website review — 17 November 2026

## Scope and evidence

Reviewed the current source and the public production website. Live checks covered Home, About, Services, Blogs, Book Appointment and Contact at 390px and 1440px widths; both articles currently in the production sitemap; nonexistent routes; mobile booking input validation; CMS startup behavior; response headers; and an automated axe-core 4.10.3 accessibility scan of the six main pages at 390px. Screenshots and machine-readable observations are in `tmp/site-audit/`.

The existing local Playwright suite ran 107 tests: **104 passed, 3 failed**. The service-refresh test passed on an isolated rerun. TypeScript and the production client build passed. Lint reported five warnings. This was not a full production build with content synchronization and prerendering.

No real enquiry was submitted and no WhatsApp message was sent. Backend delivery, admin authorization, database security, analytics/Search Console, real iOS Safari, physical-device keyboard behavior, and field Core Web Vitals were not verified. Browser screenshots are not proof that every lazy image loaded; existing local tests separately exercise visible image loading. No production source changes were made as part of this review.

## Assessment

The site has a coherent visual identity and working core navigation. The next investment should be booking reliability, mobile usability and clear patient information. A wholesale redesign is unnecessary. No site-wide outage was observed, but several issues deserve attention before sending substantial campaign traffic to the booking flow.

## P1 — address first

### 1. Floating chat covers the booking button on mobile — confirmed

At 390 × 844, scrolling the booking button near the bottom of the screen puts its right-hand portion underneath the fixed chat launcher. The button occupied x20–370/y780–832 while the launcher occupied x178–374/y770–828. The mascot adds further visual competition. See `tmp/site-audit/chat-overlap.png`.

**Change:** Collapse or hide the launcher while the booking form is in view or an input has focus. Retain a deliberate way to reopen assistance. Do not solve this only by moving it a few pixels: scrolling moves different controls behind it.

**Acceptance:** All form controls and both step actions remain usable at 320px and 390px, with the keyboard open and with text zoom. Check keyboard focus as well as pointer input. This is a confirmed overlap; a complete WCAG focus-obscuration determination requires additional keyboard testing.

### 2. CMS response blocks interactive startup — confirmed

`src/main.tsx` awaits `loadPublishedContent()` before importing/mounting the application. Public content requests have a four-second timeout. A deliberately delayed content response left the rendered mobile navigation button inert: clicking it did not open navigation while `#root` remained busy. An ordinary production content request also took about two seconds in one sample; that is a single request observation, not a speed benchmark.

**Change:** Make the prerendered snapshot interactive immediately and refresh content afterward through reactive state. Ensure an update does not discard entered form data or change an active selection unexpectedly.

**Acceptance:** Navigation and booking work immediately during a delayed or failed CMS request; updated content still arrives correctly without hydration errors.

### 3. Small text has insufficient contrast — automated finding

The mobile axe scan reported 45 affected elements on Home, six on Book Appointment and three on Contact, all under the contrast rule. These counts include repeated instances, not 54 different underlying defects. Examples: care-card labels at 3.85:1 and booking practitioner step captions at 4.15:1. Some findings are decorative FAQ numbering and should be assessed accordingly; meaningful labels need correction.

**Change:** Darken muted text consistently, review the 9–11px labels and captions, and enlarge useful information. Target at least 4.5:1 for ordinary text. Retest both pale and white surfaces.

**Acceptance:** Meaningful text passes contrast checks and remains comfortable to read on a physical phone. A clean automated scan alone is not a complete accessibility certification.

### 4. Booking has no recovery state after handing off to WhatsApp — confirmed design limitation

The final action calls `window.open()` and leaves the form on the same step. The site does not reserve a slot or receive delivery confirmation. Existing explanatory text correctly says the clinic must confirm, but the button still reads “Book appointment.” A blocked or abandoned handoff has no dedicated recovery screen.

**Change:** Label the final action “Continue in WhatsApp.” Show a request summary with “Open WhatsApp again,” “Copy request,” and a call alternative. Explicitly say the user must send the message and wait for clinic confirmation. Do not claim successful delivery without evidence.

**Acceptance:** Test normal handoff, blocked opening and return to the browser. If adding actual reservation/payment later, define availability, cancellation and confirmation requirements before implementation.

## P2 — correctness and confidence

### 5. Appointment phone validation accepts letters — confirmed live

Entering `abc1234567` allowed progress to the calendar. The booking validator only checks the number of digits after stripping everything else; it does not reject letters or enforce a sensible upper bound. The contact form already implements a stronger 7–15-digit rule with permitted formatting.

**Change:** Share a phone validator across both forms, retain international formatting, and associate errors with the field using `aria-invalid` and `aria-describedby`. Validate again on the server if appointments are stored there later.

### 6. Today offers already elapsed times — confirmed

The calendar permits today while morning slots remain selectable after the morning has passed. Dates and times also use the visitor device timezone rather than explicitly stating the clinic timezone. Slots are described as preferences, so this is not a false claim of live availability, but it creates avoidable coordination errors.

**Change:** Calculate in Asia/Kolkata, disable elapsed preferences and use clinic-provided working days/hours. Keep “Flexible” available. Do not invent clinic availability.

### 7. Opening hours are still missing — confirmed live

Contact shows “Clinic hours will be available soon.” Patients cannot confidently decide whether to call or visit.

**Change:** Publish owner-confirmed hours, appointment-only arrangements and holiday guidance. Use the same source for contact information, chat replies and structured data.

### 8. Nonexistent blog routes return HTTP 200 — confirmed live

`/blogs/audit-missing-page` returned 200 while displaying “Article not found.” The client correctly adds `noindex`, and a generic nonexistent path returns 404. The blog fallback rewrite creates the inconsistency.

**Change:** Return a genuine 404 for unknown articles while preserving direct access to valid newly published content. Coordinate routing with the CMS publishing/build process instead of blindly removing the fallback.

### 9. Booking links do not consistently use the dedicated page

Header and several content links point to `/#appointment`, whereas the footer links to `/book-appointment`. On mobile, the homepage anchor starts at the introductory/doctor content; the dedicated page puts the form first.

**Change:** Use the dedicated booking page for primary booking actions, carrying the selected service in the query string. Keep the homepage embedded form for people already browsing it. This is a conversion improvement, not a broken-link claim.

### 10. Privacy information is too brief for the data journey

The contact and booking forms contain short privacy messages, but no dedicated privacy link was found in the reviewed routes/footer. The two flows differ: one submits to a CMS endpoint; the other puts a request into WhatsApp.

**Change:** Add a plain-language privacy page based on the clinic's actual practices: what is collected, where it goes, retention, contact details and how patients can request help with their information. Link it beside the forms. This review makes no legal-compliance determination.

### 11. Test suite needs stabilization

Two failures are selector ambiguity: duplicated About headings and multiple `role=status` elements during a services outage. The service-refresh test failed in the full run and passed alone, indicating a timing-sensitive test that needs investigation rather than proving live refresh is broken.

**Change:** Scope assertions to the intended region, wait for the expected service count before single-element assertions, mock intended CMS states consistently, and repeat full-suite runs to establish stability. Add regression coverage for the confirmed booking problems.

## Page-by-page improvements

| Page | What works | What would improve it |
| --- | --- | --- |
| Home | Recognizable branding, service discovery by patient concern, testimonials, multiple contact routes | Reduce repeated explanations and lengthy stacked cards on mobile; make the principal action a direct booking link; quiet the chat widget during tasks |
| About | Founder credentials and clinic context | First-visit guidance is repeated across sections; consolidate it and prioritize clinician-approved experience, actual clinic imagery and practical visit information |
| Services | Filters, deep links and service preselection are covered by existing tests | Make “who this helps,” what assessment involves and the next action easy to scan; consider separate substantive service pages only when enough useful content exists |
| Booking | Two steps, optional email, flexible date, consent, and details retained when moving backward | Fix validation, past times, mobile overlap and WhatsApp handoff; simplify “Schedule Your Clinical Appointment” to “Request an appointment” |
| Contact | Phone, WhatsApp, directions, validation and retry-friendly error handling | Publish hours and expected response time; verify actual enquiry arrival with an agreed test; make “Sending enquiry?” read “Sending enquiry…” |
| Blogs | Both published articles load, have matching canonicals and working table-of-contents anchors | Add clinician author/reviewer and publication/update dates; develop useful original articles with appropriate sources rather than filler |
| Footer | Useful navigation and contact links | Add hours, practical location details and privacy link; keep presentation concise on mobile |

## Further improvements, after the above

- Add confirmed first-visit logistics: duration, what to bring, parking, accessibility and fees or how to obtain a fee estimate.
- Consider Tamil content if it reflects the clinic's audience and can be maintained accurately.
- Track booking starts, step completion and WhatsApp handoff separately; a handoff is not a confirmed appointment. Keep names, phone numbers and notes out of analytics events.
- Measure real performance before adding more visual features. The client production build succeeded; generated gzip output was roughly 89KB for the entry bundle, 27KB for App and 7KB for metadata, plus CSS. Investigate startup dependency ordering and duplicated stylesheet content before speculative optimization.
- Review response-header hardening: HSTS is present; CSP, X-Content-Type-Options and an explicit Referrer-Policy were not present in the sampled homepage response. Their absence alone does not establish a vulnerability. Introduce CSP gradually and test maps, images and CMS connections.
- Improve mobile reading comfort: booking inputs are 14px and some captions are 9–11px. Assess 16px input text on actual iOS Safari; autozoom was not tested here.
- Remove repeated first-visit content on About and add a capture date to the already-labeled Google rating snapshot.

## Recommended order

1. Prevent chat/form overlap; improve WhatsApp handoff and phone validation.
2. Remove the CMS gate on interactivity and fix meaningful low-contrast text.
3. Publish hours, correct date/time preferences and unify booking links.
4. Fix blog HTTP status handling, stabilize tests and add privacy information.
5. Improve content and measurement, then reassess performance and conversion with actual data.

## References and supporting files

- [Google: crawling errors and soft 404s](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C: focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- `tmp/site-audit/results.json`: live route, response and viewport observations.
- `tmp/site-audit/probes.json`: accessibility findings, validation and HTTP observations.
- `tmp/site-audit/final-checks.json`: published articles, overlap and slow-CMS reproduction.
- `tmp/site-audit/chat-overlap.png`: mobile booking button covered by chat.

This is an evidence-based review of the inspected version, not a guarantee that every possible browser, user input, backend condition or future content change is defect-free.
