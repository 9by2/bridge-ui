import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldContent,
  FieldDescription,
  FieldTitle,
  FieldSet,
  FieldLegend,
  FieldSeparator
} from "../../internal/pilot/field"
import { Input } from "../../internal/pilot/input"

afterEach(cleanup)

test("pilot field slot preserves caller content and orientation", () => {
  for (const orientation of ["vertical", "horizontal", "responsive", null] as const) {
    const { unmount } = render(
      <FieldSet>
        <FieldLegend>Legend</FieldLegend>
        <FieldLegend variant="label">Label legend</FieldLegend>
        <FieldGroup>
          <Field orientation={orientation}>
            <FieldContent>
              <FieldTitle>Title</FieldTitle>
              <FieldDescription>Description</FieldDescription>
            </FieldContent>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <FieldSeparator />
        </FieldGroup>
      </FieldSet>
    )
    expect(screen.getByText("Title").dataset.slot).toBe("field-label")
    expect(screen.getByText("Description").dataset.slot).toBe("field-description")
    expect(screen.getByText("Or").dataset.slot).toBe("field-separator-content")
    unmount()
  }
  const { rerender } = render(<FieldError errors={[undefined]} />)
  expect(screen.queryByRole("alert")).toBeNull()
  rerender(<FieldError errors={[undefined, { message: "Known" }]} />)
  expect(screen.getAllByRole("listitem")).toHaveLength(1)
})
test("pilot field preserves native label, required, invalid and form value", () => {
  const ref = createRef<HTMLInputElement>()
  render(
    <form>
      <Field data-invalid>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" ref={ref} required aria-invalid="true" aria-describedby="error" />
        <FieldError id="error" errors={[{ message: "Required" }, { message: "Required" }]} />
      </Field>
    </form>
  )
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "person@example.com" } })
  expect(ref.current?.required).toBe(true)
  expect(ref.current?.getAttribute("aria-invalid")).toBe("true")
  expect(new FormData(ref.current?.form ?? undefined).get("email")).toBe("person@example.com")
  expect(screen.getByRole("alert").textContent).toBe("Required")
})
test("pilot field error retains child precedence and empty/multiple behavior", () => {
  const { rerender } = render(<FieldError />)
  expect(screen.queryByRole("alert")).toBeNull()
  rerender(<FieldError errors={[{ message: "One" }, { message: "Two" }, { message: "One" }]} />)
  expect(screen.getAllByRole("listitem")).toHaveLength(2)
  rerender(<FieldError errors={[{ message: "One" }]}>Override</FieldError>)
  expect(screen.getByRole("alert").textContent).toBe("Override")
})
