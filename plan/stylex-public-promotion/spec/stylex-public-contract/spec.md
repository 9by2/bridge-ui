# StyleX Public Contract

**Status:** draft

1. Every supported package export resolves to the accepted owned implementation or a documented no-style identity exception.
2. Consumer imports React component and documented CSS only; no Tailwind/StyleX transform or runtime injection is required.
3. Root/direct/subpath provider identity is stable. MultiSelectValue and Sonner alias distinctions remain intentional.
4. Static component CSS and scoped adapter load once. Outside theme sentinel is unchanged in either load order.
5. Runtime engine geometry/color adapter is bounded, CSP-reviewed and rejects unsafe input.
6. Packed ESM, declaration, source map, CSS, client, SSR, hydration, tree-shaking and registry install pass.
7. Minor RC proof precedes stable publication and consumer migration.
