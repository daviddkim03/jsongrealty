/* ==========================================================================
   API CONFIG — fill these in and the site comes alive.
   ==========================================================================

   This site is architected around the two most impactful APIs from the
   attached blueprint:

   1) SimplyRETS  — IDX / MLS listings (RESO Web API wrapper)
      Signup:  https://simplyrets.com/pricing
      Why:     One clean REST API across every MLS board; indexable URLs per
               listing (no iframes), huge SEO win vs. legacy KW-style sites.
      Demo:    simplyrets / simplyrets (Basic auth) hits a public sandbox —
               drop those in to preview without a paid account.

   2) Mapbox GL JS — geospatial search / map rendering
      Signup:  https://www.mapbox.com/
      Why:     Supports viewport-bounds loading + clustering per the blueprint;
               free tier is generous for a single-agent site.

   Optional future add-ons (all stubbed in listings.js):
      - Saleswise  — instant CMAs / AVMs
      - Showcase IDX — alternate IDX provider if SimplyRETS coverage gaps exist
      - OpenAI / Anthropic — powers the natural-language search bar

   After filling keys in, no build step is required — reload the page.
   ========================================================================== */

window.JSONG_CONFIG = {
  /* ----- Brand / contact (find-and-replace across HTML too) ----- */
  brand: {
    name: "JSong Realty",
    agent: "Joshua Song",
    brokerage: "Red 1 Realty",
    city: "Atlanta, GA",
    phone: "470-266-0046",
    email: "joshua@erichongrealty.com",
    instagram: "https://www.instagram.com/jsongrealty/",
    licenseNumber: "YOUR_GA_LICENSE_#_HERE",
  },

  /* ----- SimplyRETS (primary IDX) ----- */
  simplyRETS: {
    // Leave as the sandbox credentials to see demo listings immediately.
    // Swap to your paid creds when ready — no code changes required.
    username: "simplyrets",
    password: "simplyrets",
    baseUrl: "https://api.simplyrets.com",
    // Cap results for the homepage "featured" strip.
    featuredLimit: 3,
    // Cap results for the main search page before the user filters.
    defaultLimit: 12,
  },

  /* ----- Mapbox ----- */
  mapbox: {
    accessToken: "YOUR_MAPBOX_TOKEN_HERE", // pk.ey... from mapbox.com
    style: "mapbox://styles/mapbox/light-v11",
    atlantaCenter: [-84.388, 33.749],
    defaultZoom: 11,
  },

  /* ----- RentCast (AVM, public records, sale & tax history) -----
     Signup: https://app.rentcast.io/app/api  — free tier: 50 calls/month, no card required.
     The free tier is plenty for testing the UI; switch to a paid tier or proxy through
     your own server before going live. The site falls back to demo data when no key is set. */
  rentcast: {
    apiKey: "YOUR_RENTCAST_KEY_HERE",
    baseUrl: "https://api.rentcast.io/v1",
  },

  /* ----- Walk Score (walk / transit / bike scores) -----
     Signup: https://www.walkscore.com/professional/api-sign-up.php  — free tier: 5,000 calls/day.
     Note: the public Walk Score API may block browser CORS in some regions. If you see
     CORS errors, you'll need a tiny serverless proxy (Cloudflare Worker / Netlify Function). */
  walkscore: {
    apiKey: "YOUR_WALKSCORE_KEY_HERE",
  },

  /* ----- US Census ACS (zip-level demographics) -----
     No signup or key required for basic ACS variables. Optional key for higher rate limits:
     https://api.census.gov/data/key_signup.html */
  census: {
    apiKey: "", // empty is fine — only needed for very high traffic
    baseUrl: "https://api.census.gov/data/2022/acs/acs5",
  },

  /* ----- Optional ----- */
  saleswise: {
    apiKey: "YOUR_SALESWISE_KEY_HERE", // instant CMAs (alternative to RentCast)
    enabled: false,
  },

  llm: {
    // Used by the natural-language search bar. Proxy through your own server
    // in production — never ship this key in the browser.
    provider: "none", // "openai" | "anthropic" | "none"
    apiKey: "YOUR_LLM_KEY_HERE",
  },

  /* ----- Contact form ----- */
  contactForm: {
    // Drop in a Formspree / Getform / Basin endpoint. Until filled,
    // form submission logs to console and shows a friendly confirmation.
    endpoint: "YOUR_FORM_ENDPOINT_HERE", // e.g. https://formspree.io/f/xxxxxx
  },

  /* ----- Lead magnet (PDF guide email capture) -----
     Same idea as contactForm: post the email to a free service like
     Formspree, Getform, or ConvertKit. The PDF download triggers locally
     once the endpoint accepts the submission. */
  leadMagnet: {
    endpoint: "YOUR_FORM_ENDPOINT_HERE", // e.g. https://formspree.io/f/xxxxxx
  },

  /* ----- Downloadable PDF guides -----
     Drop the actual PDF into /assets/guides/ and update the path. The
     <form data-guide="buyer"> on /buyers/ keys into `guides.buyer` here. */
  guides: {
    buyer: {
      pdfPath: "../assets/guides/jsong-atlanta-buyers-guide.pdf",
      filename: "JSong-Atlanta-Buyers-Guide.pdf",
    },
    seller: {
      pdfPath: "../assets/guides/jsong-atlanta-sellers-guide.pdf",
      filename: "JSong-Atlanta-Sellers-Guide.pdf",
    },
  },
};
