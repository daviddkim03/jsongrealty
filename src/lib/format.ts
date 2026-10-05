const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export const formatPrice = (value: number) => usd.format(value)

export const formatNumber = (value: number) => value.toLocaleString("en-US")

/** Initials for avatar fallbacks: "Priya R." -> "PR", "A. & M." -> "AM". */
export const initials = (name: string) =>
  name
    .replace(/^the\s+/i, "")
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, "").charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

/** Typographic apostrophes for text set in the display serif. */
export const curlyApostrophes = (text: string) => text.replace(/'/g, "’")
