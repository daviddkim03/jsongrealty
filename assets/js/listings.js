/* ==========================================================================
   listings.js — SimplyRETS (IDX) + Mapbox integration
   --------------------------------------------------------------------------
   Loaded on:  index.html (featured strip), listings/index.html (search grid
               + map), listings/sample-property/index.html (related).

   Core idea from the blueprint: do NOT use iframes. Hit the RESO Web API
   directly so every listing gets an indexable URL and a real DOM for SEO.

   API docs:   https://docs.simplyrets.com/api/
   Default creds in api-config.js are the public SimplyRETS sandbox — swap
   in your paid creds when ready.
   ========================================================================== */

(function () {
  "use strict";
  const CFG = window.JSONG_CONFIG || {};

  /* ---------- Compute relative path to property page (relative-path-safe) ---------- */
  function propertyLinkBase() {
    // Read the path to where this script is loaded (assets/js/listings.js)
    // and compute the relative path from the current document to the
    // /listings/sample-property/ folder.
    const scripts = document.getElementsByTagName("script");
    for (const s of scripts) {
      const src = s.getAttribute("src") || "";
      if (src.indexOf("listings.js") !== -1) {
        // src looks like: "assets/js/listings.js" or "../assets/js/listings.js" etc.
        // The prefix (everything before "assets/") is the site root from here.
        const idx = src.indexOf("assets/js/listings.js");
        const rootPrefix = idx >= 0 ? src.substring(0, idx) : "";
        return rootPrefix + "listings/sample-property/index.html";
      }
    }
    return "listings/sample-property/index.html";
  }

  /* ---------- Auth header helper ---------- */
  function authHeader() {
    const u = CFG.simplyRETS?.username || "";
    const p = CFG.simplyRETS?.password || "";
    return "Basic " + btoa(u + ":" + p);
  }

  /* ---------- Fetch listings ---------- */
  async function fetchListings(params = {}) {
    if (!CFG.simplyRETS) return { ok: false, error: "missing-config", data: DEMO_LISTINGS };
    const qs = new URLSearchParams(params).toString();
    const url = `${CFG.simplyRETS.baseUrl}/properties${qs ? "?" + qs : ""}`;
    try {
      const res = await fetch(url, { headers: { Authorization: authHeader() } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { ok: true, data };
    } catch (err) {
      console.warn("[listings] fetch failed, falling back to demo data:", err);
      return { ok: false, error: err.message, data: DEMO_LISTINGS };
    }
  }

  /* ---------- Demo fallback with real Unsplash photography ---------- */
  const DEMO_LISTINGS = [
    {
      mlsId: "DEMO-001",
      listPrice: 749000,
      property: { bedrooms: 4, bathsFull: 3, area: 2840, type: "Single Family" },
      address: { streetNumberText: "1240", streetName: "Piedmont", streetSuffix: "Ave NE",
                 city: "Atlanta", state: "GA", postalCode: "30309" },
      photos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"],
      remarks: "Midtown craftsman with a reimagined kitchen, screened porch, and two-car garage.",
      geo: { lat: 33.789, lng: -84.379 },
    },
    {
      mlsId: "DEMO-002",
      listPrice: 1245000,
      property: { bedrooms: 5, bathsFull: 4, area: 3910, type: "Single Family" },
      address: { streetNumberText: "88", streetName: "Virginia", streetSuffix: "Highland",
                 city: "Atlanta", state: "GA", postalCode: "30306" },
      photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"],
      remarks: "Renovated Va-Hi bungalow with a chef's kitchen and full-finished basement.",
      geo: { lat: 33.786, lng: -84.354 },
    },
    {
      mlsId: "DEMO-003",
      listPrice: 525000,
      property: { bedrooms: 3, bathsFull: 2, area: 1980, type: "Condo" },
      address: { streetNumberText: "210", streetName: "Peachtree", streetSuffix: "St",
                 city: "Atlanta", state: "GA", postalCode: "30303" },
      photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"],
      remarks: "Downtown high-rise with skyline views, walkable to Centennial Olympic Park.",
      geo: { lat: 33.763, lng: -84.388 },
    },
    {
      mlsId: "DEMO-004",
      listPrice: 899000,
      property: { bedrooms: 4, bathsFull: 3, area: 3120, type: "Single Family" },
      address: { streetNumberText: "45", streetName: "Inman", streetSuffix: "Park",
                 city: "Atlanta", state: "GA", postalCode: "30307" },
      photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
      remarks: "Inman Park Victorian steps from the BeltLine with an entertainer's backyard.",
      geo: { lat: 33.763, lng: -84.353 },
    },
    {
      mlsId: "DEMO-005",
      listPrice: 1495000,
      property: { bedrooms: 5, bathsFull: 5, area: 4680, type: "Single Family" },
      address: { streetNumberText: "3712", streetName: "Peachtree", streetSuffix: "Rd",
                 city: "Buckhead", state: "GA", postalCode: "30319" },
      photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
      remarks: "Buckhead new-construction with designer finishes and a detached guest suite.",
      geo: { lat: 33.860, lng: -84.376 },
    },
    {
      mlsId: "DEMO-006",
      listPrice: 435000,
      property: { bedrooms: 2, bathsFull: 2, area: 1420, type: "Townhouse" },
      address: { streetNumberText: "612", streetName: "Westside", streetSuffix: "Way",
                 city: "Atlanta", state: "GA", postalCode: "30318" },
      photos: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"],
      remarks: "Westside townhome with a rooftop terrace minutes from the BeltLine.",
      geo: { lat: 33.782, lng: -84.418 },
    },
  ];

  /* ---------- Rendering ---------- */
  const fmtPrice = (n) =>
    "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

  function cardHTML(listing, i, linkBase) {
    const a = listing.address || {};
    const p = listing.property || {};
    const addr =
      `${a.streetNumberText || ""} ${a.streetName || ""} ${a.streetSuffix || ""}`.trim();
    const cityLine = `${a.city || ""}, ${a.state || ""} ${a.postalCode || ""}`;
    const photoUrl = (listing.photos && listing.photos[0]) || "";
    const photo = photoUrl
      ? `<img src="${photoUrl}" alt="${addr}" loading="lazy"/>`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#c89874,#8f4a2c);"></div>`;
    const badge = i === 0 ? `<span class="property-badge new">New</span>` : `<span class="property-badge">For sale</span>`;
    return `
      <article class="property-card reveal${i > 0 ? " delay-" + Math.min(i, 3) : ""}">
        <a href="${linkBase}" class="property-media" aria-label="View ${addr}">
          ${badge}
          ${photo}
        </a>
        <div class="property-body">
          <div class="property-price">${fmtPrice(listing.listPrice)}</div>
          <div class="property-address">${addr}<br/>${cityLine}</div>
          <div class="property-stats">
            <span><strong>${p.bedrooms ?? "—"}</strong> bd</span>
            <span><strong>${p.bathsFull ?? "—"}</strong> ba</span>
            <span><strong>${(p.area || 0).toLocaleString()}</strong> sqft</span>
          </div>
        </div>
      </article>`;
  }

  async function renderFeatured(target) {
    const container = document.querySelector(target);
    if (!container) return;
    const limit = CFG.simplyRETS?.featuredLimit || 3;
    const linkBase = container.getAttribute("data-property-link") || propertyLinkBase();
    const { data } = await fetchListings({ limit });
    container.innerHTML = data.slice(0, limit).map((l, i) => cardHTML(l, i, linkBase)).join("");
    // Re-observe revealed elements
    triggerReveal(container);
  }

  async function renderGrid(target) {
    const container = document.querySelector(target);
    if (!container) return;
    const limit = CFG.simplyRETS?.defaultLimit || 12;
    const linkBase = container.getAttribute("data-property-link") || propertyLinkBase();
    const { data } = await fetchListings({ limit });
    container.innerHTML = data.slice(0, limit).map((l, i) => cardHTML(l, i, linkBase)).join("");
    triggerReveal(container);
  }

  function triggerReveal(container) {
    // Rerun reveal logic against newly-injected elements.
    const els = container.querySelectorAll(".reveal");
    if (!els.length) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------- Mapbox init ---------- */
  function initMapbox(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const token = CFG.mapbox?.accessToken;
    if (!token || token.startsWith("YOUR_") || typeof mapboxgl === "undefined") {
      // Keep the decorative placeholder.
      return;
    }
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: el,
      style: CFG.mapbox.style,
      center: CFG.mapbox.atlantaCenter,
      zoom: CFG.mapbox.defaultZoom,
    });
    map.on("moveend", async () => {
      const b = map.getBounds();
      const params = {
        minlng: b.getWest(), maxlng: b.getEast(),
        minlat: b.getSouth(), maxlat: b.getNorth(),
        limit: 50,
      };
      const { data } = await fetchListings(params);
      console.info(`[map] bounds query returned ${data.length} listings`);
    });
    el.classList.remove("map-placeholder");
  }

  /* ---------- Expose + auto-init ---------- */
  window.JSongListings = { fetchListings, renderFeatured, renderGrid, initMapbox };

  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured("[data-featured-listings]");
    renderGrid("[data-listings-grid]");
    initMapbox("[data-map]");
  });
})();
