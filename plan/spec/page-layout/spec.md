# Page Layout

**Status:** accepted

Purpose: define the reusable page presentation contract.

- Export `Page`, `PageBreadcrumb`, `PageHeader`, `PageHeading`, `PageTitle`, `PageDescription`, `PageAction`, and `PageContent`.
- `Page` is a neutral `div` layout root; the consumer route owns the document's single top-level `main` landmark.
- Every slot forwards native element props and React ref.
- Breadcrumb, description, and action are optional without reserved empty space.
- Header aligns heading left and action right on wide viewport.
- Header and action stack on narrow viewport.
- Page uses responsive spacing, width 100%, min-width 0, and centered maximum content width.
- Title supports long dynamic content without horizontal overflow.
- Component imports no consumer router, i18n, state, or application layer.
