AGAI PHYSIOTHERAPY CENTRE
Brand guidelines and asset library / Version 1.1

START HERE
Read AGAI-Brand-Guide.pdf for layout rules and worked examples. Open
preview.html for an offline asset library. Website implementation examples
are below. Both finalized logo files are retained as supplied in assets/.

1. LOGO SELECTION
Horizontal: use in wide placements such as desktop mastheads, A4 letterheads,
landscape documents and signs. Recommended minimum padded-canvas width:
400 CSS px on screen or 100 mm in print. If that width is unavailable, choose
the shield with adjacent readable centre-name text instead of shrinking the
full lettering below a useful size.

Stacked: use for portrait layouts, document covers and larger centered brand
placements. Minimum padded-canvas width: 320 CSS px or 70 mm in print.
Emblem: use for avatars, compact navigation and app icons. Minimum 48 CSS px
or 12 mm in print. The 16/32/48 px favicon files are a small-size exception.
At icon sizes the runner and leaf are a recognition cue, not fine detail.

Choose the layout for the available space. Do not retype the custom wordmark,
move the tagline, change the shield-to-name relationship or combine the
stacked and horizontal wordmarks in the same immediate area.

2. CLEAR SPACE AND BACKGROUNDS
Define H as the height of the visible gold shield. Keep clear space x = H/10
around the outermost visible artwork on every side. Measure from the visible
shield, letters and decorative lines, not the SVG page. The padded deployment
exports include at least this amount. The exact master files retain their
original canvases; add the margin yourself when using a master.

Use white as the default background. A quiet pale surface is suitable when
all blue and green lettering stays distinct. On dark colors or photographs,
place the full-color mark on a white panel with the same clear space. Leave
the original gradients inside the shield. Do not flatten the gold, recolor
the runner, add shadows or outline the logo.

3. COLOR
Logo blue #0558AD / RGB 5,88,173: primary actions, links, principal emphasis.
Logo green #007C2C / RGB 0,124,44: supporting emphasis and labeled status.
Gold #DCA51E / RGB 220,165,30: small accents, rules and selected highlights.
Lime #87DD00 / RGB 135,221,0: sparing decorative highlights.
Ink #153B35 / RGB 21,59,53: headings and body text.
Muted #526762 / RGB 82,103,98: secondary text; not lower-opacity body copy.
White #FFFFFF: default page and logo background.
Surface #F3F8F5: section backgrounds.
Gold and lime are flat supporting colors outside the logo. They do not
replace its individual gradient stops. Use white text on blue or green;
use ink text on gold or lime. Never rely on color alone to communicate status.
Exact measured contrast ratios are in web/tokens.json and the PDF guide.

4. TYPOGRAPHY
Inter is the website and document typeface, with Arial as a fallback.
Use 400 for reading, 600 for controls and 700 for headings. Use sentence case
for interface labels and headings; preserve capitals inside the logo.
H1: 56 px desktop / 36 px mobile, 700 weight, 1.1 line height, -0.035em.
H2: 36 px desktop / 28 px mobile, 700 weight, 1.2 line height, -0.025em.
H3: 24 px, 700 weight, 1.3 line height.
Body: 16 px, 400 weight, 1.6 line height. Lead paragraph: 20 px / 1.5.
Controls: 16 px, 600 weight. Captions: 14 px / 1.5.
Keep reading columns at about 60-70 characters. Use bold for emphasis and
underlined blue text for links; do not use letter spacing in body copy.
The supplied custom logo lettering stays as outlines and needs no font.

5. WEBSITE SETUP
Copy brand-kit/ to your site's public directory without rearranging it.
Use web/head-snippet.html for stylesheet and icon links. Adjust /brand-kit/
if the site is served from a different URL path. Add class="agai-theme" to
the body or a wrapper. brand.css loads the bundled font from ../fonts/.

Desktop horizontal image:
<img class="agai-horizontal-logo"
     src="/brand-kit/assets/agai-horizontal-800.webp"
     srcset="/brand-kit/assets/agai-horizontal-800.webp 800w,
             /brand-kit/assets/agai-horizontal-1600.webp 1600w"
     sizes="400px" width="1589" height="512"
     alt="AGAI Physiotherapy Centre">

