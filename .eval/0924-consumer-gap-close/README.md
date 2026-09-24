# 0924 Consumer Gap Close — Bun.WebView evidence

Reproduce (builds catalog, serves it, runs runner):

```sh
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p0-runner.test.ts
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-page-runner.test.ts
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
