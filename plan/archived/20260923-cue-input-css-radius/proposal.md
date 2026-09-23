# Cue Input CSS Radius

**Proposal:** `cue-input-css-radius`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#5-quality)

## Problem

Theme writes Cue's `0.5em` default inline, shadowing the published stylesheet. The stylesheet should own defaults; Theme should write only explicit radius overrides.

## Scope

- Move Cue control radius default to `app/style/component.css`.
- Preserve nested Theme overrides and Input geometry in Cue and other modes.
- Amend the Cue Input radius spec and usage documentation.

## Non-Goals

- New Input variants or consumer migration.
- Editing generated Shadcn source or unrelated theme tokens.

## Success Criteria

- [x] Published CSS owns the default and Cue control radius declarations.
- [x] Default Theme has no inline control radius; explicit override still works.
- [x] Browser geometry and package gates pass.

## Specs

| Spec             | Path                            | Summary                                        |
| ---------------- | ------------------------------- | ---------------------------------------------- |
| cue-input-radius | `spec/cue-input-radius/spec.md` | CSS-owned default with explicit Theme override |
