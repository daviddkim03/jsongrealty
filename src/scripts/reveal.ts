// Fades [data-reveal] elements in as they scroll into view (styles in global.css).
const targets = document.querySelectorAll<HTMLElement>("[data-reveal]")

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("is-revealed")
        observer.unobserve(entry.target)
      }
    },
    // Fire once the element's top edge is 8% above the viewport bottom,
    // regardless of the element's height.
    { rootMargin: "0px 0px -8% 0px" },
  )
  targets.forEach((el) => observer.observe(el))
} else {
  targets.forEach((el) => el.classList.add("is-revealed"))
}
