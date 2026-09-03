/* HEAD every asset the five live pages reference; print non-200s. */
const base = process.argv[2] || 'https://strapseason.github.io/dz-portfolio-v2/';
const pages = ['index.html', 'case-lumery.html', 'case-aleria.html', 'case-bitronix.html', 'case-every-bali.html'];
const urls = new Set();
for (const p of pages) {
  const html = await (await fetch(base + p)).text();
  for (const m of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)) {
    const u = m[1]; if (/^(https?:|mailto:|#|data:)/.test(u)) continue;
    urls.add(new URL(u, base).href);
  }
  for (const c of html.matchAll(/href="([^"]+\.css)"/g)) {
    const css = await (await fetch(new URL(c[1], base))).text();
    for (const m of css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) if (!/^(data:|#|%23)/.test(m[2])) urls.add(new URL(m[2], base).href);   // '#n' is an SVG filter reference, not a file
  }
}
let bad = 0;
for (const u of urls) { const r = await fetch(u, { method: 'HEAD' }); if (r.status !== 200) { bad++; console.log(r.status, u); } }
console.log(`sweep: ${urls.size} assets, ${bad} non-200`);
process.exit(bad ? 1 : 0);
