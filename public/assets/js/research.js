/* ==========================================================================
   research.js — drives the /research/ address-lookup form
   --------------------------------------------------------------------------
   Submits the typed address to JSongPropertyData.lookup(), which geocodes
   via Nominatim and then runs the AVM / WalkScore / Census / Overpass
   wrappers. All sections share the same [data-pd-*] hooks as the static
   property page, so this file just orchestrates form state.
   ========================================================================== */

(function () {
  "use strict";

  const form = document.querySelector("[data-research-form]");
  const results = document.querySelector("[data-research-results]");
  const status = document.querySelector("[data-research-status]");
  const addressEl = document.querySelector("[data-research-address]");
  if (!form || !results) return;

  function showStatus(msg, kind) {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.className = "text-center pd-source-badge " + (kind === "error" ? "source-demo" : "source-live");
    status.style.marginTop = "1.5rem";
  }
  function hideStatus() { if (status) status.hidden = true; }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const address = (form.elements.address.value || "").trim();
    if (!address) return;

    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = "Looking up…";
    showStatus("Looking up that address — this can take a few seconds.", "ok");
    results.hidden = true;

    try {
      const res = await window.JSongPropertyData.lookup(address);
      if (!res.ok) {
        showStatus("Couldn't find that address. Try adding the city, state, and zip.", "error");
        return;
      }
      addressEl.textContent = res.geo.displayName;
      results.hidden = false;
      hideStatus();
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("[research] lookup failed", err);
      showStatus("Something went wrong. Please try again.", "error");
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
})();
