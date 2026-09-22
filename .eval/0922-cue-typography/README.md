# Cue Typography Evaluation

## Reproduction

1. Run `bun catalog:build`.
2. Serve `catalog-dist` at `http://127.0.0.1:6013`.
3. Run `bun .eval/0922-cue-typography/verify.ts`.

## Evidence

- `typography-mobile.png`: Cue-theme typography catalog preview at 390px.
- `page-header-mobile.png`: Cue-theme Page header using the shared `h1` typography primitive.
- `report.json`: rendered heading tags, body line-height presence, page title primitive, and overflow results.
