# Polish & Harden — 2026-09-03

**UX & copy.** The verbatim invariant was re-checked against the LIVE site, not the local build: `scripts/live-check.mjs` fetched the five pages from strapseason.github.io and ran the same assertions as the tests — home 94/94, lumery 261/261, aleria 102/102, bitronix 123/123, every-bali 188/188 records; media 9/19/19/15/17 files all referenced. No placeholder or debug strings anywhere in dist.

**States.** Every video now has a poster: eleven poster frames were captured in Chromium (`scripts/posters.mjs`, no ffmpeg on the machine) and wired through the template; probe reports 0 videos without poster and 0 without `preload="metadata"`. A custom `404.html` in the system ships from the site root; on Pages a missing URL returns 404 with the title "Sheet not found — Daniil Zinoviev". Every image carries width/height (0 missing).

**Edges.** At 320 px every page renders with 0 console errors and 0 px horizontal overflow; tables and code blocks sit inside their own scroll containers (0 uncontained). Two fixes were needed: below 400 px the display face drops its width axis to 100 and the h1/title clamps shrink, and the next-case link wraps.

**Security.** `npm audit --omit=dev`: 0 vulnerabilities. No token patterns in dist. The parked Actions workflow declares least-privilege permissions (contents: read, pages: write, id-token: write). No secrets in the repo; the only personal data is the contact email and Telegram handle that the old site already published.

**Accessibility.** The tab-order probe found the real defect of the run: scroll reveals used `autoAlpha`, i.e. `visibility:hidden`, so keyboard users could not reach unrevealed sections — after the header links, focus jumped straight to the footer. Reveals now animate opacity only and complete instantly on `focusin`. Result: every visible interactive element is reached with a visible ring (0 invisible); remaining gaps equal, by count, the inactive tabs under roving tabindex and the controls inside closed `<details>`. Images without alt: 0. `html lang="en"`. Heading order: 0 skipped levels after the workfile view titles moved from h4 to h3. Token contrast: light 14.88 / 5.26 / 6.58, dark 14.62 / 6.74 / 8.18 (ink / muted / accent on bg).

**Performance.** Home JS 179.1 KB gz (budget 350); first-load transfer excluding video 622 KB on home, ≤ 1.97 MB on any case page (budget 3 MB). Lab scenes re-run on the GPU: 120 / 120 / 120 / 120.3 / 120 fps; scroll fps on home 120.3. CLS over a full scroll: index 0.0012, lumery 0.0234, aleria 0, bitronix 0.0254, every-bali 0.0008 (< 0.05). Reduced-motion violations 0 on all pages.

**Diff review.** `git diff 41c5e3a..HEAD` —  203 files changed, 4768 insertions(+), 228 deletions(-). Added lines contain no TODO/FIXME; `console.log` only in CLI scripts under `scripts/` (the test-side print was removed). No dead imports (ESLint clean).

**Regression.** `npm run shots -- --phase 11 --two` in light and dark: 5 pages × 2 widths × 2 schemes = 20 renders, 0 console errors, 0 overflow (40 PNGs incl. the earlier pass). Old repository untouched: `git status --porcelain` empty, main still d693463. Build, lint and 25 tests pass.
