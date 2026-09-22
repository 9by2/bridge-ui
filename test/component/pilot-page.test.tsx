import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import {
  Page,
  PageAction,
  PageBreadcrumb,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeading,
  PageToolbar,
  PageTitle
} from "../../app/component/brand/stylex/page"

afterEach(cleanup)

test("page retains semantic slot, native prop, ref and optional composition", () => {
  const ref = createRef<HTMLDivElement>()
  const { rerender } = render(
    <Page ref={ref} aria-label="Account page" className="caller">
      <PageHeader>
        <PageHeading>
          <PageTitle>A very long dynamic account title that must remain within the content width</PageTitle>
        </PageHeading>
      </PageHeader>
      <PageContent>Body</PageContent>
    </Page>
  )

  expect(ref.current).toBe(document.querySelector('[data-slot="page"]'))
  expect(ref.current?.tagName).toBe("DIV")
  expect(screen.queryByRole("main")).toBeNull()
  expect(ref.current?.className).toContain("caller")
  expect(screen.getByRole("heading", { level: 1 }).getAttribute("data-slot")).toBe("page-title")
  expect(screen.queryByText("Breadcrumb")).toBeNull()
  expect(screen.queryByText("Action")).toBeNull()

  rerender(
    <Page>
      <PageBreadcrumb>Breadcrumb</PageBreadcrumb>
      <PageHeader>
        <PageHeading>
          <PageTitle>Title</PageTitle>
          <PageDescription>Description</PageDescription>
        </PageHeading>
        <PageAction>
          <button>Action</button>
        </PageAction>
      </PageHeader>
      <PageToolbar aria-label="Filter">Toolbar</PageToolbar>
      <PageContent>Body</PageContent>
    </Page>
  )

  for (const slot of [
    "page",
    "page-breadcrumb",
    "page-header",
    "page-heading",
    "page-title",
    "page-description",
    "page-action",
    "page-toolbar",
    "page-content"
  ])
    expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
  expect(screen.getByRole("button", { name: "Action" })).not.toBeNull()
})
