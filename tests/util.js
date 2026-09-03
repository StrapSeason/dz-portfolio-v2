import { readFileSync, existsSync } from 'node:fs';
export const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
export const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();
export function builtPage(name) {
  const f = `dist/${name === 'home' ? 'index' : `case-${name}`}.html`;
  if (!existsSync(f)) return null;
  const html = readFileSync(f, 'utf8');
  if (/<meta name="dz-stub"/.test(html)) return null;          // not built yet
  return html;
}
export function visibleText(html) {
  const head = (html.match(/<title>([\s\S]*?)<\/title>/) || ['', ''])[1] + ' ' +
    (html.match(/<meta name="description" content="([^"]*)"/) || ['', ''])[1] + ' ' +
    [...html.matchAll(/\balt="([^"]*)"/g)].map((m) => m[1]).join(' ') + ' ' +
    [...html.matchAll(/\baria-label="([^"]*)"/g)].map((m) => m[1]).join(' ');
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  return norm(head + ' ' + body);
}
export const PAGES = ['home', 'lumery', 'aleria', 'bitronix', 'every-bali'];
