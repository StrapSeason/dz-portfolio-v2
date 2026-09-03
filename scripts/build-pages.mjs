/* Writes the static pages from content JSON + templates. Runs before vite build. */
import { readFileSync, writeFileSync } from 'node:fs';
import { renderHome } from '../src/templates/home.js';
import { renderLumery } from '../src/templates/lumery.js';
const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
writeFileSync('index.html', renderHome(home));
writeFileSync('case-lumery.html', renderLumery(JSON.parse(readFileSync('content/lumery.json', 'utf8'))));
console.log('pages: index.html, case-lumery.html');
