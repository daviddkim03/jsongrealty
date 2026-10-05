/** Builds Unsplash CDN URLs so every image can ship a responsive srcset. */
export const unsplashUrl = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

export const unsplashSrcSet = (id: string, widths: number[]) =>
  widths.map((width) => `${unsplashUrl(id, width)} ${width}w`).join(", ")

const isUrl = (src: string) =>
  /^(https?:)?\/\//.test(src) || src.startsWith("/")

/** Accepts an Unsplash photo id or a regular image URL / public path. */
export const imageUrl = (src: string, width: number) =>
  isUrl(src) ? src : unsplashUrl(src, width)

export const imageSrcSet = (src: string, widths: number[]) =>
  isUrl(src) ? undefined : unsplashSrcSet(src, widths)
