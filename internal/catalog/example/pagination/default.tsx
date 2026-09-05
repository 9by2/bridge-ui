import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Pagination>
      <UI.PaginationContent>
        <UI.PaginationItem>
          <UI.PaginationPrevious href="#" />
        </UI.PaginationItem>
        <UI.PaginationItem>
          <UI.PaginationLink href="#" isActive>
            1
          </UI.PaginationLink>
        </UI.PaginationItem>
        <UI.PaginationItem>
          <UI.PaginationNext href="#" />
        </UI.PaginationItem>
      </UI.PaginationContent>
    </UI.Pagination>
  )
}
