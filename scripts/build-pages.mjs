/* Writes the static pages from content JSON + templates. Runs before vite build. */
import { readFileSync, writeFileSync } from 'node:fs';
import { renderHome } from '../src/templates/home.js';
import { renderLumery } from '../src/templates/lumery.js';
import { renderAleria } from '../src/templates/aleria.js';
import { renderBitronix } from '../src/templates/bitronix.js';
import { renderEveryBali } from '../src/templates/every-bali.js';
const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
writeFileSync('index.html', renderHome(home));
writeFileSync('case-lumery.html', renderLumery(JSON.parse(readFileSync('content/lumery.json', 'utf8'))));
const j = (n) => JSON.parse(readFileSync(`content/${n}.json`, 'utf8'));
writeFileSync('case-aleria.html', renderAleria(j('aleria')));
writeFileSync('case-bitronix.html', renderBitronix(j('bitronix')));
writeFileSync('case-every-bali.html', renderEveryBali(j('every-bali')));
console.log('pages: index, case-lumery, case-aleria, case-bitronix, case-every-bali');
