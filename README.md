# Universal Publicity — Website

A one-page, mobile-first website for a design, printing and advertising
agency. Plain HTML5, CSS3 and vanilla JavaScript — no frameworks, no build
step. Opens directly from `index.html`, including via `file://`.

## Run it

1. Double-click `index.html`, or right-click → Open with → your browser.
2. To develop with live-reload, serve the folder instead of using `file://`
   (optional): `npx serve .` or `python3 -m http.server`, then open
   `http://localhost:PORT`.

## Folder structure

```
index.html
css/style.css      All styling, design tokens in :root
js/data.js         Site info, portfolio, clients, testimonials
js/i18n.js         English + Gujarati text dictionaries
js/main.js         All interactivity
assets/logo.svg    Standalone brand mark
assets/portfolio/  Drop real photos here (see "Adding real photos")
assets/clients/    Drop real client logos here (optional)
```

## Editing content

- **Text on the page** (headlines, descriptions, buttons): edit the English
  values in `js/i18n.js` under the `en` object. The Gujarati translations
  are in the `gu` object further down — every `en` key has a matching `gu`
  key; both must stay in sync.
- **Business details** (phone, WhatsApp, email, address, hours, map,
  social links): edit the `SITE` object at the top of `js/data.js`.
- **Portfolio items**: edit `PORTFOLIO` in `js/data.js` — one entry per
  card (`title`, `client`, `category`). Categories are defined in
  `CATEGORIES` just above it.
- **Client list**: edit the `CLIENTS` array in `js/data.js`.
- **Testimonials**: edit the `TESTIMONIALS` array in `js/data.js`.
- **Stats in the hero** ("500+ Projects" etc.): edit the `data-count` and
  `data-suffix` attributes directly in `index.html` (search for `class="stat"`).

## Adding real photos

By default the site shows generated placeholder artwork (a teal graphic with
the category name) so it looks complete before you have real photos.

1. Open `js/data.js` and set `USE_REAL_IMAGES = true`.
2. Add your photos into the matching folder under `assets/portfolio/`,
   named exactly `<category-slug>-<n>.jpg` — e.g.
   `assets/portfolio/banner-media/banner-media-1.jpg`,
   `assets/portfolio/banner-media/banner-media-2.jpg`, and so on, up to 8
   per category. (Different extension? Update the `image` path built in
   `js/data.js`, in the `PORTFOLIO` section, to match.)
3. Any image that's still missing automatically falls back to the
   placeholder, so you can add real photos gradually.
4. To also replace the hero's floating collage and the client logos, add
   files under `assets/clients/` and reference them from the `CLIENTS`
   array in `js/data.js` (`image: 'assets/clients/yourfile.png'`).

## Setting up the enquiry form

Open `js/main.js` and find `FORM_ENDPOINT` near the top:

```js
var FORM_ENDPOINT = '';
```

- **Leave it empty** and the form opens WhatsApp with the enquiry
  pre-filled — works with zero setup, using the `whatsapp` number in
  `js/data.js`.
- **Formspree**: create a form at formspree.io, paste its endpoint URL in
  (e.g. `https://formspree.io/f/xxxxxxx`).
- **Google Apps Script / EmailJS**: paste the endpoint your script exposes;
  it must accept a JSON POST and return a success/error status.

## WhatsApp number

Set it in `js/data.js`:

```js
whatsapp: '910000000000',   // country code + number, digits only, no + or spaces
```

## Hosting

Any static host works, since there's no build step:

- **Netlify**: drag-and-drop this folder onto app.netlify.com/drop, or
  connect a Git repo.
- **GitHub Pages**: push this folder to a repo, enable Pages in the repo
  settings, pointing at the root.
- **Any web host**: upload the whole folder via FTP/cPanel so that
  `index.html` sits at the domain root (or in the subfolder you want the
  site to live in).

## Language toggle

The header's EN / ગુજ buttons switch languages instantly and remember the
choice in the visitor's browser (`localStorage`). Every Gujarati string was
machine-translated from the brief — a native speaker should proofread
`js/i18n.js` before launch, especially the form and error messages.

---

## Placeholder checklist — replace before launch

**Business details** (`js/data.js` → `SITE`)
- [ ] Phone number (`phoneDisplay`, `phoneTel`)
- [ ] WhatsApp number (`whatsapp`)
- [ ] Email address
- [ ] Street address
- [ ] Working hours
- [ ] Google Maps embed URL (`mapEmbed`) — get this from Google Maps →
      Share → Embed a map
- [ ] Social links (Instagram, Facebook, YouTube, LinkedIn)

**SEO / metadata** (`index.html` `<head>`)
- [ ] Real domain in `<link rel="canonical">`, Open Graph and Twitter tags
- [ ] An `assets/og-image.jpg` (1200×630px) for social share previews
- [ ] The `LocalBusiness` JSON-LD block — name, address, phone, hours,
      social links (mirrors the `SITE` object)
- [ ] Google Analytics 4 snippet, if used (commented out in `<head>`)

**Content**
- [ ] Hero stats: "500+ Projects", "35+ Happy Clients", "8+ Ad Formats"
      (`data-count` attributes in `index.html`)
- [ ] About section paragraph (`about.p` in `js/i18n.js`)
- [ ] Testimonials — real client quotes, names and businesses
      (`TESTIMONIALS` in `js/data.js`)
- [ ] Portfolio photos (see "Adding real photos" above) and each item's
      `client` field
- [ ] Client logos, if you want images instead of text wordmarks
      (`CLIENTS` in `js/data.js`)
- [ ] Gujarati translations — proofread by a native speaker
      (`gu` object in `js/i18n.js`)

**Form**
- [ ] `FORM_ENDPOINT` in `js/main.js`, unless using the WhatsApp fallback
