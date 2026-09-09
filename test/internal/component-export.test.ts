import { expect, test } from "bun:test"

import { Effect, Exit } from "effect"

import { inspectComponentExport } from "../../internal/component-export"

test("export inventory identifies a compound component and type without counting private declaration", async () => {
  const result = await Effect.runPromise(
    inspectComponentExport(`
    const hidden = 1
    export function Button() { return <button /> }
    export interface ButtonProps { disabled: boolean }
    export { hidden as buttonVariants }
    export { useDirection } from '@base-ui/react/direction-provider'
  `)
  )
  expect(result).toEqual([
    { name: "Button", kind: "value" },
    { name: "ButtonProps", kind: "type" },
    { name: "buttonVariants", kind: "value" },
    { name: "useDirection", kind: "value" }
  ])
})

test("export inventory rejects invalid TSX rather than returning an empty success", async () => {
  expect(Exit.isFailure(await Effect.runPromiseExit(inspectComponentExport("export function (")))).toBe(true)
})

test("export inventory includes exported constants, type aliases and deduplicated overload", async () => {
  const result = await Effect.runPromise(
    inspectComponentExport(`
    export const Chart = 1, ChartLegend = 2
    export type ChartConfig = { label: string }
    export function TsChart(value: string): string
    export function TsChart(value: number): number
    export function TsChart(value: unknown) { return value }
  `)
  )
  expect(result).toEqual([
    { name: "Chart", kind: "value" },
    { name: "ChartConfig", kind: "type" },
    { name: "ChartLegend", kind: "value" },
    { name: "TsChart", kind: "value" }
  ])
})

test("export inventory refuses unresolved wildcard and default export", async () => {
  for (const source of ["export * from './other'", "export default function Button() {}"])
    expect(Exit.isFailure(await Effect.runPromiseExit(inspectComponentExport(source)))).toBe(true)
})

test("export inventory recognizes a local type exported without an explicit type keyword", async () => {
  expect(await Effect.runPromise(inspectComponentExport("type CarouselApi = string; export { CarouselApi }"))).toEqual([
    { name: "CarouselApi", kind: "type" }
  ])
})

test("export inventory preserves explicit type aliases and rejects unsupported destructuring", async () => {
  expect(await Effect.runPromise(inspectComponentExport("export type { Foo as Bar } from './type'"))).toEqual([
    { name: "Bar", kind: "type" }
  ])
  expect(Exit.isFailure(await Effect.runPromiseExit(inspectComponentExport("export const { value } = source")))).toBe(
    true
  )
})
