/* ==========================================================================
   reviews.js — client testimonials, rendered into pages on demand.
   --------------------------------------------------------------------------
   Edit the REVIEWS array below to swap in real client quotes. Order matters —
   index 0 is the "featured" quote rendered into [data-review-featured].

   Mark up containers like:
     <div data-reviews-grid></div>                ← full grid
     <div data-reviews-grid data-reviews-limit="3"></div>  ← top 3 only
     <div data-review-featured></div>             ← single hero quote

   Auto-runs on DOMContentLoaded.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Edit these to replace placeholder reviews ---------- */
  const REVIEWS = [
    {
      quote: "Joshua treated our home search like research, not a sales funnel. We got real comps, real advice, and a house we actually love.",
      author: "A. & M.",
      role: "Morningside buyers",
      rating: 5,
    },
    {
      quote: "We'd been burned by a previous agent who pushed every house. Joshua did the opposite — he talked us out of the wrong ones until we found the right one.",
      author: "Priya R.",
      role: "Inman Park first-time buyer",
      rating: 5,
    },
    {
      quote: "Clear data, no games. The comp sheet he sent before our offer was sharper than what our lender pulled.",
      author: "D. Chen",
      role: "Buckhead buyer",
      rating: 5,
    },
    {
      quote: "Sold our craftsman in nine days at over asking. Joshua's pricing strategy was the whole reason — he was patient and let the data argue for itself.",
      author: "The Williams family",
      role: "Virginia-Highland sellers",
      rating: 5,
    },
    {
      quote: "Responsive in a way I didn't expect. Texts answered in minutes, never hours. Made the closing window way less stressful.",
      author: "Marcus T.",
      role: "Decatur buyer",
      rating: 5,
    },
    {
      quote: "He flagged a foundation issue at the inspection that two other agents had glossed over. We walked away from that house and saved ourselves a nightmare.",
      author: "K. & J.",
      role: "Old Fourth Ward buyers",
      rating: 5,
    },
  ];

  /* ---------- Render helpers ---------- */
  function stars(n) {
    const filled = "★".repeat(n);
    const empty = "☆".repeat(Math.max(0, 5 - n));
    return filled + empty;
  }

  function reviewCardHTML(r) {
    const ratingLabel = `${r.rating} out of 5 stars`;
    return `
      <article class="review-card reveal">
        <div class="review-stars" aria-label="${ratingLabel}" role="img">${stars(r.rating)}</div>
        <blockquote class="review-quote">&ldquo;${r.quote}&rdquo;</blockquote>
        <cite class="review-author">— ${r.author} · ${r.role}</cite>
      </article>`;
  }

  function renderGrid(target) {
    const container = typeof target === "string" ? document.querySelector(target) : target;
    if (!container) return;
    const limit = parseInt(container.getAttribute("data-reviews-limit"), 10) || REVIEWS.length;
    container.innerHTML = REVIEWS.slice(0, limit).map(reviewCardHTML).join("");
    triggerReveal(container);
  }

  function triggerReveal(container) {
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

  function renderFeatured(target) {
    const container = typeof target === "string" ? document.querySelector(target) : target;
    if (!container || !REVIEWS.length) return;
    const r = REVIEWS[0];
    container.innerHTML = `
      <blockquote class="testimonial reveal">
        &ldquo;${r.quote}&rdquo;
        <cite>— ${r.author}, ${r.role}</cite>
      </blockquote>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-reviews-grid]").forEach(renderGrid);
    document.querySelectorAll("[data-review-featured]").forEach(renderFeatured);
  });

  window.JSongReviews = { REVIEWS, renderGrid, renderFeatured };
})();
