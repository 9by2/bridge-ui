# Design: Restore CI Coverage

## Overview

Cover existing public board contracts through Testing Library. Do not alter runtime source or lower the configured threshold.

## Components

| Component          | Responsibility                                   | Location                                  |
| ------------------ | ------------------------------------------------ | ----------------------------------------- |
| SwimLaneBoard test | Proves collapse and controlled callback behavior | `test/component/swim-lane-board.test.tsx` |

## Data Flow

1. A consumer renders a board with columns and cells.
2. A consumer toggles a column through its accessible control.
3. The component exposes the changed controlled value through its callback.

## Risks & Mitigations

| Risk                                                   | Mitigation                                               |
| ------------------------------------------------------ | -------------------------------------------------------- |
| Coverage-only assertions become implementation-coupled | Assert accessible controls and consumer callback values. |
