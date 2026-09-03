/**
 * Turn the old site into data.
 *
 * content/<page>.json — every visible text node (plus title, meta description
 * and img alt) of the old page, in document order, and every string literal
 * the page's JavaScript injects. content/media.json — every asset the old
 * pages reference, from HTML, CSS and JS, with its owning page.
 *
 * The old site is read only. Nothing here writes outside content/.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parse } from 'node-html-parser';

const OLD = '/Users/daniel/Downloads/dz-portfolio-deploy';
const PAGES = {
  home: 'index.html',
  lumery: 'case-lumery.html',
  aleria: 'case-aleria.html',
  bitronix: 'case-bitronix.html',
  'every-bali': 'case-every-bali.html',
};
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg']);

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();
const hasLetters = (s) => /[\p{L}\p{N}]/u.test(s);

/* ---- HTML walk ------------------------------------------------------- */
function walk(node, page, out, ctx) {
  if (node.nodeType === 3) {
    const text = norm(node.rawText);
    if (text && hasLetters(text)) out.push({ id: `${page}-t${out.length}`, kind: 'text', tag: ctx.tag, hint: ctx.hint, text });
    return;
  }
  if (node.nodeType !== 1) return;
  const tag = node.rawTagName?.toLowerCase();
  if (!tag || SKIP_TAGS.has(tag)) return;
  const hint = node.getAttribute('class')?.split(/\s+/)[0] || ctx.hint;
  if (tag === 'img') {
    const alt = norm(node.getAttribute('alt') || '');
    if (alt && hasLetters(alt)) out.push({ id: `${page}-t${out.length}`, kind: 'alt', tag, hint, text: alt });
  }
  for (const child of node.childNodes) walk(child, page, out, { tag, hint });
}

/* ---- JS literals ----------------------------------------------------- */
const LITERAL = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
const looksLikeCopy = (s) =>
  s.length >= 3 && hasLetters(s) && /\s|[.,!?—·]/.test(s) &&
  !/^(assets\/|https?:|mailto:|#|\.|\[|\(|translate|scale|rgba|url\(|linear|\$\{|[a-z-]+\.(css|js|html|png|jpg|mp4|webp))/i.test(s) &&
  !/^[a-z-]+$/.test(s);

function jsBlocks(src) {
  // Split case.js into top-level feature blocks by their querySelector hook.
  const lines = src.split('\n');
  const blocks = [];
  let cur = { hook: null, lines: [] };
  for (const line of lines) {
    const m = line.match(/^const \w+ = document\.querySelector\("\[([^\]]+)\]"\)/);
    if (m) { blocks.push(cur); cur = { hook: m[1], lines: [] }; }
    cur.lines.push(line);
  }
  blocks.push(cur);
  return blocks;
}

function literalsIn(text) {
  const out = [];
  for (const m of text.matchAll(LITERAL)) {
    const s = (m[1] ?? m[2] ?? m[3] ?? '');
    out.push(s);
  }
  return out;
}

/* ---- media ----------------------------------------------------------- */
const ASSET = /assets\/[A-Za-z0-9._\-/]+\.(?:png|jpe?g|webp|svg|mp4|webm|task|tflite|js)/g;
function mediaIn(text) { return [...new Set(text.match(ASSET) || [])]; }

/* ---- run ------------------------------------------------------------- */
mkdirSync('content', { recursive: true });
const pagesHtml = Object.fromEntries(Object.entries(PAGES).map(([k, f]) => [k, readFileSync(`${OLD}/${f}`, 'utf8')]));
const scriptJs = readFileSync(`${OLD}/script.js`, 'utf8');
const caseJs = readFileSync(`${OLD}/case.js`, 'utf8');
const css = { home: readFileSync(`${OLD}/styles.css`, 'utf8'), case: readFileSync(`${OLD}/case.css`, 'utf8') };

const media = {};
const summary = [];

for (const [page, html] of Object.entries(pagesHtml)) {
  const root = parse(html, { comment: false });
  const records = [];
  const title = norm(root.querySelector('title')?.rawText || '');
  const desc = norm(root.querySelector('meta[name="description"]')?.getAttribute('content') || '');
  if (title) records.push({ id: `${page}-title`, kind: 'title', tag: 'title', hint: 'head', text: title });
  if (desc) records.push({ id: `${page}-desc`, kind: 'meta', tag: 'meta', hint: 'head', text: desc });
  walk(root.querySelector('body'), page, records, { tag: 'body', hint: '' });
  const domCount = records.filter((r) => r.kind === 'text').length;

  // JS-injected copy
  const jsRecords = [];
  if (page === 'home') {
    for (const s of literalsIn(scriptJs)) if (looksLikeCopy(s)) jsRecords.push(s);
  } else {
    for (const b of jsBlocks(caseJs)) {
      if (!b.hook || !html.includes(`${b.hook.split('=')[0]}`)) continue;
      for (const s of literalsIn(b.lines.join('\n'))) if (looksLikeCopy(s)) jsRecords.push(s);
    }
  }
  for (const s of [...new Set(jsRecords)]) records.push({ id: `${page}-js${records.length}`, kind: 'js', tag: 'script', hint: 'js', text: norm(s) });

  // grep-style count of text runs in raw HTML, for the ±2 check
  const grepCount = (html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, '')
    .match(/>[^<]*[\p{L}\p{N}][^<]*</gu) || []).length;

  writeFileSync(`content/${page}.json`, JSON.stringify({ page, source: PAGES[page], records }, null, 2));
  summary.push({ page, dom: domCount, grep: grepCount, delta: domCount - grepCount, js: jsRecords.length, alt: records.filter((r) => r.kind === 'alt').length, total: records.length });

  // media for this page
  const files = new Set(mediaIn(html));
  for (const f of mediaIn(page === 'home' ? css.home : css.case)) files.add(f);
  if (page === 'home') for (const f of mediaIn(scriptJs)) files.add(f);
  else for (const b of jsBlocks(caseJs)) if (b.hook && html.includes(b.hook.split('=')[0])) for (const f of mediaIn(b.lines.join('\n'))) files.add(f);
  media[page] = [...files].sort();
}

writeFileSync('content/media.json', JSON.stringify(media, null, 2));
console.table(summary);
console.log('media files per page:', Object.fromEntries(Object.entries(media).map(([k, v]) => [k, v.length])));
