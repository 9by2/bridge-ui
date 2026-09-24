# 0924 Consumer Gap Close — Bun.WebView evidence

Reproduce (builds catalog, serves it, runs runner):

```sh
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p0-runner.test.ts
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-page-runner.test.ts
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-upload-runner.test.ts
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-calendar-runner.test.ts
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-icon-probe.test.ts
```

## P0

| Step | Expected | Evidence |
| --- | --- | --- |
| Open `#sonner/default`, click **Success** | `sonnerToast.success` renders "Change saved" inside `SonnerToaster` | `p0-sonner-success.png` |
| Open `#spinner/size` light/dark | computed size sm 12px, default 16px, lg 24px; `sm` inside disabled Button stays 12px | `p0-spinner-light.png`, `p0-spinner-dark.png` |

Finding: first run measured the in-Button `sm` spinner at 16px — `.pilot-button svg:not([class*="size-"])` overrode the explicit size. Fixed (DEC-009) and regression-tested in `test/component/spinner.test.tsx`.

## P1-1 Page

| Step | Expected | Evidence |
| --- | --- | --- |
| `#page/width` 1600px light/dark | max-width full none, content 1280px, form 768px, editor none + 0 inline padding | `p1-page-width-*-desktop.png` |
| `#page/width` 390px | no document overflow | `p1-page-width-*-mobile.png` |
| `#page/header-slot`, click **Try again** | filter spans header row; `onRetry` increments attempt | `p1-page-header-slot*.png` |
| `#page/form` scroll container | sticky `PageFormAction` pinned at container bottom | `p1-page-form-sticky.png` |

Finding: first run measured `content` max-width `none` — its StyleX key collided with `PageContent`'s `content` style. Renamed to `widthContent`; guarded by `test/browser/responsive.test.ts`.

## P1-3 Upload

| Step | Expected | Evidence |
| --- | --- | --- |
| `#upload-list/validation`: select red.png, blue.png, notes.pdf (light/dark) | 2 grid tiles, inline `role=alert` for notes.pdf, log `change: append …` + `issue: file-invalid-type`, no Sonner toaster | `p1-upload-grid-*-desktop.png` |
| same at 390px | no document overflow | `p1-upload-grid-*-mobile.png` |
| `#upload-list/single`: select contract-v2.pdf | reason `replace`, v1 gone | `p1-upload-single-replace.png` |
| Keyboard remove (in `test/browser/upload-composition.test.ts`) | focus returns to "Choose image" | compact gate |

## P1-2 BridgeCalendar

| Step | Expected | Evidence |
| --- | --- | --- |
| `#bridge-calendar/parity` light/dark | Brand launch border `rgb(124, 58, 237)` from `color`; 1 muted event; holiday badge + meta | `p1-calendar-light.png`, `p1-calendar-dark.png` |
| CDP `Input.dispatchDragEvent` dragEnter/dragOver on Sep 10 | dashed drop-target highlight on Sep 10 only | `p1-calendar-drag-hover.png` |
| CDP drop | highlight cleared, log `drop: Thu Sep 10 2026` | `p1-calendar-drop.png` |
| 390px | no document overflow | runner assertion |

Finding: the first mobile run overflowed at 806px because the catalog example's CSS grid auto column took the calendar's min-content width. The example was fixed with a flex column; the component is unchanged (`bridge-calendar/month` was already contained).

## P1-4 Icon slot

Audit: `#item/custom-icon` renders a neutral SVG with no intrinsic size and `currentColor` in every slot, then measures it.

| Slot | Before | After |
| --- | --- | --- |
| MetricTile icon | 34×34 (filled box) | 18×18 |
| DataStateMedia | filled box | 24×24 |
| EmptyMedia icon | 32×32 (filled box) | 16×16 |
| SettingsNavItem | unsized | 16×16 + 8px gap |
| Button / ItemMedia / Marker / Badge / Sidebar | ok | unchanged |

Explicitly sized lucide icons in `#metric-tile/variants` stay at 18px. Evidence: `p1-icon-slot.png`.
