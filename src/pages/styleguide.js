import { renderNav } from '../shell/nav.js';
import { renderFooter } from '../shell/footer.js';
import { initTabs } from '../shell/tabs.js';
import { initVideos } from '../shell/video.js';

document.querySelector('[data-shell="nav"]').outerHTML = renderNav();
document.querySelector('[data-shell="footer"]').outerHTML = renderFooter();
// footer ships the contact links as a template; the page decides where they go
const tpl = document.querySelector('template[data-contact-links]');
const slot = document.querySelector('[data-contact-links]');
if (tpl && slot) slot.append(tpl.content.cloneNode(true));

document.querySelectorAll('[data-tabs]').forEach(initTabs);
initVideos();

const toggle = document.querySelector('[data-theme-toggle]');
toggle?.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme !== 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  toggle.setAttribute('aria-pressed', String(dark));
});
