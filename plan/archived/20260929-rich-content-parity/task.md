# Tasks: Rich Content Parity

## Setup

- [x] Sync branch with `origin/main`; inspect bridge-web renderer, CSS and call sites.

## Core

- [x] Write public-contract tests first (marks, links, nested list, code copy, table spans, rules, image, video, align, URL safety, empty/malformed).
- [x] Extend `RichContent` types and renderer.

## Integration

- [x] Catalog examples: short, long, table-heavy, code-heavy, nested-list, media, mobile.
- [x] Browser test: desktop/mobile overflow, clipboard copy, a11y archetypes (added to compact suite).
- [x] CUSTOMIZATION.md; patch changeset.
- [x] Repair pre-existing main failure: console prototypes now use rich-content, video-player, youtube-thumbnail.

## Verification

- [x] fmt, lint, typecheck, boundary, test, coverage, build, verify:package, tree-shaking, catalog:test, react-doctor (100).
- [x] Bun.WebView evidence in `.eval/0929-rich-content-parity/`.
- [x] All specs reviewed; archive.
