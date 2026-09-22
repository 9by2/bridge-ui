# Design: Customization Reference

## Overview

`CUSTOMIZATION.md` becomes the consumer customization entry point. It lists every public family in small functional groups and only names integration seams that matter: controlled state, composition children, semantic variants, structural props, and documented visual escape hatches.

## Structure

1. Setup and Theme
2. Universal conventions
3. Component index grouped by function
4. Focused recipes for customization-sensitive components

## Rules

- Do not restate native element props.
- Do not document StyleX classes, private `pilot-*` classes, or internal selectors.
- Use component family names, not every compound subcomponent, except where composition itself is the public API.
- Link consumers to the catalog for complete examples and states.
