import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { PaginationLink as BaselineLink } from "../../app/component/shadcn/pagination"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "../../internal/pilot/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "../../internal/pilot/pagination"

afterEach(cleanup)
test("breadcrumb retains navigation semantics and caller separator", () => {
  render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
  expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("breadcrumb")
  expect(screen.getByRole("link", { name: "Current" }).getAttribute("aria-current")).toBe("page")
})
test("pagination retains baseline anchor role and active state", () => {
  const baseline = render(<BaselineLink href="#baseline">Baseline</BaselineLink>)
  const role = screen.getByText("Baseline").getAttribute("role")
  baseline.unmount()
  render(
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#previous" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#one" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#two">2</PaginationLink>
        </PaginationItem>
        <PaginationEllipsis />
        <PaginationItem>
          <PaginationNext href="#next" text="Next page" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
  expect(screen.getByText("1").getAttribute("aria-current")).toBe("page")
  expect(screen.getByText("1").getAttribute("role")).toBe(role)
  expect(screen.getByLabelText("Go to next page").getAttribute("href")).toBe("#next")
})
