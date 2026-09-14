import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen={false}>
      <UI.Sidebar>
        <UI.SidebarContent>User navigation</UI.SidebarContent>
      </UI.Sidebar>
      <UI.SidebarInset>
        <UI.ShellHeader>
          <UI.SidebarTrigger aria-label="Toggle navigation" />
          <UI.ShellHeaderTitle>User</UI.ShellHeaderTitle>
        </UI.ShellHeader>
        <UI.Page>
          <UI.PageContent>Title-only header with the desktop sidebar collapsed.</UI.PageContent>
        </UI.Page>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
