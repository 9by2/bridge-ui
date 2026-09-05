# Upstream Source

TanStack Charts v0.16.0, commit 258ed39382b09843f98e6f48a2e9d4d0bd3f1d41.
https://github.com/TanStack/charts/tree/v0.16.0

188 catalog example, dependency closure and demo data copied under upstream MIT license (LICENSE). Dataset attribution remains in data source. React Chart import is adapted to the public Bridge TsChart wrapper. This directory is vendored third-party example source, not package production source. Catalog source disclosure displays the actual entry; supporting module is available in this directory.

Adaptation: Chart and RendererChart use TsChart; guarded indexed access meets the host's noUncheckedIndexedAccess setting. No upstream benchmark or test harness is imported. The dataset package is a local development dependency, excluded from the published UI package.

Accessibility adaptation: KPI trend and interactive metric label use readable foreground; the dashboard avoids nesting a main landmark and supplies table header text. Upstream theme-specific demonstration may intentionally retain its own palette rather than follow the Bridge theme toggle.
