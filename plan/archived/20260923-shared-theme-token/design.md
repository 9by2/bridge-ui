# Design: Shared Theme Token

Keep StyleX's mode-specific token definitions for fallback values, but route owned recipe uses through literal public semantic `var(--bridge-..., <mode-token>)` expressions so static extraction retains the names. Define common defaults in the published `component.css`; Theme writes only theme-level overrides. Preserve semantic props by applying them to the component element without publishing component-specific CSS variables. Validate the packed CSS and browser computed style.

```ts
const style = stylex.create({ success: { backgroundColor: `var(--bridge-color-brand, ${token.brand})` } })
```

Risk: StyleX does not statically extract indirect object members. Keep expressions in recipe declarations; verify the emitted CSS after each slice. Distinguish state colors from semantic theme colors, and retain existing mode-specific defaults.

## Progress

Button, Dialog, and Slider now read shared theme names; Slider semantic color props apply inline to the range/thumb. The compiler probe showed that `var(--bridge-color-primary, mode-value)` in a StyleX token requires a distinct fallback in each mode. Do not put a single default palette color on `[data-bridge-theme]` or it will shadow all four mode palettes. Owned recipe palette references and common font-size and radius literals now use shared variables, while intentionally square/circular shapes and data-driven colors stay local.
