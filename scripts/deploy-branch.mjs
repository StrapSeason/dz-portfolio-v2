/* Publish dist/ to the gh-pages branch (Pages "deploy from a branch"). Used until the
   GitHub token carries the `workflow` scope needed to push deploy/github-pages.workflow.yml
   into .github/workflows/. Run: npm run deploy */
import { execSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
const sh = (c) => execSync(c, { stdio: 'inherit' });
sh('VITE_BASE=/dz-portfolio-v2/ npm run build');
if (existsSync('.gh-pages')) rmSync('.gh-pages', { recursive: true, force: true });
sh('git worktree prune');
sh('git worktree add -B gh-pages .gh-pages 2>/dev/null || git worktree add .gh-pages gh-pages');
sh('rsync -a --delete --exclude .git dist/ .gh-pages/');
sh('touch .gh-pages/.nojekyll');
sh(`cd .gh-pages && git add -A && (git commit -q -m "Publish ${execSync('git rev-parse --short HEAD').toString().trim()}" || true) && git push -f origin gh-pages`);
sh('git worktree remove --force .gh-pages');
sh('npm run build');   // restore the local base '/' build
