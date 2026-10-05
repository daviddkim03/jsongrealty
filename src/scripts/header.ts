// Over the home hero the header starts transparent and turns solid once the
// page scrolls. On every other page it renders solid and this is a no-op.
const header = document.querySelector<HTMLElement>("[data-site-header]")

if (header?.dataset.overlay === "true") {
  const update = () => {
    header.dataset.solid = String(window.scrollY > 24)
  }
  update()
  window.addEventListener("scroll", update, { passive: true })
}
