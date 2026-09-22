import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  Table,
  TableHint,
  TableViewport,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from "../../app/component/brand/stylex/table"
import { TableFrame, TableFrameHint, TableFrameViewport } from "../../app/component/brand/stylex/table-frame"

afterEach(cleanup)
test("table retains native semantic composition and caller override", () => {
  render(
    <Table className="caller">
      <TableCaption>Invoice</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>100</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
  expect(screen.getByRole("table").className).toContain("caller")
  expect(screen.getByRole("columnheader").getAttribute("scope")).toBe("col")
  expect(screen.getAllByRole("row")).toHaveLength(3)
  expect(screen.getByRole("table").parentElement?.getAttribute("data-slot")).toBe("table-container")
})

test("framed table is canonical while TableFrame remains compatible", () => {
  render(
    <>
      <Table variant="frame" density="compact" aria-label="Canonical frame">
        <TableHint>Scroll</TableHint>
        <TableViewport aria-label="Canonical viewport">
          <table>
            <tbody>
              <tr>
                <td>Canonical</td>
              </tr>
            </tbody>
          </table>
        </TableViewport>
      </Table>
      <TableFrame density="standard" aria-label="Compatible frame">
        <TableFrameHint>Scroll</TableFrameHint>
        <TableFrameViewport aria-label="Compatible viewport">
          <table>
            <tbody>
              <tr>
                <td>Compatible</td>
              </tr>
            </tbody>
          </table>
        </TableFrameViewport>
      </TableFrame>
    </>
  )
  expect(screen.getByLabelText("Canonical frame").getAttribute("data-density")).toBe("compact")
  expect(screen.getByLabelText("Canonical frame").getAttribute("data-fill")).toBe("width")
  expect(screen.getByLabelText("Canonical viewport").getAttribute("data-slot")).toBe("table-viewport")
  expect(screen.getByLabelText("Compatible frame").getAttribute("data-slot")).toBe("table-frame")
  expect(screen.getByLabelText("Compatible viewport").getAttribute("data-slot")).toBe("table-frame-viewport")
})

test("framed table defaults to standard density", () => {
  render(<Table variant="frame" aria-label="Standard frame" />)

  expect(screen.getByLabelText("Standard frame").getAttribute("data-density")).toBe("standard")
})
