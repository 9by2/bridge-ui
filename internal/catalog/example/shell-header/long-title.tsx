import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen={false}>
      <UI.Sidebar role="navigation" aria-label="User navigation">
        <UI.SidebarContent>User navigation</UI.SidebarContent>
      </UI.Sidebar>
      <UI.SidebarInset>
        <UI.ShellHeader>
          <UI.SidebarTrigger aria-label="Toggle navigation" />
          <UI.ShellHeaderTitle>
            User access and organization membership administration for the international support team
          </UI.ShellHeaderTitle>
          <UI.ShellHeaderAction>
            <UI.Button size="sm">Invite</UI.Button>
          </UI.ShellHeaderAction>
        </UI.ShellHeader>
        <UI.Page>
          <UI.PageContent>Long route title behavior.</UI.PageContent>
        </UI.Page>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
