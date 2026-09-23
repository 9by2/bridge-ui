# 0924 color-picker

Runner: `bun dev` then `CATALOG_URL=http://127.0.0.1:6006 bun .eval/0924-color-picker/verify.ts`.

Steps (desktop 1024 + mobile 390):

1. `color-picker/default`: 23 preset radios + custom trigger, `White` checked, no page overflow.
2. Focus checked swatch, ArrowRight -> `Slate` focused and checked.
3. `color-picker/custom`: open custom popover, type `#3366cc` -> controlled value `#3366cc`, extra swatch checked; Escape returns focus to trigger.
4. `color-picker/variants`: sm/md/lg grid + sm/md row; no document overflow (row scrolls internally).
5. `color-picker/states`: disabled, no custom, preselected custom, dark theme.

Evidence: `*.png`, `report.json`.
