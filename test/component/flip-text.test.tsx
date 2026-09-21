import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import { FlipText } from "../../app/component/brand/stylex/flip-text"

afterEach(cleanup)

test("flip text keeps native span props, ref, class name, and a single accessible label", () => {
  const ref = createRef<HTMLSpanElement>()
  render(
    <FlipText ref={ref} className="caller-text" aria-label="Animated welcome">
      Welcome home
    </FlipText>
  )

  const root = screen.getByLabelText("Animated welcome")
  expect(ref.current).toBe(root)
  expect(root.tagName).toBe("SPAN")
  expect(root.getAttribute("data-slot")).toBe("flip-text")
  expect(root.className).toContain("caller-text")
  expect(root.textContent).toBe("Welcome homeWelcome home")
  expect(root.querySelector('[aria-hidden="true"]')?.textContent).toBe("Welcome home")
})

test("flip text accepts explicit undefined timing values", () => {
  render(
    <FlipText duration={undefined} delay={undefined} loop={undefined} separator={undefined} together={undefined}>
      Default timing
    </FlipText>
  )

  expect(document.querySelector('[data-slot="flip-text-character"]')?.getAttribute("style")).toContain(
    "--flip-duration: 2.2s"
  )
})

test("flip text splits space-separated text into animated grapheme characters with staggered looping delay", () => {
  render(<FlipText>Hi all</FlipText>)

  const character = document.querySelectorAll('[data-slot="flip-text-character"]')
  expect(Array.from(character, (node) => node.getAttribute("data-character"))).toEqual(["H", "i", "a", "l", "l"])
  expect(character[0]?.getAttribute("style")).toContain("--flip-duration: 2.2s")
  expect(character[0]?.getAttribute("style")).toContain("--flip-delay: 0s")
  expect(character[0]?.getAttribute("style")).toContain("--flip-iteration: infinite")
  expect(character[1]?.getAttribute("style")).not.toContain("--flip-delay: 0s")
})

test("flip text preserves Thai and emoji grapheme cluster during splitting", () => {
  render(<FlipText separator="|">กำลัง 👍🏽</FlipText>)

  const character = document.querySelectorAll('[data-slot="flip-text-character"]')
  expect(Array.from(character, (node) => node.getAttribute("data-character"))).toEqual(["กำ", "ลั", "ง", " ", "👍🏽"])
})

test("flip text renders separators between every word", () => {
  render(<FlipText>One two three</FlipText>)

  expect(document.querySelector('[aria-hidden="true"]')?.textContent).toBe("One two three")
})

test("flip text applies an omitted caller class name", () => {
  render(<FlipText>Default class</FlipText>)

  expect(document.querySelector('[data-slot="flip-text"]')?.className).not.toContain("undefined")
})

test("flip text applies an empty caller class name", () => {
  render(<FlipText className="">Empty class</FlipText>)

  expect(document.querySelector('[data-slot="flip-text"]')?.className).not.toContain("undefined")
})

test("flip text applies caller timing, together delay, one iteration, and custom separators", () => {
  render(
    <FlipText duration={1} delay={0.3} loop={false} together separator="-">
      one-two
    </FlipText>
  )

  const character = document.querySelectorAll('[data-slot="flip-text-character"]')
  expect(character).toHaveLength(6)
  for (const node of character) {
    expect(node.getAttribute("style")).toContain("--flip-duration: 1s")
    expect(node.getAttribute("style")).toContain("--flip-delay: 0.3s")
    expect(node.getAttribute("style")).toContain("--flip-iteration: 1")
  }
  expect(document.querySelector('[aria-hidden="true"]')?.textContent).toBe("one-two")
})

test("flip text handles empty content", () => {
  const { rerender } = render(<FlipText>Text</FlipText>)
  expect(document.querySelectorAll('[data-slot="flip-text-character"]')).toHaveLength(4)

  rerender(<FlipText>{""}</FlipText>)
  expect(document.querySelectorAll('[data-slot="flip-text-character"]')).toHaveLength(0)
})

test("flip text safely renders an empty segmented word", () => {
  render(<FlipText separator="-">one--two</FlipText>)

  expect(document.querySelector('[aria-hidden="true"]')?.textContent).toBe("one--two")
  expect(document.querySelectorAll('[data-slot="flip-text-character"]')).toHaveLength(6)
})

test("flip text uses a zero stagger denominator for no grapheme content", () => {
  render(<FlipText separator="-">--</FlipText>)

  expect(document.querySelector('[aria-hidden="true"]')?.textContent).toBe("--")
  expect(document.querySelectorAll('[data-slot="flip-text-character"]')).toHaveLength(0)
})
