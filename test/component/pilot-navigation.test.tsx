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
  PaginationEllipsis,
  PaginationActiveVariant
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
  expect(screen.getByText("Current").getAttribute("aria-current")).toBe("page")
  expect(screen.queryByRole("link", { name: "Current" })).toBeNull()
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
// Public contract: activeVariant is exposed to consumers and keeps aria-current on the active page only.
test("pagination activeVariant keeps the current page semantics", () => {
  render(
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#one" isActive activeVariant={PaginationActiveVariant.muted}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#two" activeVariant={PaginationActiveVariant.muted}>
            2
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
  expect(screen.getByText("1").getAttribute("aria-current")).toBe("page")
  expect(screen.getByText("1").getAttribute("data-active-variant")).toBe("muted")
  expect(screen.getByText("2").getAttribute("aria-current")).toBeNull()
})
