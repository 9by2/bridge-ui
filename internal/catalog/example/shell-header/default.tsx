import * as UI from "@bridge/ui"

function Navigation() {
  return (
    <UI.SidebarContent>
      <UI.SidebarHeader>Bridge Admin</UI.SidebarHeader>
      <UI.SidebarMenu>
        <UI.SidebarMenuItem>
          <UI.SidebarMenuButton isActive>User</UI.SidebarMenuButton>
        </UI.SidebarMenuItem>
      </UI.SidebarMenu>
    </UI.SidebarContent>
  )
}

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar role="navigation" aria-label="User navigation">
        <Navigation />
      </UI.Sidebar>
      <UI.SidebarInset>
        <UI.ShellHeader>
          <UI.SidebarTrigger aria-label="Toggle navigation" />
          <UI.ShellHeaderTitle>User</UI.ShellHeaderTitle>
          <UI.ShellHeaderAction>
            <UI.Button variant="outline" size="sm">
              Search
            </UI.Button>
          </UI.ShellHeaderAction>
        </UI.ShellHeader>
        <UI.Page>
          <UI.PageContent>
            <UI.Table tabIndex={0} aria-label="User account">
              <UI.TableHeader>
                <UI.TableRow>
                  {Array.from({ length: 8 }, (_, index) => (
                    <UI.TableHead key={index}>Column {index + 1}</UI.TableHead>
                  ))}
                </UI.TableRow>
              </UI.TableHeader>
              <UI.TableBody>
                <UI.TableRow>
                  {Array.from({ length: 8 }, (_, index) => (
                    <UI.TableCell key={index}>Wide account value {index + 1}</UI.TableCell>
                  ))}
                </UI.TableRow>
              </UI.TableBody>
            </UI.Table>
            <div style={{ height: 1200 }} />
          </UI.PageContent>
        </UI.Page>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
