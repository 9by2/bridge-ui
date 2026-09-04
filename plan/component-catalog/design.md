# Catalog Design

Vite serves a private React catalog under `internal/catalog/`. Existing real fixture compositions become independent example modules. A build-time transformation extracts each switch case into an example, keeping preview and displayed source together. Each preview uses an iframe so overlay and sidebar cannot cover the documentation navigation. The browser suite visits every example and retains core interaction verification.

```tsx
export default function Example() {
  return <UI.Button>Continue</UI.Button>
}
```

The source shown is the actual example module, not a hand-maintained approximation. Variant gallery remains available alongside focused default preview. A clean neutral shell uses compact navigation, generous preview space and optional comparison rather than addon chrome.
