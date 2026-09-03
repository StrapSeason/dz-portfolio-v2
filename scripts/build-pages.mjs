/* Writes the static pages from content JSON + templates. Runs before vite build. */
import { readFileSync, writeFileSync } from 'node:fs';
import { renderHome } from '../src/templates/home.js';
const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
writeFileSync('index.html', renderHome(home));
console.log('pages: index.html');