For narrow layouts, use assets/agai-emblem-128.webp at 48-64 CSS px alongside
the centre name as live text. Give the image alt="" when that adjacent text
already provides its name. Give a logo-only home link the accessible name
"AGAI Physiotherapy Centre - home". Do not distort images to fixed heights;
always keep height:auto when changing width.

Use a maximum content width of 1120 px, 32 px desktop side gutters and 20 px
mobile gutters. Space elements on an 8 px rhythm. Controls should be at least
48 px high, with a visible focus outline. Use the filled blue button for
the main action and an outlined blue button for a secondary action. Form
fields need persistent labels; placeholders are examples, not labels.
The supplied CSS is a starting point; verify real content at narrow widths,
200% zoom, with keyboard navigation and with the final contrast pairings.

6. PRINT AND EVERYDAY MATERIALS
Use SVG for printers and layout applications that support it. Keep an exact
master with the job. For A4 letters, allow 20 mm page margins and a horizontal
logo at least 100 mm wide. Keep contact information as separate readable
text; never bake it into the logo.
For A6 appointment cards, leave 12 mm page margins. Use a 100 mm horizontal
logo when space permits, then clear Name / Date / Time fields. Smaller items
should use the emblem with readable centre-name text.
For square profile images use the 1080 px avatar. Keep important detail away
from corners because services may crop the image to a circle. Use the
1200 x 630 sharing image for link previews. These files contain no address,
phone number, service claims or unverified clinic details.
All supplied colors are RGB. Ask the printer to convert using the intended
paper/profile and provide a proof. There is no universal CMYK or Pantone
equivalent for the metallic gradient. Do not treat the guide as a spot-color
specification. Use PNG at sufficient resolution if SVG is unsupported.

7. WRITING AND IMAGES
Use the full name "AGAI Physiotherapy Centre" on first mention. "AGAI" is
suitable after the name is established. Keep instructions specific:
"Bring any relevant reports to your appointment" is more useful than a
general motivational statement. Publish a booking action only when its
actual destination works. Avoid guarantees of recovery or unsupported
superlatives. Check practitioner names, qualifications, hours and contact
details against the centre's own information before publishing.
For photography, use real premises, practitioners or consented patient
images with natural lighting and a clear subject. Crop around faces and
important movement detail. Put text on a quiet surface beside a photo,
rather than over busy clinical scenes.

8. FILES
assets/agai-master.svg: exact copy of finalized stacked source.
assets/agai-horizontal-master.svg: exact copy of supplied horizontal source.
assets/agai-logo.svg: padded stacked deployment export.
assets/agai-horizontal.svg: padded horizontal deployment export.
assets/agai-logo-1280.png / -2560.png: transparent stacked raster.
assets/agai-logo-640.webp / -1280.webp: lossless website versions.
assets/agai-horizontal-1600.png / -3200.png: transparent horizontal raster.
assets/agai-horizontal-800.webp / -1600.webp: lossless website versions.
assets/agai-emblem.svg / -512.png / -128.webp / -512.webp: shield assets.
assets/agai-avatar-1080.png: square avatar on white.
assets/agai-social-1200x630.png: link-sharing image on white.
web/favicon.svg / favicon.ico: browser icons; ICO includes 16,32,48 px.
web/apple-touch-icon.png: 180 px Apple home-screen icon.
web/icon-192.png / icon-512.png: future app icon exports.
web/brand.css: CSS variables, typography, buttons, fields and logo helpers.
web/tokens.json: matching machine-readable design values.
web/head-snippet.html: ready-to-copy head elements; set real social URL.
fonts/InterVariable.woff2: normal-style variable web font, weights 100-900.
fonts/InterVariable.ttf: desktop font container with the same typeface.
fonts/OFL-Inter.txt: license; keep it with redistributed fonts.
manifest.json: source and asset checksums, conversion notes and final checks.

SOURCES
Stacked artwork: final-logo.svg, supplied and finalized by the owner.
Horizontal artwork: final-logo-horizontal.svg, supplied by the owner.
Inter: https://rsms.me/inter/
Font license: https://github.com/rsms/inter/blob/master/LICENSE.txt
Contrast reference: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
