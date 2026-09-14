# Catalog CI Image

**Proposal:** `catalog-ci-image`
**Status:** done
**Phase:** [ADHD quality gate](../../ADHD.md#5-quality)

## Problem

The catalog job spends about 150 seconds provisioning Git, Node, package dependency, Chromium and browser system dependency before its required browser gate starts.

## Scope

### In scope

- Prebuild the exact Bun, Node and Chromium runtime used by catalog CI.
- Publish the image only when its Dockerfile changes.
- Keep Playwright as the required full browser gate.
- Preserve Bun.WebView as targeted verification rather than a replacement runner.

### Out of scope

- Reducing accessibility coverage.
- Adding retry or longer readiness deadline.
- Increasing Playwright worker count.
- Caching `node_modules`.

## Success Criteria

- [x] Catalog CI no longer downloads Node, browser binary or browser system dependency per run.
- [x] Image version is immutable and tied to Bun and Playwright runtime version.
- [x] Full catalog gate passes in the prebuilt image.
- [x] Image build supports the Linux arm64 project runner.

## Specs

| Spec             | Path                            | Summary                                                   |
| ---------------- | ------------------------------- | --------------------------------------------------------- |
| catalog-ci-image | `spec/catalog-ci-image/spec.md` | Reproducible catalog runtime image and CI usage contract. |

## References

- [ADHD.md](../../ADHD.md)
- [Catalog CI stability spec](../spec/catalog-ci-stability/spec.md)
