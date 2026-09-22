# Coverage and Test Gates

**Proposal:** `coverage-and-test-gates`
**Status:** in-progress

## Problem

Runtime coverage misses owned branches and the full catalog suite contains a failing Card-radius assertion.

## Scope

- Identify and cover meaningful public behavior behind runtime coverage misses.
- Correct real behavior or invalid test expectations in the full test suite.
- Run all required test and verification gates.

## Out of Scope

- Adding presentation-only tests solely to increase coverage.
- Lowering coverage thresholds or excluding owned runtime source.

## Success Criteria

- [ ] `bun coverage:runtime` passes its configured thresholds.
- [ ] `bun test` and `bun catalog:test` pass.

## Spec

| Spec                    | Path                                   | Summary                                         |
| ----------------------- | -------------------------------------- | ----------------------------------------------- |
| coverage-and-test-gates | `spec/coverage-and-test-gates/spec.md` | Runtime coverage and public test gate contract. |
