# Foundation Build Contract

**Status:** active

StyleX compilation emits static CSS into the shared package CSS entry. Root and direct import require no consumer compiler. Generated source remains CLI-owned. Package runtime under `app/` and `shared/` participates in the 90% coverage gate, excluding generated Shadcn source and the export-only barrel; every owned component retains 100% in each coverage metric. Command, catalog, accessibility, package, tree-shaking, and Bun.WebView verification remain separate required gate.

Private registry integration must prove automated RC and stable publication, isolated Bun installation, and immutable version/tag behavior without persisting credential. Before foundation approval, the exact current registry artifact must also pass the bounded Bridge Web fixture and matching-chart probe. Consumer migration remains blocked until every ADHD foundation gate is explicitly reconciled and passing.
