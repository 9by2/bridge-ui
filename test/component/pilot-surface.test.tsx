import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import { Alert, AlertTitle, AlertDescription, AlertAction } from "../../app/component/brand/stylex/alert"
import { AspectRatio } from "../../app/component/brand/stylex/aspect-ratio"
import { Badge, badgeVariants } from "../../app/component/brand/stylex/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter
} from "../../app/component/brand/stylex/card"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  EmptyVariant
} from "../../app/component/brand/stylex/empty"
import { Kbd, KbdGroup } from "../../app/component/brand/stylex/kbd"
import { Marker, MarkerIcon, MarkerContent, markerVariants } from "../../app/component/brand/stylex/marker"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "../../app/component/brand/stylex/native-select"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator
} from "../../app/component/brand/stylex/progress"
import { Separator } from "../../app/component/brand/stylex/separator"
import { Skeleton } from "../../app/component/brand/stylex/skeleton"
import { Spinner } from "../../app/component/brand/stylex/spinner"
import { Textarea } from "../../app/component/brand/stylex/textarea"

afterEach(cleanup)

test("primitive callback class remains composable", () => {
  const { container } = render(
    <>
      <Progress value={50} className={() => "root"}>
        <ProgressLabel className={() => "label"}>Progress</ProgressLabel>
        <ProgressValue className={() => "value"} />
        <ProgressTrack className={() => "track"}>
          <ProgressIndicator className={() => "indicator"} />
        </ProgressTrack>
      </Progress>
      <Separator className={() => "separator"} />
    </>
  )
  for (const name of ["root", "label", "value", "track", "indicator", "separator"])
    expect(container.querySelector(`.${name}`)).not.toBeNull()
})

test("native select invalid state stays on native control", () => {
  for (const invalid of [true, "true", false] as const) {
    const { unmount } = render(
      <NativeSelect aria-label="Invalid" aria-invalid={invalid}>
        <NativeSelectOption>Choice</NativeSelectOption>
      </NativeSelect>
    )
    expect(screen.getByRole("combobox").getAttribute("aria-invalid")).toBe(String(invalid))
    unmount()
  }
})

test("progress retains primitive value and accessible label", () => {
  const { rerender } = render(
    <Progress value={25}>
      <ProgressLabel>Upload</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("25")
  rerender(<Progress value={null} aria-label="Loading" />)
  expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(false)
})

test("native select retains option, ref and size", () => {
  for (const size of [undefined, "sm"] as const) {
    const ref = createRef<HTMLSelectElement>()
    const { unmount } = render(
      <NativeSelect aria-label="Choice" ref={ref} size={size} defaultValue="a">
        <NativeSelectOptGroup label="Group">
          <NativeSelectOption value="a">A</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    )
    expect(ref.current?.value).toBe("a")
    expect(ref.current?.getAttribute("data-size")).toBe(size ?? "default")
    unmount()
  }
})

test("ratio and separator preserve native override and direction", () => {
  const { rerender } = render(
    <AspectRatio ratio={2} data-testid="ratio">
      <Separator />
    </AspectRatio>
  )
  expect(screen.getByTestId("ratio").style.aspectRatio).toBe("2 / 1")
  expect(screen.getByRole("separator").getAttribute("aria-orientation")).not.toBe("vertical")
  rerender(
    <AspectRatio ratio={1} style={{ aspectRatio: "3" }} data-testid="ratio">
      <Separator orientation="vertical" />
    </AspectRatio>
  )
  expect(screen.getByTestId("ratio").style.aspectRatio).toBe("3 / 1")
  expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical")
})

test("textarea retains native value and invalid contract", () => {
  for (const invalid of [undefined, true, "true", false] as const) {
    const { unmount } = render(
      <Textarea aria-label="Comment" aria-invalid={invalid} defaultValue="Text" required name="comment" />
    )
    expect(screen.getByRole("textbox").getAttribute("name")).toBe("comment")
    expect(screen.getByRole("textbox").textContent).toBe("Text")
    unmount()
  }
})

test("marker preserves render and variant helper", () => {
  for (const variant of [undefined, null, "default", "separator", "border"] as const) {
    const { unmount } = render(
      <Marker variant={variant} render={<a href="#marker" />}>
        <MarkerIcon>Icon</MarkerIcon>
        <MarkerContent>Copy</MarkerContent>
      </Marker>
    )
    expect(screen.getByRole("link").getAttribute("href")).toBe("#marker")
    expect(screen.getByText("Icon").getAttribute("aria-hidden")).toBe("true")
    expect(typeof markerVariants({ variant })).toBe("string")
    unmount()
  }
  expect(markerVariants()).toBeTypeOf("string")
})

test("alert and empty retain slot and content contract", () => {
  for (const variant of [undefined, null, "default", "destructive"] as const) {
    const { unmount } = render(
      <Alert variant={variant}>
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>Detail</AlertDescription>
        <AlertAction>Action</AlertAction>
      </Alert>
    )
    expect(screen.getByRole("alert").textContent).toBe("NoticeDetailAction")
    unmount()
  }
  for (const variant of [undefined, null, "default", "icon"] as const) {
    const { unmount } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={variant}>Icon</EmptyMedia>
          <EmptyTitle>Empty</EmptyTitle>
          <EmptyDescription>Nothing here</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    )
    expect(screen.getByText("Nothing here").tagName).toBe("DIV")
    expect(screen.getByText("Icon").getAttribute("data-slot")).toBe("empty-icon")
    unmount()
  }
  // Public contract: the surface variant is exposed for consumer composition.
  for (const variant of [undefined, EmptyVariant.outline, EmptyVariant.muted] as const) {
    const { container, unmount } = render(<Empty variant={variant}>Content</Empty>)
    expect(container.querySelector('[data-slot="empty"]')?.getAttribute("data-variant")).toBe(variant ?? "default")
    unmount()
  }
})

