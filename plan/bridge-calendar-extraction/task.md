# Tasks: Bridge Calendar Extraction

Implementation order matters - complete top to bottom.

## Setup

- [x] Review this proposal and settle the keyboard-equivalent slot-selection design before implementation.
- [x] Add a failing public-contract test suite for the root API, controlled state, navigation, callbacks, overlap-day boundary, scheduled pagination, month drop, and cleanup.
- [x] Record the source migration inventory and exclude Bridge Web-only mappings, i18n, and consumer migration.

## Core

- [x] Create the StyleX `BridgeCalendar` feature with generic types, `bridgeCalendarView` constant, root context, and controlled/uncontrolled date/view behavior.
- [x] Implement token-driven header/navigation and caller-provided labels/action content.
- [x] Implement scheduled, week, and month views with generic event and holiday rendering, render overrides, and typed UI intent callbacks.
- [x] Preserve correct multi-day range overlap semantics, including a range ending at the next day midnight.
- [x] Add client-safe observer, document event, interval, and focus cleanup behavior.
- [x] Implement accessible keyboard and pointer paths for public interactive behavior.
- [x] Add time ruler, current-time marker, and same-day timed drag selection to week view.
- [x] Extend public-contract tests for time formatting, current-time position, pointer drag range, and event-selection isolation.
- [x] Record the Bridge Web parity inventory and define package-owned behavior separately from queue mapping and workspace composition.
- [x] Add failing public-contract tests for packed week overlaps, all-day week placement, configurable week starts, localized period labels, tab keyboard interaction, automatic pagination, initial week scroll, and dynamic month rows.
- [x] Implement packed timed-event layout and a separate all-day week lane.
- [x] Add caller-provided period formatting and `weekStartsOn`; use the package Tabs primitive for the view control.
- [x] Restore scheduled intersection-observer pagination, initial week scrolling, and dynamic month row count with SSR-safe cleanup.

## Integration

- [x] Export the feature from `app/index.ts` and add the `@bridge/ui/bridge-calendar` package subpath.
- [ ] Add scheduled, week, month, empty, holiday, overflow, loading-more, controlled, mobile, long-copy, Thai-copy, dark, and reduced-motion catalog examples. The scheduled/week default and month timed/all-day states are implemented; remaining states are follow-up.
- [x] Document setup, labels, controlled state, render overrides, callbacks, and supported theme customization in `CUSTOMIZATION.md`.
- [x] Add a minor Changeset for the public component.

## Verification

- [ ] Run focused component tests and runtime coverage; meet the owned non-generated component coverage requirements. Blocked: component coverage is 90.52% statements / 79.59% branches / 86.95% functions / 92.4% lines; repository runtime coverage passes.
- [ ] Run `bun fmt`, `bun lint`, `bun typecheck`, `bun boundary`, `bun test`, `bun coverage:runtime`, `bun run build`, `bun catalog:build`, `bun catalog:test`, `bun verify:package`, and `bun verify:tree-shaking`. Blocked: full `catalog:test` has one unrelated existing `swim-lane-board/default` accessibility failure; BridgeCalendar passes its catalog accessibility check.
- [x] Capture Bun.WebView screenshots, reproduction steps, and runner output under `.eval/0922-bridge-calendar-extraction/`.
- [x] Verify the packed package in the client and SSR fixtures, including the direct subpath export and CSS loading.
- [ ] All specs in `spec/` reviewed against implementation.
- [ ] Archive proposal per plan workflow after all tasks are complete.
