# 0924 color-picker

Runner: `bun dev` then `CATALOG_URL=http://127.0.0.1:6006 bun .eval/0924-color-picker/verify.ts`.

Steps (desktop 1024 + mobile 390):

1. `color-picker/default`: 23 preset radios + custom trigger, `White` checked, no page overflow.
2. Focus checked swatch, ArrowRight -> `Slate` focused and checked.
3. `color-picker/fill` (`mode="fill"`): open editor, type `#3366cc` -> controlled value `#3366cc`, extra swatch checked; Escape returns focus to trigger.
3b. `color-picker/gradient` (`mode="gradient"`): open editor, Type -> conic, toggle Repeating, Add stop -> value `repeating-conic-gradient(from 0deg, #f97316 0%, #facc15 100%, #facc15 100%)`, extra swatch checked, 3 stop rows, panel inside viewport.
4. `color-picker/variants`: sm/md/lg grid + sm/md row; no document overflow (row scrolls internally).
5. `color-picker/states`: disabled, no custom, preselected custom, dark theme.

Evidence: `*.png`, `report.json`.
