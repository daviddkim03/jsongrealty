import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jsongrealty.com",
  output: "static",
  server: { port: 4321, host: true },
});
