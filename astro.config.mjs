import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.roca-swimming.ro', // sau https://www.roca-inot.xyz/ dacă folosești www
  base: '/',                         // IMPORTANT
  vite: { plugins: [tailwindcss()] }
});
