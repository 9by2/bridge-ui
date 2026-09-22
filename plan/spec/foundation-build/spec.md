# Foundation Build Contract

**Status:** accepted

StyleX compilation emits static CSS into the shared package CSS entry. Root and direct import require no consumer compiler. Generated source remains CLI-owned. Package runtime under `app/` and `shared/` participates in the 90% coverage gate, excluding generated Shadcn source and the export-only barrel; every owned component retains 100% in each coverage metric. Command, static catalog build, package and tree-shaking verification remain separate required CI gates. Complete Bun.WebView accessibility, visual, interaction and memory verification remains a separate required local pre-push gate.

Private registry integration proves automated RC and stable publication, isolated Bun installation, and immutable version/tag behavior without persisting credential. The exact current registry artifact passes the bounded consumer fixture and matching-chart probe. Consumer adoption happens outside this repository after every ADHD foundation gate is explicitly reconciled and passing.
