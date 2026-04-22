/* ==========================================================================
   main.js — site-wide behavior (nav, scroll, reveal, forms, brand fill)
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Header: scrolled state ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const isHomeHero = document.body.classList.contains("has-hero");
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      header.classList.toggle("scrolled", scrolled);
      if (isHomeHero) {
        // On home: transparent over hero, solid once scrolled past hero
        const hero = document.querySelector(".hero");
        if (hero) {
          const heroBottom = hero.offsetHeight - 80;
          header.classList.toggle("on-hero", window.scrollY < heroBottom);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Auto year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Auto-fill brand/contact info from api-config ---------- */
  if (window.JSONG_CONFIG) {
    const c = window.JSONG_CONFIG.brand;
    document.querySelectorAll("[data-brand-phone]").forEach((el) => {
      el.textContent = c.phone;
      if (el.tagName === "A") el.href = "tel:" + c.phone.replace(/[^\d+]/g, "");
    });
    document.querySelectorAll("[data-brand-email]").forEach((el) => {
      el.textContent = c.email;
      if (el.tagName === "A") el.href = "mailto:" + c.email;
    });
    document.querySelectorAll("[data-brand-agent]").forEach((el) => {
      el.textContent = c.agent;
    });
    document.querySelectorAll("[data-brand-brokerage]").forEach((el) => {
      el.textContent = c.brokerage;
    });
    document.querySelectorAll("[data-brand-city]").forEach((el) => {
      el.textContent = c.city;
    });
    document.querySelectorAll("[data-brand-instagram]").forEach((el) => {
      if (el.tagName === "A") el.href = c.instagram;
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = form.querySelector("[data-form-status]");
      const submitBtn = form.querySelector("button[type=submit]");
      const payload = Object.fromEntries(new FormData(form).entries());
      const endpoint =
        (window.JSONG_CONFIG && window.JSONG_CONFIG.contactForm.endpoint) || "";

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      try {
        if (endpoint && !endpoint.startsWith("YOUR_")) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Network error");
        } else {
          // No endpoint configured yet — just log.
          console.info("[contact form] payload:", payload);
          await new Promise((r) => setTimeout(r, 400));
        }
        form.reset();
        if (statusEl) {
          statusEl.className = "form-status success";
          statusEl.textContent =
            "Thanks — your message is in. Joshua will be in touch within one business day.";
          statusEl.hidden = false;
        }
      } catch (err) {
        if (statusEl) {
          statusEl.className = "form-status error";
          statusEl.textContent =
            "Something went wrong. Please call " +
            (window.JSONG_CONFIG ? window.JSONG_CONFIG.brand.phone : "") +
            " directly.";
          statusEl.hidden = false;
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- Active nav link (relative-path aware) ---------- */
  const path = location.pathname.replace(/\/index\.html$/, "/");
  // Get last directory segment(s)
  const pathSegments = path.split("/").filter(Boolean);
  const currentSection = pathSegments[pathSegments.length - 1] || "";

  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    // Normalize: strip leading ../ and trailing index.html
    const cleaned = href.replace(/^(\.\.\/)+/, "").replace(/index\.html$/, "").replace(/\/$/, "");
    if (!cleaned) return; // Skip home link
    if (pathSegments.includes(cleaned)) a.classList.add("active");
  });
})();
