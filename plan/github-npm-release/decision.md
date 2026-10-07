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
