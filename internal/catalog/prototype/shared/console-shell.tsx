import { BellIcon, LogOutIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react"
import { useEffect, useState, type ComponentType, type ReactNode } from "react"

import * as UI from "@bridge/ui"

// Shared prototype shell: every package component below renders with its package default. Only plain wrapper
// elements carry caller layout. Page state stays in memory because the catalog owns the URL hash.
export type ConsoleNavigationItem<Page extends string> = {
  page: Page
  label: string
  icon: ComponentType
  badge?: string
}
export type ConsoleNavigationGroup<Page extends string> = {
  label: string
  item: readonly ConsoleNavigationItem<Page>[]
}
export type ConsoleNotification = { id: string; title: string; description: string; initial: string }
export type ConsoleShellProps<Page extends string> = {
  brand: { name: string; detail: string; icon: ReactNode }
  user: { name: string; email: string; initial: string }
  workspace: readonly string[]
  navigation: readonly ConsoleNavigationGroup<Page>[]
  notification: readonly ConsoleNotification[]
  page: Page
  onPageChange: (page: Page) => void
  children: ReactNode
}

export const notify = {
  success: (title: string, description?: string) => UI.sonnerToast.success(title, { description }),
  info: (title: string) => UI.toast.add({ title })
} as const

function findItem<Page extends string>(navigation: readonly ConsoleNavigationGroup<Page>[], page: Page) {
  for (const group of navigation) {
    const item = group.item.find((entry) => entry.page === page)
    if (item) return { group, item }
  }
  return undefined
}

function CommandPalette<Page extends string>({
  navigation,
  onPageChange
}: Pick<ConsoleShellProps<Page>, "navigation" | "onPageChange">) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [])
  return (
    <>
      <UI.Tooltip>
        <UI.TooltipTrigger render={<UI.Button variant="outline" aria-label="Search" onClick={() => setOpen(true)} />}>
          <SearchIcon aria-hidden="true" />
          <UI.KbdGroup>
            <UI.Kbd>⌘</UI.Kbd>
            <UI.Kbd>K</UI.Kbd>
          </UI.KbdGroup>
        </UI.TooltipTrigger>
        <UI.TooltipContent>Search pages and actions</UI.TooltipContent>
      </UI.Tooltip>
      <UI.CommandDialog open={open} onOpenChange={setOpen}>
        <UI.Command>
          <UI.CommandInput placeholder="Type a page or action" />
          <UI.CommandList>
            <UI.CommandEmpty>No match.</UI.CommandEmpty>
            {navigation.map((group) => (
              <UI.CommandGroup key={group.label} heading={group.label}>
                {group.item.map((item) => {
                  const Icon = item.icon
                  return (
                    <UI.CommandItem
                      key={item.page}
                      value={item.label}
                      onSelect={() => {
                        onPageChange(item.page)
                        setOpen(false)
                      }}>
                      <Icon />
                      {item.label}
                    </UI.CommandItem>
                  )
                })}
              </UI.CommandGroup>
            ))}
            <UI.CommandSeparator />
            <UI.CommandGroup heading="Action">
              <UI.CommandItem
                value="Copy workspace link"
                onSelect={() => {
                  notify.info("Workspace link copied")
                  setOpen(false)
                }}>
                Copy workspace link
                <UI.CommandShortcut>⌘L</UI.CommandShortcut>
              </UI.CommandItem>
            </UI.CommandGroup>
          </UI.CommandList>
        </UI.Command>
      </UI.CommandDialog>
    </>
  )
}

function NotificationPopover({ notification }: { notification: readonly ConsoleNotification[] }) {
  return (
    <UI.Popover>
      <UI.PopoverTrigger render={<UI.Button variant="ghost" size="icon" aria-label="Notifications" />}>
        <BellIcon aria-hidden="true" />
      </UI.PopoverTrigger>
      <UI.PopoverContent align="end">
        <UI.PopoverHeader>
          <UI.PopoverTitle>Notifications</UI.PopoverTitle>
          <UI.PopoverDescription>{notification.length} unread update</UI.PopoverDescription>
        </UI.PopoverHeader>
        <div className="h-64">
          <UI.ScrollArea>
            <UI.ItemGroup>
              {notification.map((entry) => (
                <UI.Item key={entry.id} size="sm">
                  <UI.ItemMedia>
                    <UI.Avatar size="sm">
                      <UI.AvatarFallback>{entry.initial}</UI.AvatarFallback>
                    </UI.Avatar>
                  </UI.ItemMedia>
                  <UI.ItemContent>
                    <UI.ItemTitle>{entry.title}</UI.ItemTitle>
                    <UI.ItemDescription>{entry.description}</UI.ItemDescription>
                  </UI.ItemContent>
                </UI.Item>
              ))}
            </UI.ItemGroup>
          </UI.ScrollArea>
        </div>
      </UI.PopoverContent>
    </UI.Popover>
  )
}

