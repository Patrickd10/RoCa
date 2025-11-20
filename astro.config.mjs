// astro.config.ts
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://patrickd10.github.io/RoCa',
  base: '/RoCa',
  vite: { plugins: [tailwindcss()] }
})
