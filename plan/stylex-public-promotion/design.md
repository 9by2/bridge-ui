# Design

## Flow

```text
accepted private candidate
  -> owned app/component/brand source
  -> public root/direct export map
  -> static StyleX CSS + scoped adapter
  -> packed tarball
  -> private registry RC
  -> Bridge Web bounded fixture
```

Generated `app/component/shadcn/` remains an immutable reference. Promotion moves accepted implementation into owned source and updates public barrels/build entry discovery atomically. Direction and TsChart retain implementation identity because they own no presentation.

CSS packaging separates component rules and scoped compatibility selectors from any document-global reset. The existing `@bridge/ui/style.css` behavior changes only through reviewed release contract. Runtime series color and geometry remain documented inline/CSS-variable adapters.

Build-producing commands remain serialized because they share `dist/`. RC versioning, publication and tagging remain automated by Changesets/GitLab.
