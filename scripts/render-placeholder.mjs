/* Phase-1 plumbing: unstyled pages that render every record verbatim so the
   content invariant is testable before any design exists. Case pages and the
   internal pages are stubs (marked dz-stub) until their own phases. */
import { readFileSync, writeFileSync } from 'node:fs';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const home = JSON.parse(readFileSync('content/home.json', 'utf8'));
const media = JSON.parse(readFileSync('content/media.json', 'utf8'));
const title = home.records.find((r) => r.kind === 'title')?.text || 'Daniil Zinoviev';
const desc = home.records.find((r) => r.kind === 'meta')?.text || '';
const body = home.records.filter((r) => r.kind !== 'title' && r.kind !== 'meta')
  .map((r) => r.kind === 'alt' ? `<img src="/media/${(media.home.find((m) => /portrait/.test(m)) || '').split('/').pop()}" alt="${esc(r.text)}" />` : `<p data-id="${r.id}">${esc(r.text)}</p>`).join('\n');
const mediaList = media.home.map((m) => {
  const f = m.split('/').pop();
  if (/\.mp4$/.test(f)) return `<video src="/media/${f}" preload="metadata" muted playsinline></video>`;
  if (/\.js$/.test(f)) return `<!-- ${f} -->`;
  return `<img src="/media/${f}" alt="" loading="lazy" />`;
}).join('\n');
writeFileSync('index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}" /><style>img,video{max-width:100%;height:auto}</style></head>
<body><main>
${body}
</main><section aria-hidden="true">${mediaList}</section></body></html>
`);
import { existsSync } from 'node:fs';
for (const p of ['case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali', 'styleguide', 'lab']) {
  if (existsSync(`${p}.html`) && !/dz-stub/.test(readFileSync(`${p}.html`, 'utf8'))) continue;   // real page: keep
  writeFileSync(`${p}.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="dz-stub" content="phase-1" /><title>${p}</title></head><body><p>${p} — built in a later phase.</p></body></html>\n`);
}
console.log('placeholder index.html + 6 stubs written');
