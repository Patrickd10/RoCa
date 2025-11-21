// astro.config.mjs
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://www.roca-inot.xyz', // optional, dar e bine
  base: '/RoCa',                        // <- ESENȚIAL pt Pages subfolder
  vite: { plugins: [tailwindcss()] }
})
