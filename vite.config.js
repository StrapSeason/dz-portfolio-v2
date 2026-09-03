import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';

const pages = ['index', 'case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali', 'styleguide', 'lab'];
const concepts = existsSync('concepts') ? readdirSync('concepts').filter((f) => f.endsWith('.html')) : [];

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    rollupOptions: {
      input: {
        ...Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
        ...Object.fromEntries(concepts.map((f) => [`concepts/${f.replace('.html', '')}`, resolve(__dirname, 'concepts', f)])),
      },
    },
  },
});
