import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import {
  DataState,
  DataStateAction,
  DataStateDescription,
  DataStateMedia,
  DataStateTitle
} from "../../app/component/brand/stylex/data-state"
import { PageToolbar } from "../../app/component/brand/stylex/page"
import { TableFrame, TableFrameHint, TableFrameViewport } from "../../app/component/brand/stylex/table-frame"
import {
  TimelineStep,
  TimelineStepConnector,
  TimelineStepContent,
  TimelineStepDescription,
  TimelineStepHeader,
  TimelineStepIndicator,
  TimelineStepItem,
  TimelineStepTime,
  TimelineStepTitle
} from "../../app/component/brand/stylex/timeline-step"

afterEach(cleanup)

test("timeline step retains native prop, ref, variant metadata and compound slot", () => {
  const ref = createRef<HTMLDivElement>()
  render(
    <TimelineStep ref={ref} orientation="horizontal" position="alternate" aria-label="Release progress">
      <TimelineStepItem state="current" orientation="horizontal">
        <TimelineStepHeader>
          <TimelineStepIndicator size="small" tone="primary">
            2
          </TimelineStepIndicator>
          <TimelineStepTitle>Package verification</TimelineStepTitle>
        </TimelineStepHeader>
        <TimelineStepConnector orientation="horizontal" treatment="dashed" state="current" />
        <TimelineStepContent>
          <TimelineStepDescription>ตรวจสอบแพ็กเกจสำหรับทุกแอปพลิเคชัน</TimelineStepDescription>
          <TimelineStepTime dateTime="2026-09-17">17 September</TimelineStepTime>
        </TimelineStepContent>
      </TimelineStepItem>
    </TimelineStep>
  )

  expect(ref.current).toBe(screen.getByLabelText("Release progress"))
  expect(ref.current?.getAttribute("data-orientation")).toBe("horizontal")
  expect(ref.current?.getAttribute("data-position")).toBe("alternate")
  expect(screen.getByText("Package verification").getAttribute("data-slot")).toBe("timeline-step-title")
  expect(screen.getByText("2").getAttribute("data-size")).toBe("small")
  expect(document.querySelector('[data-slot="timeline-step-connector"]')?.getAttribute("aria-hidden")).toBe("true")
})

test("page toolbar and table frame preserve caller-owned content and overflow boundary", () => {
  const toolbarRef = createRef<HTMLDivElement>()
  render(
    <>
      <PageToolbar ref={toolbarRef} aria-label="Filter" className="caller-toolbar">
        Filter content
      </PageToolbar>
      <TableFrame density="compact" className="caller-frame">
        <TableFrameHint>เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด</TableFrameHint>
        <TableFrameViewport tabIndex={0} aria-label="Account table">
          <table>
            <tbody>
              <tr>
                <td>Account</td>
              </tr>
            </tbody>
          </table>
        </TableFrameViewport>
      </TableFrame>
    </>
  )

  expect(toolbarRef.current).toBe(screen.getByLabelText("Filter"))
  expect(toolbarRef.current?.className).toContain("caller-toolbar")
  expect(screen.getByText("Account").closest('[data-slot="table-frame"]')?.getAttribute("data-density")).toBe("compact")
  expect(screen.getByLabelText("Account table").getAttribute("data-slot")).toBe("table-frame-viewport")
})

test("data state derives alert semantics while leaving media, copy and action controlled", () => {
  const { rerender } = render(
    <DataState variant="error" className="caller-state">
      <DataStateMedia>!</DataStateMedia>
      <DataStateTitle>Unable to load</DataStateTitle>
      <DataStateDescription>A long explanation supplied by the consuming application.</DataStateDescription>
      <DataStateAction>
        <button>Try again</button>
      </DataStateAction>
    </DataState>
  )

  expect(screen.getByRole("alert").className).toContain("caller-state")
  expect(screen.getByRole("button", { name: "Try again" })).not.toBeNull()
  expect(screen.getByText("!").getAttribute("data-slot")).toBe("data-state-media")

  rerender(
    <DataState variant="permission" role="status">
      <DataStateTitle>Access required</DataStateTitle>
    </DataState>
  )
  expect(screen.getByRole("status").getAttribute("data-variant")).toBe("permission")

  rerender(
    <DataState variant="loading">
      <DataStateTitle>Loading</DataStateTitle>
    </DataState>
  )
  expect(document.querySelector('[data-slot="data-state"]')?.getAttribute("data-variant")).toBe("loading")

  rerender(
    <DataState variant="disabled">
      <DataStateTitle>Unavailable</DataStateTitle>
    </DataState>
  )
  expect(document.querySelector('[data-slot="data-state"]')?.getAttribute("data-variant")).toBe("disabled")
})

test("timeline step covers every presentation treatment, state, size and tone", () => {
  const treatment = ["solid", "dashed", "dotted"] as const
  const state = ["default", "completed", "current", "upcoming"] as const
  const size = ["small", "default", "large"] as const
  const tone = ["default", "primary", "secondary", "destructive", "outline"] as const

  render(
    <>
      {treatment.flatMap((value) =>
        state.flatMap((itemState) =>
          (["vertical", "horizontal"] as const).map((orientation) => (
            <TimelineStepConnector
              key={`${value}-${itemState}-${orientation}`}
              treatment={value}
              state={itemState}
              orientation={orientation}
            />
          ))
        )
      )}
      {size.flatMap((value) =>
        tone.map((indicatorTone) => (
          <TimelineStepIndicator key={`${value}-${indicatorTone}`} size={value} tone={indicatorTone}>
            {indicatorTone}
          </TimelineStepIndicator>
        ))
      )}
      <TimelineStepItem state="completed">Completed</TimelineStepItem>
      <TimelineStepItem state="upcoming">Upcoming</TimelineStepItem>
    </>
  )

  expect(document.querySelectorAll('[data-slot="timeline-step-connector"]')).toHaveLength(24)
  expect(document.querySelectorAll('[data-slot="timeline-step-indicator"]')).toHaveLength(15)
  expect(screen.getByText("Completed").getAttribute("data-state")).toBe("completed")
  expect(screen.getByText("Upcoming").getAttribute("data-state")).toBe("upcoming")
})
