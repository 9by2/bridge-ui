import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Breadcrumb>
      <UI.BreadcrumbList>
        <UI.BreadcrumbItem>
          <UI.BreadcrumbLink href="#">Home</UI.BreadcrumbLink>
        </UI.BreadcrumbItem>
        <UI.BreadcrumbSeparator>/</UI.BreadcrumbSeparator>
        <UI.BreadcrumbItem>
          <UI.BreadcrumbPage>UI</UI.BreadcrumbPage>
        </UI.BreadcrumbItem>
      </UI.BreadcrumbList>
    </UI.Breadcrumb>
  )
}
