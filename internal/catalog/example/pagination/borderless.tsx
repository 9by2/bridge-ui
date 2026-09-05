import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [page, setPage] = useState(2)
  return (
    <UI.Pagination aria-label="Borderless pagination">
      <UI.PaginationContent>
        <UI.PaginationItem>
          <UI.PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage(Math.max(1, page - 1))
            }}
          />
        </UI.PaginationItem>
        {[1, 2, 3].map((value) => (
          <UI.PaginationItem key={value}>
            <UI.PaginationLink
              href="#"
              isActive={page === value}
              className="border-0 shadow-none data-[active=true]:bg-muted"
              onClick={(event) => {
                event.preventDefault()
                setPage(value)
              }}>
              {value}
            </UI.PaginationLink>
          </UI.PaginationItem>
        ))}
        <UI.PaginationItem>
          <UI.PaginationEllipsis />
        </UI.PaginationItem>
        <UI.PaginationItem>
          <UI.PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setPage(Math.min(3, page + 1))
            }}
          />
        </UI.PaginationItem>
      </UI.PaginationContent>
    </UI.Pagination>
  )
}
