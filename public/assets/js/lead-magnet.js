/* ==========================================================================
   lead-magnet.js — email-gated PDF download (Atlanta Buyer's Guide, etc.)
   --------------------------------------------------------------------------
   Mark up forms like:
     <form data-lead-magnet-form data-guide="buyer">
       <input type="email" name="email" required />
       <button type="submit">Send me the guide</button>
       <p data-form-status hidden></p>
     </form>

   On submit:
     1. POST { email, guide } to JSONG_CONFIG.leadMagnet.endpoint (if set).
        If no endpoint, log to console and continue (works in local dev).
     2. Trigger a download of JSONG_CONFIG.guides[guide].pdfPath.
     3. Show success message in [data-form-status].

   Configure endpoint and guide PDFs in api-config.js.
   ========================================================================== */

(function () {
  "use strict";

  const CFG = window.JSONG_CONFIG || {};
  const forms = document.querySelectorAll("[data-lead-magnet-form]");
  if (!forms.length) return;

  function showStatus(form, msg, kind) {
    const el = form.querySelector("[data-form-status]");
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status " + (kind || "");
    el.hidden = false;
  }

  function downloadPDF(guideKey) {
    const guide = (CFG.guides && CFG.guides[guideKey]) || null;
    if (!guide || !guide.pdfPath || guide.pdfPath.startsWith("YOUR_")) {
      console.warn(`[lead-magnet] no PDF configured for guide "${guideKey}". Edit api-config.js.`);
      return false;
    }
    // Programmatic download — works for same-origin static files.
    const a = document.createElement("a");
    a.href = guide.pdfPath;
    a.download = guide.filename || "guide.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      const guideKey = form.getAttribute("data-guide") || "buyer";
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.guide = guideKey;
      payload.source = "lead-magnet";

      const endpoint = CFG.leadMagnet && CFG.leadMagnet.endpoint;
      const hasEndpoint = endpoint && !endpoint.startsWith("YOUR_");

      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      try {
        if (hasEndpoint) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Network error");
        } else {
          console.info("[lead-magnet] no endpoint set — payload logged only:", payload);
          await new Promise((r) => setTimeout(r, 350));
        }

        const downloaded = downloadPDF(guideKey);
        if (downloaded) {
          showStatus(form, "Sent — your download should start in a moment. Check your email for a follow-up.", "success");
        } else {
          showStatus(form, "Sent — Joshua will email you the guide shortly.", "success");
        }
        form.reset();
      } catch (err) {
        showStatus(form, "Something went wrong. Try again or text " + (CFG.brand?.phone || "Joshua") + " directly.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  });
})();
