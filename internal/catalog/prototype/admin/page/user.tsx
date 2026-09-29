import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { stay } from "@catalog-prototype/shared/support"
import { MoreHorizontalIcon, SearchIcon, UserPlusIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

const member = [
  {
    id: "u1",
    name: "Alex Kim",
    initial: "AK",
    email: "alex@acme.io",
    role: "Owner",
    team: "Platform",
    status: "success",
    seen: "Online"
  },
  {
    id: "u2",
    name: "Priya Shah",
    initial: "PS",
    email: "priya@acme.io",
    role: "Admin",
    team: "Growth",
    status: "success",
    seen: "5 min ago"
  },
  {
    id: "u3",
    name: "Tom Becker",
    initial: "TB",
    email: "tom@acme.io",
    role: "Member",
    team: "Platform",
    status: "pending",
    seen: "Invited"
  },
  {
    id: "u4",
    name: "สมชาย ใจดี",
    initial: "สช",
    email: "somchai@acme.io",
    role: "Member",
    team: "Support",
    status: "inactive",
    seen: "Suspended"
  },
  {
    id: "u5",
    name: "Maria Lopez",
    initial: "ML",
    email: "maria@acme.io",
    role: "Billing",
    team: "Finance",
    status: "success",
    seen: "2 day ago"
  }
] as const
const teamOption = ["Platform", "Growth", "Support", "Finance", "Design"]

function InviteSheet() {
  const anchor = UI.useComboboxAnchor()
  return (
    <UI.Sheet>
      <UI.SheetTrigger render={<UI.Button />}>
        <UserPlusIcon aria-hidden="true" />
        Invite
      </UI.SheetTrigger>
      <UI.SheetContent>
        <UI.SheetHeader>
          <UI.SheetTitle>Invite member</UI.SheetTitle>
          <UI.SheetDescription>They receive an email with a 7 day link.</UI.SheetDescription>
        </UI.SheetHeader>
        <div className="grid grid-cols-1 gap-4 px-4">
          <UI.Field>
            <UI.FieldLabel htmlFor="invite-email">Email</UI.FieldLabel>
            <UI.Input id="invite-email" type="email" placeholder="name@company.com" />
          </UI.Field>
          <UI.FieldSet>
            <UI.FieldLegend>Access</UI.FieldLegend>
            <UI.RadioGroup defaultValue="workspace">
              <UI.Field orientation="horizontal">
                <UI.RadioGroupItem id="access-workspace" value="workspace" />
                <UI.FieldLabel htmlFor="access-workspace">Whole workspace</UI.FieldLabel>
              </UI.Field>
              <UI.Field orientation="horizontal">
                <UI.RadioGroupItem id="access-project" value="project" />
                <UI.FieldLabel htmlFor="access-project">Selected project only</UI.FieldLabel>
              </UI.Field>
            </UI.RadioGroup>
          </UI.FieldSet>
          <UI.Field>
            <UI.FieldLabel htmlFor="invite-role">Role</UI.FieldLabel>
            <UI.NativeSelect id="invite-role" defaultValue="member">
              <UI.NativeSelectOptGroup label="Workspace">
                <UI.NativeSelectOption value="admin">Admin</UI.NativeSelectOption>
                <UI.NativeSelectOption value="member">Member</UI.NativeSelectOption>
              </UI.NativeSelectOptGroup>
              <UI.NativeSelectOption value="billing">Billing only</UI.NativeSelectOption>
            </UI.NativeSelect>
          </UI.Field>
          <UI.Field>
            <UI.FieldLabel>Team</UI.FieldLabel>
            <UI.Combobox items={teamOption} multiple defaultValue={["Platform"]}>
              <UI.ComboboxChips ref={anchor}>
                <UI.ComboboxValue>
                  {(selected: string[]) =>
                    selected.map((item) => (
                      <UI.ComboboxChip key={item} removeLabel={`Remove ${item}`}>
                        {item}
                      </UI.ComboboxChip>
                    ))
                  }
                </UI.ComboboxValue>
                <UI.ComboboxChipsInput aria-label="Team" placeholder="Add team" />
              </UI.ComboboxChips>
              <UI.ComboboxContent anchor={anchor}>
                <UI.ComboboxEmpty>No team.</UI.ComboboxEmpty>
                <UI.ComboboxList>
                  {(item: string) => (
                    <UI.ComboboxItem key={item} value={item}>
                      {item}
                    </UI.ComboboxItem>
                  )}
                </UI.ComboboxList>
              </UI.ComboboxContent>
            </UI.Combobox>
          </UI.Field>
        </div>
        <UI.SheetFooter>
          <UI.SheetClose render={<UI.Button onClick={() => notify.success("Invitation sent")} />}>
            Send invite
          </UI.SheetClose>
        </UI.SheetFooter>
      </UI.SheetContent>
    </UI.Sheet>
  )
}
function RowAction({ name }: { name: string }) {
  return (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger render={<UI.Button variant="ghost" size="icon-sm" aria-label={`Action for ${name}`} />}>
        <MoreHorizontalIcon aria-hidden="true" />
      </UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent align="end">
        <UI.DropdownMenuItem>View profile</UI.DropdownMenuItem>
        <UI.DropdownMenuItem>Change role</UI.DropdownMenuItem>
        <UI.DropdownMenuItem onClick={() => notify.info(`Password reset sent to ${name}`)}>
          Reset password
        </UI.DropdownMenuItem>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuItem variant="destructive">Suspend</UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
}

export function UserPage() {
  const [selected, setSelected] = useState<string[]>([])
  usePageAction(<InviteSheet />)
  const all = selected.length === member.length
  return (
    <UI.Page width={UI.PageWidth.full}>
      <UI.PageBreadcrumb>
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem>
              <UI.BreadcrumbLink href="#acme" onClick={stay}>
                Acme Cloud
              </UI.BreadcrumbLink>
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbEllipsis />
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbPage>User</UI.BreadcrumbPage>
            </UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
      </UI.PageBreadcrumb>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>User</UI.PageTitle>
          <UI.PageMeta>
            <UI.Badge variant="secondary">{member.length} member</UI.Badge>
            {selected.length > 0 ? <span>{selected.length} selected</span> : null}
          </UI.PageMeta>
        </UI.PageHeading>
        <UI.PageFilter role="search" aria-label="User filter">
          <UI.Input icon={<SearchIcon />} aria-label="Search user" placeholder="Search name or email" />
          <UI.ToggleGroup defaultValue={["all"]} aria-label="Status">
            <UI.ToggleGroupItem value="all">All</UI.ToggleGroupItem>
            <UI.ToggleGroupItem value="active">Active</UI.ToggleGroupItem>
            <UI.ToggleGroupItem value="invited">Invited</UI.ToggleGroupItem>
          </UI.ToggleGroup>
          <UI.MultiSelect>
            <UI.MultiSelectTrigger aria-label="Filter team">
              <UI.MultiSelectValue placeholder="All team" />
            </UI.MultiSelectTrigger>
            <UI.MultiSelectContent>
              <UI.MultiSelectGroup>
                {teamOption.map((item) => (
                  <UI.MultiSelectItem key={item} value={item}>
                    {item}
                  </UI.MultiSelectItem>
                ))}
              </UI.MultiSelectGroup>
            </UI.MultiSelectContent>
          </UI.MultiSelect>
          {selected.length > 0 ? (
            <UI.AlertDialog>
              <UI.AlertDialogTrigger render={<UI.Button variant="destructive" />}>
                Remove {selected.length}
              </UI.AlertDialogTrigger>
              <UI.AlertDialogContent>
                <UI.AlertDialogHeader>
                  <UI.AlertDialogTitle>Remove {selected.length} member?</UI.AlertDialogTitle>
                  <UI.AlertDialogDescription>
                    They lose access immediately. Their data stay in the workspace.
                  </UI.AlertDialogDescription>
                </UI.AlertDialogHeader>
                <UI.AlertDialogFooter>
                  <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
                  <UI.AlertDialogAction
                    onClick={() => {
                      notify.success(`${selected.length} member removed`)
                      setSelected([])
                    }}>
                    Remove
                  </UI.AlertDialogAction>
                </UI.AlertDialogFooter>
              </UI.AlertDialogContent>
            </UI.AlertDialog>
          ) : null}
        </UI.PageFilter>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-4">
          <UI.TableFrame>
            <UI.TableFrameViewport tabIndex={0} aria-label="User list">
              <UI.Table>
                <UI.TableHeader>
                  <UI.TableRow>
                    <UI.TableHead>
                      <UI.Checkbox
                        aria-label="Select all"
                        checked={all}
                        indeterminate={selected.length > 0 && !all}
                        onCheckedChange={(checked) => setSelected(checked ? member.map((item) => item.id) : [])}
                      />
                    </UI.TableHead>
                    <UI.TableHead>Name</UI.TableHead>
                    <UI.TableHead>Role</UI.TableHead>
                    <UI.TableHead>Team</UI.TableHead>
                    <UI.TableHead>Status</UI.TableHead>
                    <UI.TableHead>
                      <span className="sr-only">Action</span>
                    </UI.TableHead>
                  </UI.TableRow>
                </UI.TableHeader>
                <UI.TableBody>
                  {member.map((item) => (
                    <UI.TableRow key={item.id} data-state={selected.includes(item.id) ? "selected" : undefined}>
                      <UI.TableCell>
                        <UI.Checkbox
                          aria-label={`Select ${item.name}`}
                          checked={selected.includes(item.id)}
                          onCheckedChange={(checked) =>
                            setSelected((value) =>
                              checked ? [...value, item.id] : value.filter((id) => id !== item.id)
                            )
                          }
                        />
                      </UI.TableCell>
                      <UI.TableCell>
                        <UI.Item size="xs">
                          <UI.ItemMedia>
                            <UI.Avatar size="sm">
                              <UI.AvatarFallback>{item.initial}</UI.AvatarFallback>
                            </UI.Avatar>
                          </UI.ItemMedia>
                          <UI.ItemContent>
                            <UI.ItemTitle>{item.name}</UI.ItemTitle>
                            <UI.ItemDescription>{item.email}</UI.ItemDescription>
                          </UI.ItemContent>
                        </UI.Item>
                      </UI.TableCell>
                      <UI.TableCell>{item.role}</UI.TableCell>
                      <UI.TableCell>
                        <UI.Badge variant="outline">{item.team}</UI.Badge>
                      </UI.TableCell>
                      <UI.TableCell>
                        <UI.StatusStamp tone={item.status}>{item.seen}</UI.StatusStamp>
                      </UI.TableCell>
                      <UI.TableCell>
                        <RowAction name={item.name} />
                      </UI.TableCell>
                    </UI.TableRow>
                  ))}
                </UI.TableBody>
                <UI.TableFooter>
                  <UI.TableRow>
                    <UI.TableCell colSpan={6}>Showing 1–5 of 1,284</UI.TableCell>
                  </UI.TableRow>
                </UI.TableFooter>
              </UI.Table>
            </UI.TableFrameViewport>
          </UI.TableFrame>
          <UI.Pagination>
            <UI.PaginationContent>
              <UI.PaginationItem>
                <UI.PaginationPrevious href="#user-previous" onClick={stay} />
              </UI.PaginationItem>
              {[1, 2, 3].map((value) => (
                <UI.PaginationItem key={value}>
                  <UI.PaginationLink
                    href={`#user-${value}`}
                    onClick={stay}
                    isActive={value === 1}
                    activeVariant={UI.PaginationActiveVariant.muted}>
                    {value}
                  </UI.PaginationLink>
                </UI.PaginationItem>
              ))}
              <UI.PaginationItem>
                <UI.PaginationEllipsis />
              </UI.PaginationItem>
              <UI.PaginationItem>
                <UI.PaginationNext href="#user-next" onClick={stay} />
              </UI.PaginationItem>
            </UI.PaginationContent>
          </UI.Pagination>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
