import * as stylex from "@stylexjs/stylex"
import { BotIcon, BridgeIcon, ChevronsUpDownIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

const style = stylex.create({
  header: {
    position: "sticky"
  },
  start: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    gap: 12
  },
  divider: {
    display: { default: "none", "@media (min-width: 641px)": "block" },
    width: 1,
    height: 32,
    flexShrink: 0,
    backgroundColor: "currentColor",
    opacity: 0.16
  },
  projectControl: {
    display: { default: "none", "@media (min-width: 641px)": "inline-flex" }
  },
  project: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    gap: 8
  },
  projectLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  title: {
    position: "absolute",
    left: "50%",
    width: "auto",
    maxWidth: "32%",
    transform: "translateX(-50%)",
    textAlign: "center"
  },
  agentIcon: {
    width: 16,
    height: 16
  },
  agentLabel: {
    display: { default: "none", "@media (min-width: 641px)": "inline" }
  },
  content: {
    display: "grid",
    minHeight: 1200,
    placeItems: "start center",
    padding: 32
  },
  card: {
    width: "min(100%, 720px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "currentColor",
    borderRadius: 12,
    padding: 24
  }
})

function Navigation() {
  return (
    <>
      <UI.SidebarHeader>
        <UI.SidebarMenu>
          <UI.SidebarMenuItem>
            <UI.SidebarMenuButton tooltip="Bridge Admin">
              <BridgeIcon aria-hidden="true" />
              <span>Bridge Admin</span>
            </UI.SidebarMenuButton>
          </UI.SidebarMenuItem>
        </UI.SidebarMenu>
      </UI.SidebarHeader>
      <UI.SidebarContent>
        <UI.SidebarMenu>
          <UI.SidebarMenuItem>
            <UI.SidebarMenuButton isActive>
              <LayoutDashboardIcon aria-hidden="true" />
              <span>Overview</span>
            </UI.SidebarMenuButton>
          </UI.SidebarMenuItem>
        </UI.SidebarMenu>
      </UI.SidebarContent>
    </>
  )
}

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar role="navigation" aria-label="Project navigation">
        <Navigation />
      </UI.Sidebar>
      <UI.SidebarInset>
        <UI.ShellHeader {...stylex.props(style.header)}>
          <div {...stylex.props(style.start)}>
            <UI.SidebarTrigger aria-label="Toggle navigation" />
            <span aria-hidden="true" {...stylex.props(style.divider)} />
            <UI.Button variant="ghost" aria-label="Select project" {...stylex.props(style.projectControl)}>
              <span {...stylex.props(style.project)}>
                <span {...stylex.props(style.projectLabel)}>All Projects</span>
                <ChevronsUpDownIcon aria-hidden="true" size={16} />
              </span>
            </UI.Button>
          </div>
          <UI.ShellHeaderTitle {...stylex.props(style.title)}>Overview</UI.ShellHeaderTitle>
          <UI.ShellHeaderAction>
            <UI.Button variant="ghost" aria-label="Open agent">
              <BotIcon aria-hidden="true" {...stylex.props(style.agentIcon)} />
              <span {...stylex.props(style.agentLabel)}>Agent</span>
            </UI.Button>
          </UI.ShellHeaderAction>
        </UI.ShellHeader>
        <main {...stylex.props(style.content)}>
          <section {...stylex.props(style.card)}>
            <h2>Project overview</h2>
            <p>The shell header remains visible while this route content scrolls.</p>
          </section>
        </main>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