function UserMenu({ user, workspace }: Pick<ConsoleShellProps<string>, "user" | "workspace">) {
  const [current, setCurrent] = useState(workspace[0] ?? "")
  const [digest, setDigest] = useState(true)
  return (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger render={<UI.SidebarMenuButton size="lg" />}>
        <UI.Avatar size="sm">
          <UI.AvatarFallback>{user.initial}</UI.AvatarFallback>
          <UI.AvatarBadge />
        </UI.Avatar>
        <span className="grid min-w-0 flex-1">
          <span className="truncate">{user.name}</span>
          <UI.Small>{user.email}</UI.Small>
        </span>
      </UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent side="top">
        <UI.DropdownMenuGroup>
          <UI.DropdownMenuLabel>My account</UI.DropdownMenuLabel>
          <UI.DropdownMenuItem>
            <UserIcon />
            Profile
            <UI.DropdownMenuShortcut>⌘P</UI.DropdownMenuShortcut>
          </UI.DropdownMenuItem>
          <UI.DropdownMenuItem>
            <SettingsIcon />
            Preferences
          </UI.DropdownMenuItem>
          <UI.DropdownMenuCheckboxItem checked={digest} onCheckedChange={setDigest}>
            Daily email digest
          </UI.DropdownMenuCheckboxItem>
        </UI.DropdownMenuGroup>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuSub>
          <UI.DropdownMenuSubTrigger>Switch workspace</UI.DropdownMenuSubTrigger>
          <UI.DropdownMenuSubContent>
            <UI.DropdownMenuRadioGroup value={current} onValueChange={setCurrent}>
              {workspace.map((name) => (
                <UI.DropdownMenuRadioItem key={name} value={name}>
                  {name}
                </UI.DropdownMenuRadioItem>
              ))}
            </UI.DropdownMenuRadioGroup>
          </UI.DropdownMenuSubContent>
        </UI.DropdownMenuSub>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuItem variant="destructive" onClick={() => notify.info("Signed out (demo)")}>
          <LogOutIcon />
          Sign out
        </UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
}

function Navigation<Page extends string>({
  brand,
  user,
  workspace,
  navigation,
  page,
  onPageChange
}: Omit<ConsoleShellProps<Page>, "children" | "notification">) {
  return (
    <UI.Sidebar collapsible="icon" aria-label={`${brand.name} navigation`}>
      <UI.SidebarHeader>
        <UI.SidebarMenu>
          <UI.SidebarMenuItem>
            <UI.SidebarMenuButton
              size="lg"
              tooltip={brand.name}
              onClick={() => onPageChange(navigation[0]?.item[0]?.page ?? page)}>
              {brand.icon}
              <span className="grid min-w-0 flex-1">
                <span className="truncate">{brand.name}</span>
                <UI.Small>{brand.detail}</UI.Small>
              </span>
            </UI.SidebarMenuButton>
          </UI.SidebarMenuItem>
        </UI.SidebarMenu>
      </UI.SidebarHeader>
      <UI.SidebarSeparator />
      <UI.SidebarContent>
        {navigation.map((group) => (
          <UI.SidebarGroup key={group.label}>
            <UI.SidebarGroupLabel>{group.label}</UI.SidebarGroupLabel>
            <UI.SidebarGroupContent>
              <UI.SidebarMenu>
                {group.item.map((item) => {
                  const Icon = item.icon
                  return (
                    <UI.SidebarMenuItem key={item.page}>
                      <UI.SidebarMenuButton
                        data-page={item.page}
                        isActive={item.page === page}
                        aria-current={item.page === page ? "page" : undefined}
                        tooltip={item.label}
                        onClick={() => onPageChange(item.page)}>
                        <Icon />
                        <span>{item.label}</span>
                      </UI.SidebarMenuButton>
                      {item.badge ? <UI.SidebarMenuBadge>{item.badge}</UI.SidebarMenuBadge> : null}
                    </UI.SidebarMenuItem>
                  )
                })}
              </UI.SidebarMenu>
            </UI.SidebarGroupContent>
          </UI.SidebarGroup>
        ))}
      </UI.SidebarContent>
      <UI.SidebarSeparator />
      <UI.SidebarFooter>
        <UI.SidebarMenu>
          <UI.SidebarMenuItem>
            <UserMenu user={user} workspace={workspace} />
          </UI.SidebarMenuItem>
        </UI.SidebarMenu>
      </UI.SidebarFooter>
      <UI.SidebarRail />
    </UI.Sidebar>
  )
}

export function ConsoleShell<Page extends string>(props: ConsoleShellProps<Page>) {
  const { navigation, notification, page, onPageChange, children } = props
  const current = findItem(navigation, page)
  return (
    <UI.TooltipProvider>
      <UI.Toaster>
        <UI.ShellHeaderActionProvider>
          <UI.SidebarProvider defaultOpen>
            <Navigation {...props} />
            <UI.SidebarInset>
              <UI.ShellHeader>
                <UI.SidebarTrigger aria-label="Toggle navigation" />
                <UI.Separator orientation="vertical" />
                <UI.ShellHeaderTitle>{current?.item.label ?? props.brand.name}</UI.ShellHeaderTitle>
                <UI.ShellHeaderActionSlot />
                <UI.ShellHeaderAction>
                  <CommandPalette navigation={navigation} onPageChange={onPageChange} />
                  <NotificationPopover notification={notification} />
                </UI.ShellHeaderAction>
              </UI.ShellHeader>
              <div key={page}>{children}</div>
            </UI.SidebarInset>
          </UI.SidebarProvider>
        </UI.ShellHeaderActionProvider>
        <UI.SonnerToaster />
      </UI.Toaster>
    </UI.TooltipProvider>
  )
}

/** Publishes the page's primary action into the shell header. */
export function usePageAction(node: ReactNode) {
  UI.useShellHeaderAction(node)
}
