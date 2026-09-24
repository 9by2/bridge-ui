---
"@bridge/ui": minor
---

Add Sonner imperative export and `Spinner` size.

- Root `sonnerToast` and `@bridge/ui/sonner` subpath (`Toaster`, `toast`) share the package Sonner instance with `SonnerToaster`. The Base UI `toast` export is unchanged; JSDoc on both names its paired toaster.
- `Spinner` accepts `size` (`SpinnerSize`: `sm`, `default`, `lg`); default render is unchanged. New `@bridge/ui/spinner` subpath.
