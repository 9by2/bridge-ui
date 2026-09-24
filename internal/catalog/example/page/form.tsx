import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="h-[28rem] overflow-auto border">
      <UI.Page width={UI.PageWidth.form} density={UI.PageDensity.compact}>
        <UI.PageHeader>
          <UI.PageHeading>
            <UI.PageEyebrow>Settings</UI.PageEyebrow>
            <UI.PageTitle>Profile</UI.PageTitle>
            <UI.PageDescription>Scroll to keep the sticky action row pinned to the bottom.</UI.PageDescription>
          </UI.PageHeading>
        </UI.PageHeader>
        <UI.PageContent>
          <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
            {["Display name", "Email", "Phone", "Company", "Role", "Location"].map((label) => (
              <UI.Field key={label}>
                <UI.FieldLabel>{label}</UI.FieldLabel>
                <UI.Input aria-label={label} />
              </UI.Field>
            ))}
            <UI.PageFormAction sticky align={UI.PageFormActionAlign.end}>
              <UI.Button type="button" variant="outline">
                Cancel
              </UI.Button>
              <UI.Button type="submit">Save</UI.Button>
            </UI.PageFormAction>
          </form>
        </UI.PageContent>
      </UI.Page>
    </div>
  )
}
