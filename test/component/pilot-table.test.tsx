import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from "../../internal/pilot/table"

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
