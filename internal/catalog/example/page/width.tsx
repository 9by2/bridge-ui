import * as UI from "@bridge/ui"

const example = [
  { width: UI.PageWidth.full, description: "100% of the container. The default when width is omitted." },
  { width: UI.PageWidth.content, description: "Centered, up to 80rem, for list and dashboard routes." },
  { width: UI.PageWidth.form, description: "Centered, up to 48rem, for settings and form routes." },
  { width: UI.PageWidth.editor, description: "Full width with no inline padding, for canvas and editor routes." }
] as const

export default function Example() {
  return (
    <div className="grid gap-4">
      {example.map((item) => (
        <div key={item.width} className="border">
          <UI.Page width={item.width} density={UI.PageDensity.compact}>
            <UI.PageHeader>
              <UI.PageHeading>
                <UI.PageEyebrow>width</UI.PageEyebrow>
                <UI.PageTitle>{item.width}</UI.PageTitle>
                <UI.PageDescription>{item.description}</UI.PageDescription>
              </UI.PageHeading>
            </UI.PageHeader>
            <UI.PageContent>
              <div className="rounded-md border border-dashed p-4 text-sm">Page content</div>
            </UI.PageContent>
          </UI.Page>
        </div>
      ))}
    </div>
  )
}
