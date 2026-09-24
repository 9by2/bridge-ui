# 0924 Consumer Gap Close — Bun.WebView evidence

Reproduce (builds catalog, serves it, runs runner):

```sh
bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p0-runner.test.ts
```

## P0

| Step | Expected | Evidence |
| --- | --- | --- |
| Open `#sonner/default`, click **Success** | `sonnerToast.success` renders "Change saved" inside `SonnerToaster` | `p0-sonner-success.png` |
| Open `#spinner/size` light/dark | computed size sm 12px, default 16px, lg 24px; `sm` inside disabled Button stays 12px | `p0-spinner-light.png`, `p0-spinner-dark.png` |

Finding: first run measured the in-Button `sm` spinner at 16px — `.pilot-button svg:not([class*="size-"])` overrode the explicit size. Fixed (DEC-009) and regression-tested in `test/component/spinner.test.tsx`.
