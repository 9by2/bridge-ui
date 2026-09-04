# Design: Phase 3 Testable Storybook

## Overview

Storybook consumes public exports from `@bridge/ui`, while story files remain private repository fixtures. Each generated module gets a dedicated story file so inventory is mechanically comparable. Browser mode runs CSF stories and `play` interactions in Chromium.

## Architecture

```mermaid
flowchart LR
  Package[@bridge/ui root export] --> Story[63 module stories]
  Theme[style.css and preview decorators] --> Story
  Story --> Static[Static Storybook]
  Story --> Browser[Vitest browser project]
  Inventory[Story inventory test] --> Story
```

## Component

| Component        | Responsibility                                | Location                                    |
| ---------------- | --------------------------------------------- | ------------------------------------------- |
| Storybook config | React-Vite builder and addons                 | `.storybook/main.ts`                        |
| Preview          | CSS, theme, viewport, locale, motion fixtures | `.storybook/preview.tsx`                    |
| Story catalog    | One CSF file per generated module             | `storybook/shadcn/`                         |
| Inventory check  | Compare component and story basenames         | `test/internal/storybook-inventory.test.ts` |
| Browser project  | Execute stories and play functions            | `vitest.config.ts`                          |

## Story Contract

Every story file:

- imports from `@bridge/ui`, not repository component paths;
- has an explicit title under `Shadcn/`;
- enables autodocs;
- renders at least one meaningful state;
- avoids product domain and i18n dependencies.

Interactive family stories add `play` assertions using role-based queries and `userEvent`.

## Fixture Toolbar

Preview globals expose:

- theme: light or dark;
- locale fixture: English or Thai copy;
- motion: normal or reduced;
- standard Storybook viewport control including mobile.

Decorators apply classes and attributes without adding package runtime providers except required UI providers such as tooltip and theme.

## Test Seam

1. Inventory test verifies all 63 basenames.
2. Static build proves all stories compile.
3. Vitest browser project loads every story.
4. `play` functions observe public rendered behavior.

## Risk & Mitigation

| Risk                                              | Mitigation                                                    |
| ------------------------------------------------- | ------------------------------------------------------------- |
| 63 stories become repetitive                      | Keep each file focused; share only private story fixtures.    |
| Complex components need providers                 | Add private decorators/fixtures, never production containers. |
| Browser install unavailable                       | Use Playwright-managed Chromium and fail setup explicitly.    |
| Story imports bypass package contract             | Enforce `@bridge/ui` root imports in inventory test.          |
| Static catalog passes but interactions do not run | Separate headless browser test command is mandatory.          |
