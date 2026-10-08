# Decisions: GitHub npm Release

### DEC-001: GitLab remains the version authority

**GIVEN** GitLab Changesets already versions, tags, and publishes `@bridge/ui`
**WHEN** GitHub mirrors `main`
**THEN** GitHub never bumps versions; it publishes only the mirrored stable version that has a CHANGELOG entry.

### DEC-002: Public npmjs under `@9by2/bridge-ui`

**GIVEN** `@bridge` is not an owned npm scope and the GitHub repository is public
**WHEN** publishing from GitHub
**THEN** publish publicly to npmjs.org as `@9by2/bridge-ui` and rename only the staged manifest. Source and GitLab output stay `@bridge/ui`.

### DEC-003: Trigger on main push, not tags

**GIVEN** the GitHub mirror carries no GitLab tags
**WHEN** deciding the release trigger
**THEN** trigger on `main` push and use npm registry state for idempotency. GitHub Release creation produces the `vX.Y.Z` tag.

### DEC-004: npm CLI with token and provenance

**GIVEN** Bun publish cannot emit provenance, and npm trusted publishing cannot create a brand-new package
**WHEN** publishing
**THEN** use `npm publish --provenance` with the `NPM_TOKEN` repository secret and `id-token: write`.

### DEC-005: GitHub Packages instead of npmjs (supersedes DEC-002, DEC-004)

**GIVEN** the first `main` release failed for lack of an `NPM_TOKEN`, and the owner chose GitHub Packages, open to anyone with access
**WHEN** publishing `@9by2/bridge-ui`
**THEN** publish to `https://npm.pkg.github.com/` with the built-in `GITHUB_TOKEN` (`packages: write`) and no provenance. The package is linked to the public repository through `repository`, so it is public. Installing still needs any GitHub token with `read:packages`.

### DEC-006: Blacksmith runner

**GIVEN** the owner requested Blacksmith runners
**WHEN** scheduling verify and release jobs
**THEN** use `runs-on: blacksmith-2vcpu-ubuntu-2404`, and register that label in `.github/actionlint.yaml`.
