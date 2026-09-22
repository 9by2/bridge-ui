import type { ComponentProps } from "react"

import { Table, TableHint, TableViewport, type TableDensity } from "./table"

export type TableFrameDensity = TableDensity
export type TableFrameProps = ComponentProps<"section"> & { density?: TableFrameDensity }

export function TableFrame({ className, density = "standard", ...prop }: TableFrameProps) {
  return <Table variant="frame" density={density} className={className} {...prop} />
}

export function TableFrameHint({ className, ...prop }: ComponentProps<"div">) {
  return <TableHint dataSlot="table-frame-hint" className={className} {...prop} />
}

export function TableFrameViewport({ className, ...prop }: ComponentProps<"div">) {
  return <TableViewport dataSlot="table-frame-viewport" className={className} {...prop} />
}
