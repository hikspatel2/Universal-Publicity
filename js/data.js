/* ==========================================================================
   data.js — all editable content lives here as GLOBAL variables.
   (Classic script, no ES modules, so the site works from file://)
   ========================================================================== */

/**
 * Portfolio images.
 * false = show generated placeholder artwork (site looks complete with no photos)
 * true  = load real photos from /assets/portfolio/<category>/<category>-<n>.jpg
 *         (falls back to the placeholder for any file that is missing)
 */
const USE_REAL_IMAGES = false;

/* --------------------------------------------------------------------------
   SITE INFO — REPLACE every placeholder with real details (see README checklist)
   -------------------------------------------------------------------------- */
const SITE = {
  name: 'Universal Publicity',
  url: 'https://www.your-domain.com/',           // REPLACE
  phoneDisplay: '+91 00000 00000',               // REPLACE
  phoneTel: '+917874113409',                     // REPLACE (used in tel: links)
  whatsapp: '917874113409',                      // REPLACE (country code + number, digits only)
  email: 'universalpublicity54@gmail.com',                // REPLACE
  address: 'Shop No. 00, Your Street, Your City, Gujarat 000000, India', // REPLACE
  hours: 'Mon – Sat: 10:00 AM – 7:00 PM',        // REPLACE
  // Google Maps embed. REPLACE with the "Embed a map" URL from Google Maps > Share.
  mapEmbed: 'https://www.google.com/maps?q=Gujarat%2C%20India&output=embed',
  social: {                                      // REPLACE with the real profile URLs
    instagram: 'https://www.instagram.com/universal_publicity_54?stkn=YW92ajB5bjF0a2hn',
    facebook: 'https://www.facebook.com/share/19BDdcusCH/',
    youtube: 'https://www.youtube.com/@universalpublicity54',
    linkedin: 'https://www.linkedin.com/'
  }
};

/* --------------------------------------------------------------------------
   PLACEHOLDER ARTWORK
   Small line-art glyphs (100x100 box) drawn on a teal gradient, per category.
   -------------------------------------------------------------------------- */
const GLYPHS = {
  'banner-media':
    '<rect x="8" y="26" width="84" height="36" rx="3"/><path d="M20 40h44M20 50h26"/><path d="M22 62v24M78 62v24"/>',
  'invitation-card':
    '<rect x="24" y="10" width="52" height="80" rx="4"/><circle cx="50" cy="36" r="9"/><path d="M36 58h28M40 68h20M44 78h12"/>',
  'canopy-tent':
    '<path d="M8 44L50 14l42 30z"/><path d="M18 44v42M82 44v42M50 44v42"/><path d="M8 86h84"/>',
  'auto-cycle-ads':
    '<circle cx="26" cy="72" r="12"/><circle cx="76" cy="72" r="12"/><path d="M26 72l14-32h28l8 32M40 40l-4-12h-12"/><rect x="44" y="46" width="22" height="14" rx="2"/>',
  'air-balloon':
    '<circle cx="50" cy="38" r="27"/><path d="M34 60l10 20h12l10-20"/><rect x="43" y="80" width="14" height="9" rx="1"/><path d="M50 11v54"/>',
  'business-card':
    '<rect x="8" y="24" width="62" height="40" rx="4"/><rect x="30" y="40" width="62" height="40" rx="4"/><path d="M42 54h26M42 64h14"/>',
  'rollup-standee':
    '<rect x="30" y="8" width="40" height="68" rx="2"/><path d="M20 88h60M50 76v12"/><path d="M38 24h24M38 34h16"/>',
  'logo':
    '<path d="M26 18v54h48V18" stroke-width="4"/><path d="M26 45l24 27 24-27M26 18l24 27 24-27" opacity=".6"/><circle cx="26" cy="18" r="5"/><circle cx="26" cy="72" r="5"/><circle cx="74" cy="72" r="5"/><circle cx="74" cy="18" r="5"/><circle cx="50" cy="72" r="5"/>'
};

