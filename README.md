# AGAI Physiotherapy Centre

A responsive, three-page React + TypeScript website using the supplied AGAI brand kit and client content.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm. The project was verified with Node 22.21.1.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run build       # TypeScript checks and production output in dist/
npm run preview     # Local production preview
npm run lint        # Oxlint
npm run test:e2e    # Browser regression tests
```

Browser tests use installed Microsoft Edge on Windows. On other systems, run `npx playwright install chromium` once. The test runner starts and stops its own Vite server on port 5186. Test artifacts are ignored by Git.

## Pages

| URL | Content and behaviour |
| --- | --- |
| `/` | Hero, service previews, care approach, founder profile and qualifications, professional timeline, FAQs, contact prompt. |
| `/services` | All seven services, URL-based category filters, individual section anchors and enquiry links. |
| `/contact` | Contact channels, location and hours, enquiry preparation, draft copy/download, and FAQs. |
| Other URLs | A page-not-found view with a return-home link. |

Shared navigation and footer link all pages. Browser back/forward, direct route reloads, page titles, descriptions and keyboard navigation are supported. Service enquiry links preselect the relevant service on Contact.

## Contact activation

The supplied `basic.txt` is empty. Phone, WhatsApp, email, address, directions URL and opening hours are intentionally unfilled in `src/content.ts`.

Update the `clinic` object with verified values:

- `phone`: display number including country code; the call link is derived automatically.
- `whatsapp`: international number with country code, digits only.
- `email`: clinic email address.
- `address`: full clinic address.
- `mapsUrl`: verified directions/map URL.
- `hours`: actual opening hours as readable text.

The contact page shows availability messages while these values are empty. It creates an **unsent draft** only. Visitors can copy or download it; the UI never claims an enquiry was submitted or an appointment confirmed. Once email or WhatsApp is provided, the draft exposes links to those apps. The visitor still sends the message in their chosen app.

There is no server-side enquiry storage, email delivery API, booking system or database. Form contents are held in component memory only and are not saved to localStorage or transmitted to a backend. Navigating away or reloading discards them. A direct-submit workflow would require a configured delivery provider/backend.

## Project structure

- `src/App.tsx`: route definitions, page metadata, anchor scrolling and not-found view.
- `src/components/Layout.tsx`: shared header, mobile navigation and footer.
- `src/components/UI.tsx`: shared icons, headings, FAQs and contact banner.
- `src/pages/`: Home, Services and Contact page components.
- `src/content.ts`: clinic configuration, services, care approach and homepage FAQs.
- `src/App.css`: responsive layout and component styles.
- `src/index.css`: global foundations.
- `public/brand-kit/`: complete unchanged kit, including local Inter font and its license.
- `public/images/movement-hero.png`: generated artistic movement illustration.
- `tests/website.spec.ts`: browser regression coverage.

React Router 7.18.5 is compatible with the installed Node runtime; the current v8 release requires a newer Node version. React 19.3.1 and Vite 8.3.5 remain in use.

## Brand and content

Brand assets came from `C:\VolumeD\personal\New folder\brand-kit`. Keep the included font license when redistributing assets. The desktop horizontal logo remains at 400 CSS pixels; compact layouts use the emblem with readable centre-name text. Fonts and imagery are self-hosted.

Reviewed `founder.txt`, `our-services.txt`, the handwritten requirements image and empty `basic.txt` in `C:\VolumeD\personal\New folder\data-from-client`. Service descriptions expand the supplied categories using the founder's care approach. The experience figure refers to the founder, not the age of the clinic. No testimonials, patient photographs, contact details or opening hours were invented.

## Build and hosting

`npm run build` outputs static assets to `dist/`. The host must serve `index.html` for application routes such as `/services` and `/contact` while serving existing assets normally; otherwise direct route requests may return a host-level 404. Configure an SPA fallback on the chosen host.

For deployment under a subdirectory, set Vite's `base` in `vite.config.ts`. BrowserRouter and application asset paths use this base. The unchanged standalone brand-kit preview may assume root hosting. Page metadata is updated in the browser; server-side rendering and prerendering are not configured.

## Verification

Twenty browser checks cover the three pages at 320, 390, 768 and 1440 px, asset loading, runtime errors, navigation/history, direct route refreshes, filters, deep links, preselected services, mobile navigation, keyboard FAQ interaction, required fields, whitespace validation, draft generation, download/copy, clipboard fallback, stale-draft clearing and the not-found route. The production build and TypeScript checks also pass. Desktop and mobile layouts were visually reviewed.

## Illustration provenance and prompt

Generated with the built-in image generation tool. Final project asset: `public/images/movement-hero.png`. The original generated file is preserved outside the project. The illustration is displayed as artwork rather than clinical photography.

Final generation prompt:

> Use case: stylized-concept. Asset type: a premium physiotherapy website hero illustration, square 1024 x 1024 composition. Create an elegant editorial 3D clay sculpture of a human figure in a natural forward running stride, entire body visible, anatomically coherent limbs, smooth matte deep cobalt blue #0558AD surface, abstract faceless features, gender neutral athletic adult proportions. A single broad sculptural green #007C2C ribbon loops behind the runner like an organic leaf/movement arc, one fine warm gold accent curve. Sculpture sits visually on an off-white pale sage #F3F8F5 background, subtle soft floor shadow, warm daylight from upper left, tactile matte surfaces, sophisticated restrained rehabilitation and movement brand aesthetic, large figure centered occupying 80 percent of canvas, plenty of clean breathing space. It is clearly an artistic illustration not a real patient or anatomical medical diagram. No text, no logos, no watermark, no UI, no extra people, no equipment, no gradients in background, no neon, no glowing effects.

