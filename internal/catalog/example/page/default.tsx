import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Page>
      <UI.PageBreadcrumb>
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem>
              <UI.BreadcrumbLink href="#page/default">Account</UI.BreadcrumbLink>
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbPage>Jane Doe</UI.BreadcrumbPage>
            </UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
      </UI.PageBreadcrumb>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Jane Doe</UI.PageTitle>
          <UI.PageDescription>Account detail and platform access state.</UI.PageDescription>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.Button variant="outline">Back to account</UI.Button>
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageToolbar aria-label="Account filter">
        <UI.Button variant="outline">All activity</UI.Button>
        <UI.Button variant="ghost">Open access</UI.Button>
      </UI.PageToolbar>
      <UI.PageContent>
        <UI.Card>
          <UI.CardHeader>
            <UI.CardTitle>Account detail</UI.CardTitle>
            <UI.CardDescription>Reusable consumer content remains independent from the page layout.</UI.CardDescription>
          </UI.CardHeader>
          <UI.CardContent>jane@example.com</UI.CardContent>
        </UI.Card>
      </UI.PageContent>
    </UI.Page>
  )
}