const PLACEHOLDER_GRADIENTS = [
  ['#2F7378', '#146C71'],
  ['#1B8A90', '#0F5559'],
  ['#34989B', '#1B6B70'],
  ['#146C71', '#0B4448']
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Returns an SVG data URI that shows the category name, so the site looks complete before real photos exist. */
function makePlaceholder(slug, label, n, w, h) {
  label = escapeXml(label);
  const grad = PLACEHOLDER_GRADIENTS[(n + slug.length) % PLACEHOLDER_GRADIENTS.length];
  const s = (Math.min(w, h) * 0.46) / 100;             // glyph scale
  const gx = w / 2 - 50 * s;
  const gy = h * 0.4 - 50 * s;
  const fs = Math.round(Math.min(w, h) * 0.062);       // label font size
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + grad[0] + '"/><stop offset="1" stop-color="' + grad[1] + '"/></linearGradient></defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#g)"/>' +
    '<path d="M0 ' + h * 0.74 + ' C ' + w * 0.25 + ' ' + h * 0.58 + ', ' + w * 0.5 + ' ' + h * 0.92 + ', ' + w + ' ' + h * 0.66 +
    '" fill="none" stroke="#5FD0D0" stroke-opacity=".55" stroke-width="3"/>' +
    '<path d="M0 ' + h * 0.82 + ' C ' + w * 0.28 + ' ' + h * 0.68 + ', ' + w * 0.55 + ' ' + h + ', ' + w + ' ' + h * 0.76 +
    '" fill="none" stroke="#5FD0D0" stroke-opacity=".3" stroke-width="2"/>' +
    '<g transform="translate(' + gx + ' ' + gy + ') scale(' + s + ')" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
    (GLYPHS[slug] || '') + '</g>' +
    '<text x="' + w / 2 + '" y="' + h * 0.8 + '" text-anchor="middle" fill="#fff" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="' + fs + '">' + label + '</text>' +
    '<text x="' + w / 2 + '" y="' + (h * 0.8 + fs * 1.4) + '" text-anchor="middle" fill="#fff" fill-opacity=".8" font-family="Poppins, Arial, sans-serif" font-size="' + Math.round(fs * 0.72) + '">Sample image ' + n + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* --------------------------------------------------------------------------
   CATEGORIES + PORTFOLIO
   Slugs match the folders in /assets/portfolio/. Add or rename titles freely.
   `sizes` are the placeholder proportions [width, height] used for the masonry.
   -------------------------------------------------------------------------- */
const CATEGORIES = [
  {
    slug: 'banner-media', label: 'Banner Media',
    sizes: [[800, 450], [800, 560], [800, 450], [800, 640]],
    titles: ['Shop Opening Flex Banner', 'Festival Sale Hoarding', 'Event Stage Backdrop', 'Product Launch Banner',
             'Outdoor Hoarding Design', 'Inauguration Banner', 'Exhibition Wall Graphic', 'Seasonal Offer Banner']
  },
  {
    slug: 'invitation-card', label: 'Invitation Card',
    sizes: [[640, 880], [700, 900], [640, 800], [720, 960]],
    titles: ['Wedding Invitation Card', 'Engagement Invitation', 'Housewarming Card', 'Birthday Party Invite',
             'Corporate Event Invitation', 'Baby Shower Card', 'Festival Greeting Card', 'Inauguration Invite']
  },
  {
    slug: 'canopy-tent', label: 'Canopy Tent',
    sizes: [[800, 600], [800, 520], [800, 640]],
    titles: ['Printed Promotional Canopy', 'Market Stall Canopy', 'Event Branding Tent', 'Exhibition Canopy',
             'Outdoor Sales Tent', 'Roadside Promo Canopy', 'Fair Stall Canopy', 'Foldable Brand Tent']
  },
  {
    slug: 'auto-cycle-ads', label: 'Auto & Cycle Ads',
    sizes: [[800, 600], [800, 500], [800, 700]],
    titles: ['Auto Rickshaw Back Panel', 'Auto Hood Branding', 'Cycle Rickshaw Ad', 'Full Auto Wrap Design',
             'Local Campaign Auto Ad', 'Cycle Cart Branding', 'Auto Side Panel Ad', 'Festival Offer Auto Ad']
  },
  {
    slug: 'air-balloon', label: 'Air Balloon',
    sizes: [[700, 900], [800, 800], [720, 860]],
    titles: ['Inflatable Advertising Balloon', 'Sky Balloon Branding', 'Event Entrance Balloon', 'Launch Day Air Balloon',
             'Shop Front Balloon', 'Promotional Sky Dancer', 'Exhibition Balloon', 'Grand Opening Balloon']
  },
  {
    slug: 'business-card', label: 'Business Card',
    sizes: [[800, 533], [800, 600], [800, 800]],
    titles: ['Corporate Business Card', 'Minimal Visiting Card', 'Shop Owner Visiting Card', 'Two-side Printed Card',
             'Premium Textured Card', 'Startup Founder Card', 'Clinic Visiting Card', 'Event Planner Card']
  },
  {
    slug: 'rollup-standee', label: 'Roll-up Standee',
    sizes: [[600, 900], [640, 880], [600, 860]],
    titles: ['Product Roll-up Standee', 'Event Welcome Standee', 'Exhibition Roll-up Banner', 'Service Menu Standee',
             'Showroom Standee', 'Clinic Info Standee', 'Offer Promotion Standee', 'Corporate Roll-up']
  },
  {
    slug: 'logo', label: 'Logo',
    sizes: [[800, 800], [800, 600], [800, 800]],
    titles: ['Brand Logo Design', 'Monogram Logo', 'Agro Business Logo', 'Hardware Store Logo',
             'Clinic & Lab Logo', 'Event Company Logo', 'Consulting Firm Logo', 'Food Brand Logo']
  }
];

/**
 * Portfolio items: { id, category, title, client, image, placeholder, w, h }
 * `image` is the real photo path (used when USE_REAL_IMAGES = true).
 * Items are interleaved by category so the "All" view looks varied.
 */
const PORTFOLIO = (function () {
  const items = [];
  let id = 1;
  for (let n = 1; n <= 8; n++) {                      // 8 items per category at launch
    CATEGORIES.forEach(function (cat) {
      const size = cat.sizes[(n - 1) % cat.sizes.length];
      items.push({
        id: id++,
        category: cat.slug,
        title: cat.titles[n - 1],
        client: 'Client Name',                       // REPLACE per item
        image: 'assets/portfolio/' + cat.slug + '/' + cat.slug + '-' + n + '.jpg',
        placeholder: makePlaceholder(cat.slug, cat.label, n, size[0], size[1]),
        w: size[0],
        h: size[1]
      });
    });
  }
  return items;
})();

/* --------------------------------------------------------------------------
   CLIENTS — text wordmarks by default.
   To use a real logo add:  image: 'assets/clients/name.png'
   -------------------------------------------------------------------------- */
const CLIENTS = [
  { name: 'Svitch' },
  { name: 'R.V Furniture' },
  { name: 'Trident' },
  { name: 'Gravity Immigration Services' },
  { name: 'Shyam Neelkanth Arcade' },
  { name: 'EAO Tours' },
  { name: 'Unique Enterprise' },
  { name: 'Rudra Agro Tech' },
  { name: 'Madhav Agriculture' },
  { name: 'Madhav Hardware & Electric' },
  { name: 'Divine Event Management' },
  { name: 'Om Motors' },
  { name: 'Patidar Seeds' },
  { name: 'Relief Clinical Laboratory (RCL)' },
  { name: 'Unique Techno Lab LLP' },
  { name: 'Ashirwad Laboratory' },
  { name: 'Harit Agrotech' },
  { name: 'Shree Umiya Sales' },
  { name: 'Malav Enterprise' },
  { name: 'D Square Consulting' },
  { name: 'Uma Decorative' },
  { name: 'Jeet Corporation' },
  { name: 'FlavourQ' },
  { name: 'Hi-tech Hardware' },
  { name: 'Arrit Impex' },
  { name: 'R&T Designer Studio' },
  { name: 'Dwarkesh Infra Projects Pvt Ltd' },
  { name: 'Vinayak500' },
  { name: 'Shaktiman-Grimme' },
  { name: 'Madhuram Electronic' },
  { name: 'Little Finger' },
  { name: 'Parob Instant' },
  { name: 'DP Visa Plus' },
  { name: 'Mangalam' }
];

/* --------------------------------------------------------------------------
   TESTIMONIALS
   REPLACE with real client testimonials, names and businesses.
   -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  {
    quote: 'Excellent, working with Universal Publicity was great. Thanks to their knowledge and determination our website looks great and functions really well.',
    name: 'Client Name',
    business: 'Business'
  },
  {
    quote: 'I am really happy with your service, it is exceptional. When I have a question they answer it at once, they have more than an outstanding customer service.',
    name: 'Client Name',
    business: 'Business'
  }
];
