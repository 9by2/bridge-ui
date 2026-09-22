import * as UI from "@bridge/ui"

const PageSpacing = {
  DEFAULT: "default",
  NONE: "none",
  COMPACT: "compact",
  COMFORTABLE: "comfortable"
} as const

const PageVariant = { DEFAULT: "default", CONTAINER: "container" } as const

const example = [
  {
    name: "Default",
    spacing: PageSpacing.DEFAULT,
    variant: PageVariant.DEFAULT,
    isDynamicPadding: false,
    description: "Default static page gutters."
  },
  {
    name: "None",
    spacing: PageSpacing.NONE,
    variant: PageVariant.DEFAULT,
    isDynamicPadding: false,
    description: "Zero padding for layouts that own their inner spacing."
  },
  {
    name: "Compact",
    spacing: PageSpacing.COMPACT,
    variant: PageVariant.DEFAULT,
    isDynamicPadding: false,
    description: "16px padding for dense and dialog-adjacent layouts."
  },
  {
    name: "Comfortable",
    spacing: PageSpacing.COMFORTABLE,
    variant: PageVariant.DEFAULT,
    isDynamicPadding: false,
    description: "24px padding for an intermediate page density."
  },
  {
    name: "Dynamic",
    spacing: PageSpacing.DEFAULT,
    variant: PageVariant.DEFAULT,
    isDynamicPadding: true,
    description: "Responsive desktop, tablet, and mobile gutters when explicitly requested."
  },
  {
    name: "Container",
    spacing: PageSpacing.DEFAULT,
    variant: PageVariant.CONTAINER,
    isDynamicPadding: false,
    description: "A 1480px centered layout when the page composition requires it."
  }
] as const

function PageExample({ name, spacing, variant, isDynamicPadding, description }: (typeof example)[number]) {
  return (
    <UI.Page variant={variant} spacing={spacing} isDynamicPadding={isDynamicPadding} className="border">
      <UI.PageBreadcrumb>
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem>
              <UI.BreadcrumbLink href="#page/spacing">Account</UI.BreadcrumbLink>
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbPage>{name}</UI.BreadcrumbPage>
            </UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
      </UI.PageBreadcrumb>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>{name} page</UI.PageTitle>
          <UI.PageDescription>{description}</UI.PageDescription>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.Button variant="outline">Action</UI.Button>
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageToolbar aria-label={`${name} page filter`}>
        <UI.Button variant="outline">All activity</UI.Button>
        <UI.Button variant="ghost">Open access</UI.Button>
      </UI.PageToolbar>
      <UI.PageContent>
        <UI.Card>
          <UI.CardHeader>
            <UI.CardTitle>Page content</UI.CardTitle>
            <UI.CardDescription>Every Page child is shown in this variant.</UI.CardDescription>
          </UI.CardHeader>
          <UI.CardContent>jane@example.com</UI.CardContent>
        </UI.Card>
      </UI.PageContent>
    </UI.Page>
  )
}

export default function Example() {
  return (
    <div className="grid gap-4">
      {example.map((item) => (
        <PageExample key={item.name} {...item} />
      ))}
    </div>
  )
}
