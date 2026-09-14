# Decisions: Catalog CI Image

| ID      | Title                           | Status   |
| ------- | ------------------------------- | -------- |
| DEC-001 | Retain Playwright gate          | accepted |
| DEC-002 | Publish immutable runtime image | accepted |

---

### DEC-001: Retain Playwright gate

**GIVEN** the browser suite depends on Axe, screenshot comparison, upload, permission, focus, memory and trace contracts
**WHEN** catalog CI is optimized
**THEN** Bun.WebView remains targeted evidence and Playwright remains the required full browser gate

---

### DEC-002: Publish immutable runtime image

**GIVEN** runtime provisioning consumes about 150 seconds per catalog job
**WHEN** the catalog Dockerfile changes
**THEN** GitLab builds a version-tagged image containing Bun, Node, Chromium and browser system dependency
