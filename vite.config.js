import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = ['index', 'case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali', 'styleguide', 'lab'];

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
});
