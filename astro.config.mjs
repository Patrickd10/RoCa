import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.roca-inot.xyz', // sau https://www.roca-inot.xyz/ dacă folosești www
  base: '/RoCa',                         // IMPORTANT
  vite: { plugins: [tailwindcss()] }
});
