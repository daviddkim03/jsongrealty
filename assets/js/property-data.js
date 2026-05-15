/* ==========================================================================
   property-data.js — AVM, public records, walk score, demographics
   --------------------------------------------------------------------------
   Loaded on:  listings/sample-property/index.html (and the future /research/ page).

   Reads the property's address / zip / lat-lng from <meta> tags on the page,
   queries free-tier APIs in parallel, and populates [data-pd-*] hooks.

   Demo fallback data renders whenever a key is missing or a request fails —
   same pattern as listings.js, so the page is never broken while you test.

   APIs:
     - RentCast       https://api.rentcast.io/v1/avm/value
     - Walk Score     https://api.walkscore.com/score
     - US Census ACS  https://api.census.gov/data/2022/acs/acs5  (no key required)
     - Nominatim      https://nominatim.openstreetmap.org/search   (geocoding, free)
     - Overpass       https://overpass-api.de/api/interpreter      (nearby POIs, free)
   ========================================================================== */

(function () {
  "use strict";
  const CFG = window.JSONG_CONFIG || {};

  /* ---------- Read <meta name="property-*"> tags ---------- */
  function meta(name) {
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute("content") : "";
  }

  /* ---------- Demo data (used when keys missing or request fails) ---------- */
  const DEMO_AVM = {
    price: 752000,
    priceRangeLow: 735000,
    priceRangeHigh: 770000,
    lastSalePrice: 612000,
    lastSaleDate: "2019-08-15",
    taxAssessment: 620000,
    annualTax: 7840,
  };
  const DEMO_WALK = { walkscore: 92, transit: { score: 64 }, bike: { score: 78 } };
  const DEMO_CENSUS = { medianIncome: 94000, medianHomeValue: 682000, population: 18420 };
  const DEMO_NEARBY = { food: 14, grocery: 4, parks: 3, schools: 2, transit: 6 };

  /* ---------- RentCast: AVM + public records ---------- */
  async function fetchAVM(address) {
    const cfg = CFG.rentcast;
    if (!cfg || !cfg.apiKey || cfg.apiKey.startsWith("YOUR_")) {
      return { ok: false, source: "demo", data: DEMO_AVM };
    }
    try {
      const url = `${cfg.baseUrl}/avm/value?address=${encodeURIComponent(address)}`;
      const res = await fetch(url, { headers: { "X-Api-Key": cfg.apiKey } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      return { ok: true, source: "rentcast", data: json };
    } catch (err) {
      console.warn("[property-data] RentCast failed, using demo:", err.message);
      return { ok: false, source: "demo", data: DEMO_AVM, error: err.message };
    }
  }

  /* ---------- Walk Score ---------- */
  async function fetchWalkScore(address, lat, lng) {
    const cfg = CFG.walkscore;
    if (!cfg || !cfg.apiKey || cfg.apiKey.startsWith("YOUR_")) {
      return { ok: false, source: "demo", data: DEMO_WALK };
    }
    try {
      const url = `https://api.walkscore.com/score?format=json` +
        `&address=${encodeURIComponent(address)}&lat=${lat}&lon=${lng}` +
        `&transit=1&bike=1&wsapikey=${cfg.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      return { ok: true, source: "walkscore", data: json };
    } catch (err) {
      console.warn("[property-data] Walk Score failed, using demo:", err.message);
      return { ok: false, source: "demo", data: DEMO_WALK, error: err.message };
    }
  }

  /* ---------- US Census ACS — no key required ---------- */
  async function fetchDemographics(zip) {
    if (!zip) return { ok: false, source: "demo", data: DEMO_CENSUS };
    try {
      // B19013_001E = median household income
      // B25077_001E = median home value
      // B01003_001E = total population
      const vars = "B19013_001E,B25077_001E,B01003_001E";
      const base = (CFG.census && CFG.census.baseUrl) || "https://api.census.gov/data/2022/acs/acs5";
      const url = `${base}?get=${vars}&for=zip%20code%20tabulation%20area:${zip}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = await res.json();
      const [, row] = rows; // [headers, values]
      return {
        ok: true,
        source: "census",
        data: {
          medianIncome: parseInt(row[0], 10) || null,
          medianHomeValue: parseInt(row[1], 10) || null,
          population: parseInt(row[2], 10) || null,
        },
      };
    } catch (err) {
      console.warn("[property-data] Census failed, using demo:", err.message);
      return { ok: false, source: "demo", data: DEMO_CENSUS, error: err.message };
    }
  }

  /* ---------- Nominatim: geocode an address (free, no key) ----------
     Used by the /research/ page to resolve a free-text address to lat/lng/zip
     before running the rest of the lookups. */
  async function geocodeAddress(address) {
    if (!address) return { ok: false };
    try {
      const url = `https://nominatim.openstreetmap.org/search` +
        `?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(address)}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const arr = await res.json();
      if (!arr.length) return { ok: false, error: "not-found" };
      const r = arr[0];
      return {
        ok: true,
        data: {
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          zip: r.address?.postcode || "",
          displayName: r.display_name || address,
        },
      };
    } catch (err) {
      console.warn("[property-data] geocode failed:", err.message);
      return { ok: false, error: err.message };
    }
  }

  /* ---------- Overpass: count nearby POIs (free, no key) ----------
     Queries OpenStreetMap directly within `radius` meters of (lat, lng).
     Default radius 800m ≈ 10-minute walk. */
  async function fetchNearbyPlaces(lat, lng, radius = 800) {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      return { ok: false, source: "demo", data: DEMO_NEARBY };
    }
    const r = Math.round(radius);
    const query = `
      [out:json][timeout:15];
      (
        node[amenity~"^(cafe|restaurant|fast_food)$"](around:${r},${lat},${lng});
        node[shop~"^(supermarket|convenience|grocery)$"](around:${r},${lat},${lng});
        node[leisure=park](around:${r},${lat},${lng});
        way[leisure=park](around:${r},${lat},${lng});
        node[amenity=school](around:${r},${lat},${lng});
        node[public_transport=station](around:${r},${lat},${lng});
        node[highway=bus_stop](around:${r},${lat},${lng});
      );
      out tags 200;`;
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const counts = { food: 0, grocery: 0, parks: 0, schools: 0, transit: 0 };
      for (const el of json.elements || []) {
        const t = el.tags || {};
        if (["cafe", "restaurant", "fast_food"].includes(t.amenity)) counts.food++;
        else if (["supermarket", "convenience", "grocery"].includes(t.shop)) counts.grocery++;
        else if (t.leisure === "park") counts.parks++;
        else if (t.amenity === "school") counts.schools++;
        else if (t.public_transport === "station" || t.highway === "bus_stop") counts.transit++;
      }
      return { ok: true, source: "openstreetmap", data: counts };
    } catch (err) {
      console.warn("[property-data] Overpass failed, using demo:", err.message);
      return { ok: false, source: "demo", data: DEMO_NEARBY, error: err.message };
    }
  }

  /* ---------- Format helpers ---------- */
  const fmtMoney = (n) =>
    n == null ? "—" : "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const fmtMoneyK = (n) =>
    n == null ? "—" : "$" + Math.round(n / 1000) + "K";
  const fmtYear = (s) => (s ? new Date(s).getFullYear() : "—");

  /* ---------- DOM hook helper ---------- */
  function setHook(key, val) {
    document.querySelectorAll(`[data-pd-${key}]`).forEach((el) => { el.textContent = val; });
  }

  /* ---------- Renderers ---------- */
  function renderAVM(d) {
    setHook("avm-mid", fmtMoney(d.price));
    setHook("avm-low", fmtMoneyK(d.priceRangeLow));
    setHook("avm-high", fmtMoneyK(d.priceRangeHigh));
    setHook("avm-range", `${fmtMoneyK(d.priceRangeLow)} – ${fmtMoneyK(d.priceRangeHigh)}`);
    setHook("last-sale-price", fmtMoney(d.lastSalePrice));
    setHook("last-sale-year", fmtYear(d.lastSaleDate));
    setHook("tax-assessment", fmtMoney(d.taxAssessment));
    setHook("tax-annual", fmtMoney(d.annualTax));
  }

  function renderWalk(d) {
    setHook("walk-score", d.walkscore ?? "—");
    setHook("transit-score", d.transit?.score ?? "—");
    setHook("bike-score", d.bike?.score ?? "—");
  }

  function renderDemographics(d) {
    setHook("median-income", fmtMoney(d.medianIncome));
    setHook("median-home-value", fmtMoney(d.medianHomeValue));
    setHook("population", d.population != null ? d.population.toLocaleString() : "—");
  }

  function renderNearby(d) {
    setHook("nearby-food", d.food ?? 0);
    setHook("nearby-grocery", d.grocery ?? 0);
    setHook("nearby-parks", d.parks ?? 0);
    setHook("nearby-schools", d.schools ?? 0);
    setHook("nearby-transit", d.transit ?? 0);
  }

  function setSourceBadges(badges) {
    document.querySelectorAll("[data-pd-source]").forEach((el) => {
      const which = el.getAttribute("data-pd-source");
      const src = badges[which];
      if (!src) return;
      el.textContent = src === "demo" ? "Demo data — add API key in api-config.js" : `Live · ${src}`;
      el.classList.toggle("source-demo", src === "demo");
      el.classList.toggle("source-live", src !== "demo");
    });
  }

  /* ---------- Populate every section for one property ----------
     Used by both the static sample-property page (via renderAll) and the
     /research/ page (via lookup, which geocodes first). */
  async function populate({ address, lat, lng, zip }) {
    const [avm, walk, census, nearby] = await Promise.all([
      fetchAVM(address),
      fetchWalkScore(address, lat, lng),
      fetchDemographics(zip),
      fetchNearbyPlaces(lat, lng),
    ]);
    renderAVM(avm.data);
    renderWalk(walk.data);
    renderDemographics(census.data);
    renderNearby(nearby.data);
    setSourceBadges({
      avm: avm.source, walk: walk.source, census: census.source, nearby: nearby.source,
    });
    return { avm, walk, census, nearby };
  }

  /* ---------- Free-text address lookup ----------
     Geocodes via Nominatim, then runs every wrapper. Returns the resolved
     address + the four API results so callers can show status / errors. */
  async function lookup(address) {
    const geo = await geocodeAddress(address);
    if (!geo.ok) return { ok: false, error: geo.error || "geocode-failed" };
    const result = await populate({
      address: geo.data.displayName,
      lat: geo.data.lat,
      lng: geo.data.lng,
      zip: geo.data.zip,
    });
    return { ok: true, geo: geo.data, ...result };
  }

  /* ---------- Main: auto-run on pages with property-* meta tags ---------- */
  async function renderAll() {
    const address = meta("property-address");
    if (!address) return; // page didn't opt in
    await populate({
      address,
      lat: parseFloat(meta("property-lat")),
      lng: parseFloat(meta("property-lng")),
      zip: meta("property-zip"),
    });
  }

  window.JSongPropertyData = {
    fetchAVM, fetchWalkScore, fetchDemographics, fetchNearbyPlaces,
    geocodeAddress, populate, lookup, renderAll,
  };
  document.addEventListener("DOMContentLoaded", renderAll);
})();
