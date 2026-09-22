# Reproduction

1. Run `bun catalog:build`.
2. Serve `catalog-dist` at `http://127.0.0.1:61637`.
3. Run `bun .eval/0922-bridge-calendar-extraction/verify.ts`.
4. Inspect desktop and mobile screenshots plus `report.json`.

The check switches the public catalog example to timed week view, confirms all 24 time-ruler labels and the current-time marker render, and verifies no document overflow at desktop or mobile widths.
