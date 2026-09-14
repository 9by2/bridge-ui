# Catalog CI Image Pin

**Proposal:** `catalog-ci-image-pin`
**Status:** done
**Phase:** [ADHD quality gate](../../ADHD.md#5-quality)

## Problem

The first catalog runtime wiring attempted an unavailable in-pipeline Kaniko build. A published multi-architecture service image now exists and must be consumed by immutable manifest digest.

## Scope

### In scope

- Pin child verification to the published multi-architecture manifest digest.
- Remove the failed runtime image build job.
- Verify runtime on both amd64 and arm64.

### Out of scope

- Rebuilding or pushing the image.
- Changing Playwright coverage or worker count.

## Success Criteria

- [x] Root CI contains no catalog image builder job.
- [x] Child CI uses the immutable service image digest.
- [x] Runtime verification passes on amd64 and arm64.

## Specs

| Spec             | Path                            | Summary                                                    |
| ---------------- | ------------------------------- | ---------------------------------------------------------- |
| catalog-ci-image | `spec/catalog-ci-image/spec.md` | Amend image source, digest pin, and architecture contract. |

## References

- [Catalog CI image spec](../spec/catalog-ci-image/spec.md)
