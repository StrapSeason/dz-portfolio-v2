# Deploy

Old repository (never touched by this project): StrapSeason/daniil-zinoviev-portfolio
Old repo main sha at phase-10 start: d693463f320d41c67536ef4928eb42a81e89e22c

New repository: StrapSeason/dz-portfolio-v2 (public), GitHub Pages via Actions workflow.
Live URL: https://strapseason.github.io/dz-portfolio-v2/

## Deployment mechanism (deviation, recorded)

The StrapSeason token lacks the `workflow` OAuth scope, so GitHub rejects any push that
adds `.github/workflows/pages.yml`. The Actions workflow is therefore parked at
`deploy/github-pages.workflow.yml`, and the site is published from a `gh-pages` branch
(`npm run deploy`: base-path build → rsync into a worktree → force-push).

To switch to the Actions pipeline later:
1. `gh auth refresh -h github.com -s workflow` (interactive, opens the browser)
2. `git mv deploy/github-pages.workflow.yml .github/workflows/pages.yml && git commit -m "Deploy via Actions" && git push`
3. `gh api -X PUT repos/StrapSeason/dz-portfolio-v2/pages -f build_type=workflow`
