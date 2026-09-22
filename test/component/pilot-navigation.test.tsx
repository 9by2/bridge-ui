import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "../../app/component/brand/stylex/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "../../app/component/brand/stylex/pagination"
import { PaginationLink as BaselineLink } from "../../app/component/shadcn/pagination"

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
        <BreadcrumbSeparator>
          <span data-testid="dot-separator">•</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
  expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("breadcrumb")
  expect(screen.getByRole("link", { name: "Current" }).getAttribute("aria-current")).toBe("page")
  expect(screen.getByText("/")).toBeTruthy()
  expect(screen.getByTestId("dot-separator")).toBeTruthy()
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