test("badge preserves link render, helper string and variant state", () => {
  for (const variant of [
    undefined,
    null,
    "default",
    "secondary",
    "destructive",
    "warning",
    "success",
    "partial-success",
    "outline",
    "ghost",
    "link"
  ] as const) {
    const { unmount } = render(
      <Badge variant={variant} render={<a href="#target" />} className="caller">
        Badge
      </Badge>
    )
    expect(screen.getByRole("link").getAttribute("href")).toBe("#target")
    expect(screen.getByRole("link").className).toContain("caller")
    expect(typeof badgeVariants({ variant })).toBe("string")
    unmount()
  }
  expect(badgeVariants()).toBeTypeOf("string")
  for (const invalid of [true, "true", false] as const) {
    const { unmount } = render(<Badge aria-invalid={invalid}>Invalid</Badge>)
    expect(screen.getByText("Invalid").getAttribute("aria-invalid")).toBe(String(invalid))
    unmount()
  }
})

test("card retains compound slot, size, radius and native callback", () => {
  for (const size of [undefined, "sm"] as const) {
    const { unmount, container } = render(
      <Card size={size} className="caller">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Copy</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(container.querySelector("[data-slot=card]")?.getAttribute("data-size")).toBe(size ?? "default")
    expect(container.querySelectorAll("[data-slot]").length).toBe(7)
    expect(screen.getByText("Body").getAttribute("data-slot")).toBe("card-content")
    unmount()
  }
})

test("card exposes every supported radius option", () => {
  for (const radius of [undefined, "none", "sm", "default", "lg"] as const) {
    const { container, unmount } = render(<Card radius={radius}>Card</Card>)
    expect(container.querySelector('[data-slot="card"]')?.getAttribute("data-radius")).toBe(radius ?? "default")
    unmount()
  }
})

test("loading surface preserves ref, accessible copy and caller override", () => {
  const ref = createRef<HTMLDivElement>()
  render(
    <>
      <Skeleton />
      <Skeleton ref={ref} data-testid="skeleton" className="caller" style={{ width: 80 }} />
      <Spinner />
      <Spinner aria-label="Saving" className="caller" />
    </>
  )
  expect(ref.current).toBe(screen.getByTestId("skeleton"))
  expect(ref.current?.className).toContain("caller")
  expect(ref.current?.style.width).toBe("80px")
  expect(screen.getByRole("status", { name: "Loading" }).getAttribute("data-slot")).toBe("spinner")
  expect(screen.getByRole("status", { name: "Saving" }).getAttribute("class")).toContain("caller")
})

test("keyboard hint retains native tag and child composition", () => {
  render(
    <KbdGroup className="caller">
      <Kbd>Ctrl</Kbd>
      <Kbd className="key">K</Kbd>
    </KbdGroup>
  )
  expect(screen.getByText("Ctrl").tagName).toBe("KBD")
  expect(screen.getByText("K").className).toContain("key")
  expect(screen.getByText("K").parentElement?.getAttribute("data-slot")).toBe("kbd-group")
})
