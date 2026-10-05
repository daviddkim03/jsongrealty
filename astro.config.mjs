import { defineConfig } from "astro/config"

import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://jsongrealty.com",
  output: "static",
  server: { port: 4321, host: true },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
})
