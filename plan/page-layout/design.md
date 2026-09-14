# Design

Purpose: define a presentation-only compound page component.

`Page` centers a bounded content column with responsive padding. `PageBreadcrumb`, `PageHeader`, `PageHeading`, `PageTitle`, `PageDescription`, `PageAction`, and `PageContent` are semantic slots using package token and StyleX only.

Every slot forwards native props and ref through React 19. The component owns no copy, router, button, query, or business state. Consumers inject package Breadcrumb and Button children.
