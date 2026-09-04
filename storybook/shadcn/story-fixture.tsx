import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

export const storyExport = {
  accordion: UI.Accordion,
  alert: UI.Alert,
  "alert-dialog": UI.AlertDialog,
  "aspect-ratio": UI.AspectRatio,
  attachment: UI.Attachment,
  avatar: UI.Avatar,
  badge: UI.Badge,
  breadcrumb: UI.Breadcrumb,
  bubble: UI.Bubble,
  button: UI.Button,
  "button-group": UI.ButtonGroup,
  calendar: UI.Calendar,
  card: UI.Card,
  carousel: UI.Carousel,
  chart: UI.ChartContainer,
  checkbox: UI.Checkbox,
  collapsible: UI.Collapsible,
  combobox: UI.Combobox,
  command: UI.Command,
  "context-menu": UI.ContextMenu,
  dialog: UI.Dialog,
  direction: UI.DirectionProvider,
  drawer: UI.Drawer,
  "dropdown-menu": UI.DropdownMenu,
  empty: UI.Empty,
  field: UI.Field,
  "hover-card": UI.HoverCard,
  input: UI.Input,
  "input-group": UI.InputGroup,
  "input-otp": UI.InputOTP,
  item: UI.Item,
  kbd: UI.Kbd,
  label: UI.Label,
  marker: UI.Marker,
  menubar: UI.Menubar,
  message: UI.Message,
  "message-scroller": UI.MessageScroller,
  "multi-select": UI.MultiSelect,
  "native-select": UI.NativeSelect,
  "navigation-menu": UI.NavigationMenu,
  pagination: UI.Pagination,
  popover: UI.Popover,
  progress: UI.Progress,
  questionnaire: UI.Questionnaire,
  "radio-group": UI.RadioGroup,
  resizable: UI.ResizablePanelGroup,
  "scroll-area": UI.ScrollArea,
  select: UI.Select,
  separator: UI.Separator,
  sheet: UI.Sheet,
  sidebar: UI.SidebarProvider,
  skeleton: UI.Skeleton,
  slider: UI.Slider,
  sonner: UI.SonnerToaster,
  spinner: UI.Spinner,
  switch: UI.Switch,
  table: UI.Table,
  tabs: UI.Tabs,
  textarea: UI.Textarea,
  toast: UI.ToastProvider,
  toggle: UI.Toggle,
  "toggle-group": UI.ToggleGroup,
  tooltip: UI.Tooltip
} as const

export type StoryName = keyof typeof storyExport

export function StoryFixture({ name }: { readonly name: StoryName }): ReactNode {
  switch (name) {
    case "accordion":
      return (
        <UI.Accordion defaultValue={["item"]}>
          <UI.AccordionItem value="item">
            <UI.AccordionTrigger>Can I reuse this?</UI.AccordionTrigger>
            <UI.AccordionContent>Yes, across company applications.</UI.AccordionContent>
          </UI.AccordionItem>
        </UI.Accordion>
      )
    case "alert":
      return (
        <UI.Alert>
          <UI.AlertTitle>Heads up</UI.AlertTitle>
          <UI.AlertDescription>Shared UI notice.</UI.AlertDescription>
        </UI.Alert>
      )
    case "alert-dialog":
      return (
        <UI.AlertDialog>
          <UI.AlertDialogTrigger render={<UI.Button />}>Delete</UI.AlertDialogTrigger>
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle>Delete item?</UI.AlertDialogTitle>
              <UI.AlertDialogDescription>This action cannot be undone.</UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
              <UI.AlertDialogAction>Continue</UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialog>
      )
    case "aspect-ratio":
      return <UI.AspectRatio ratio={16 / 9} className="w-80 rounded-lg bg-muted" />
    case "attachment":
      return (
        <UI.Attachment>
          <UI.AttachmentMedia>PDF</UI.AttachmentMedia>
          <UI.AttachmentContent>
            <UI.AttachmentTitle>design-system.pdf</UI.AttachmentTitle>
            <UI.AttachmentDescription>2.4 MB</UI.AttachmentDescription>
          </UI.AttachmentContent>
        </UI.Attachment>
      )
    case "avatar":
      return (
        <UI.Avatar>
          <UI.AvatarFallback className="text-foreground">BU</UI.AvatarFallback>
        </UI.Avatar>
      )
    case "badge":
      return <UI.Badge>Active</UI.Badge>
    case "breadcrumb":
      return (
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem>
              <UI.BreadcrumbLink href="#">Home</UI.BreadcrumbLink>
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbPage>UI</UI.BreadcrumbPage>
            </UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
      )
    case "bubble":
      return (
        <UI.Bubble>
          <UI.BubbleContent>Shared conversation content</UI.BubbleContent>
        </UI.Bubble>
      )
    case "button":
      return <UI.Button>Continue</UI.Button>
    case "button-group":
      return (
        <UI.ButtonGroup>
          <UI.Button>Previous</UI.Button>
          <UI.Button>Next</UI.Button>
        </UI.ButtonGroup>
      )
    case "calendar":
      return <UI.Calendar mode="single" selected={new Date(2026, 8, 4)} />
    case "card":
      return (
        <UI.Card className="w-80">
          <UI.CardHeader>
            <UI.CardTitle>Bridge UI</UI.CardTitle>
            <UI.CardDescription>Shared component library</UI.CardDescription>
          </UI.CardHeader>
          <UI.CardContent>Reusable foundation</UI.CardContent>
        </UI.Card>
      )
    case "carousel":
      return (
        <UI.Carousel className="w-64">
          <UI.CarouselContent>
            <UI.CarouselItem>
              <UI.Card>
                <UI.CardContent className="p-8">Slide one</UI.CardContent>
              </UI.Card>
            </UI.CarouselItem>
            <UI.CarouselItem>
              <UI.Card>
                <UI.CardContent className="p-8">Slide two</UI.CardContent>
              </UI.Card>
            </UI.CarouselItem>
          </UI.CarouselContent>
        </UI.Carousel>
      )
    case "chart":
      return (
        <UI.ChartContainer className="h-48 w-80" config={{ value: { color: "var(--primary)", label: "Value" } }}>
          <BarChart
            data={[
              { name: "A", value: 40 },
              { name: "B", value: 70 }
            ]}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </UI.ChartContainer>
      )
    case "checkbox":
      return (
        <label className="flex items-center gap-2">
          <UI.Checkbox aria-label="Accept terms" /> Accept terms
        </label>
      )
    case "collapsible":
      return (
        <UI.Collapsible>
          <UI.CollapsibleTrigger render={<UI.Button />}>Details</UI.CollapsibleTrigger>
          <UI.CollapsibleContent>Shared details</UI.CollapsibleContent>
        </UI.Collapsible>
      )
    case "combobox":
      return (
        <UI.Combobox items={["Design", "Engineering"]}>
          <UI.ComboboxInput aria-label="Team" placeholder="Select team" showTrigger={false} />
          <UI.ComboboxTrigger aria-label="Open team options" />
          <UI.ComboboxContent>
            <UI.ComboboxList>
              {(item: string) => (
                <UI.ComboboxItem key={item} value={item}>
                  {item}
                </UI.ComboboxItem>
              )}
            </UI.ComboboxList>
          </UI.ComboboxContent>
        </UI.Combobox>
      )
    case "command":
      return (
        <UI.Command className="w-80 rounded-lg border">
          <UI.CommandInput placeholder="Search commands" />
          <UI.CommandList>
            <UI.CommandGroup heading="Actions">
              <UI.CommandItem>Open dashboard</UI.CommandItem>
              <UI.CommandItem>Create project</UI.CommandItem>
            </UI.CommandGroup>
          </UI.CommandList>
        </UI.Command>
      )
    case "context-menu":
      return (
        <UI.ContextMenu>
          <UI.ContextMenuTrigger className="rounded-lg border border-dashed p-8">
            Right click area
          </UI.ContextMenuTrigger>
          <UI.ContextMenuContent>
            <UI.ContextMenuItem>Copy</UI.ContextMenuItem>
            <UI.ContextMenuItem>Paste</UI.ContextMenuItem>
          </UI.ContextMenuContent>
        </UI.ContextMenu>
      )
    case "dialog":
      return (
        <UI.Dialog>
          <UI.DialogTrigger render={<UI.Button />}>Open dialog</UI.DialogTrigger>
          <UI.DialogContent>
            <UI.DialogHeader>
              <UI.DialogTitle>Shared dialog</UI.DialogTitle>
              <UI.DialogDescription>Reusable content</UI.DialogDescription>
            </UI.DialogHeader>
          </UI.DialogContent>
        </UI.Dialog>
      )
    case "direction":
      return (
        <UI.DirectionProvider direction="rtl">
          <div dir="rtl" className="rounded border p-4">
            واجهة مشتركة
          </div>
        </UI.DirectionProvider>
      )
    case "drawer":
      return (
        <UI.Drawer>
          <UI.DrawerTrigger render={<UI.Button />}>Open drawer</UI.DrawerTrigger>
          <UI.DrawerContent>
            <UI.DrawerHeader>
              <UI.DrawerTitle>Shared drawer</UI.DrawerTitle>
              <UI.DrawerDescription>Reusable drawer content</UI.DrawerDescription>
            </UI.DrawerHeader>
          </UI.DrawerContent>
        </UI.Drawer>
      )
    case "dropdown-menu":
      return (
        <UI.DropdownMenu>
          <UI.DropdownMenuTrigger render={<UI.Button />}>Open menu</UI.DropdownMenuTrigger>
          <UI.DropdownMenuContent>
            <UI.DropdownMenuItem>Edit</UI.DropdownMenuItem>
            <UI.DropdownMenuItem>Duplicate</UI.DropdownMenuItem>
          </UI.DropdownMenuContent>
        </UI.DropdownMenu>
      )
    case "empty":
      return (
        <UI.Empty>
          <UI.EmptyHeader>
            <UI.EmptyTitle>No results</UI.EmptyTitle>
            <UI.EmptyDescription>Try another search.</UI.EmptyDescription>
          </UI.EmptyHeader>
        </UI.Empty>
      )
    case "field":
      return (
        <UI.Field>
          <UI.FieldLabel htmlFor="email">Email</UI.FieldLabel>
          <UI.Input id="email" />
        </UI.Field>
      )
    case "input":
      return <UI.Input aria-label="Name" placeholder="Name" />
    case "input-group":
      return (
        <UI.InputGroup>
          <UI.InputGroupInput aria-label="Search" placeholder="Search" />
          <UI.InputGroupAddon>⌘K</UI.InputGroupAddon>
        </UI.InputGroup>
      )
    case "input-otp":
      return (
        <UI.InputOTP aria-label="Verification code" maxLength={4}>
          <UI.InputOTPGroup>
            <UI.InputOTPSlot index={0} />
            <UI.InputOTPSlot index={1} />
            <UI.InputOTPSlot index={2} />
            <UI.InputOTPSlot index={3} />
          </UI.InputOTPGroup>
        </UI.InputOTP>
      )
    case "item":
      return (
        <UI.Item className="w-80">
          <UI.ItemContent>
            <UI.ItemTitle>Shared item</UI.ItemTitle>
            <UI.ItemDescription>Reusable supporting text</UI.ItemDescription>
          </UI.ItemContent>
          <UI.ItemActions>
            <UI.Button size="sm">Open</UI.Button>
          </UI.ItemActions>
        </UI.Item>
      )
    case "kbd":
      return (
        <UI.KbdGroup>
          <UI.Kbd>⌘</UI.Kbd>
          <UI.Kbd>K</UI.Kbd>
        </UI.KbdGroup>
      )
    case "label":
      return <UI.Label htmlFor="story-label">Field label</UI.Label>
    case "marker":
      return (
        <UI.Marker variant="separator">
          <UI.MarkerContent>Today</UI.MarkerContent>
        </UI.Marker>
      )
    case "menubar":
      return (
        <UI.Menubar>
          <UI.MenubarMenu>
            <UI.MenubarTrigger>File</UI.MenubarTrigger>
            <UI.MenubarContent>
              <UI.MenubarItem>New</UI.MenubarItem>
              <UI.MenubarItem>Open</UI.MenubarItem>
            </UI.MenubarContent>
          </UI.MenubarMenu>
        </UI.Menubar>
      )
    case "message":
      return (
        <UI.Message>
          <UI.MessageAvatar>BU</UI.MessageAvatar>
          <UI.MessageContent>
            <UI.MessageHeader>Bridge UI</UI.MessageHeader>
            <UI.Bubble>
              <UI.BubbleContent>Shared message</UI.BubbleContent>
            </UI.Bubble>
            <UI.MessageFooter>Now</UI.MessageFooter>
          </UI.MessageContent>
        </UI.Message>
      )
    case "message-scroller":
      return (
        <UI.MessageScrollerProvider>
          <UI.MessageScroller className="h-48 w-80 rounded border">
            <UI.MessageScrollerViewport>
              <UI.MessageScrollerContent>
                {Array.from({ length: 8 }, (_, index) => (
                  <UI.MessageScrollerItem key={index} className="p-3">
                    Message {index + 1}
                  </UI.MessageScrollerItem>
                ))}
              </UI.MessageScrollerContent>
            </UI.MessageScrollerViewport>
            <UI.MessageScrollerButton />
          </UI.MessageScroller>
        </UI.MessageScrollerProvider>
      )
    case "multi-select":
      return (
        <UI.MultiSelect defaultValues={["design"]}>
          <UI.MultiSelectTrigger aria-label="Select teams">
            <UI.MultiSelectValue placeholder="Select teams" />
          </UI.MultiSelectTrigger>
          <UI.MultiSelectContent>
            <UI.MultiSelectGroup>
              <UI.MultiSelectItem value="design">Design</UI.MultiSelectItem>
              <UI.MultiSelectItem value="engineering">Engineering</UI.MultiSelectItem>
            </UI.MultiSelectGroup>
          </UI.MultiSelectContent>
        </UI.MultiSelect>
      )
    case "native-select":
      return (
        <UI.NativeSelect aria-label="Team">
          <UI.NativeSelectOption value="design">Design</UI.NativeSelectOption>
          <UI.NativeSelectOption value="engineering">Engineering</UI.NativeSelectOption>
        </UI.NativeSelect>
      )
    case "pagination":
      return (
        <UI.Pagination>
          <UI.PaginationContent>
            <UI.PaginationItem>
              <UI.PaginationPrevious href="#" />
            </UI.PaginationItem>
            <UI.PaginationItem>
              <UI.PaginationLink href="#" isActive>
                1
              </UI.PaginationLink>
            </UI.PaginationItem>
            <UI.PaginationItem>
              <UI.PaginationNext href="#" />
            </UI.PaginationItem>
          </UI.PaginationContent>
        </UI.Pagination>
      )
    case "popover":
      return (
        <UI.Popover>
          <UI.PopoverTrigger render={<UI.Button />}>Open popover</UI.PopoverTrigger>
          <UI.PopoverContent>
            <UI.PopoverTitle>Shared popover</UI.PopoverTitle>
            <UI.PopoverDescription>Shared popover content</UI.PopoverDescription>
          </UI.PopoverContent>
        </UI.Popover>
      )
    case "progress":
      return <UI.Progress aria-label="Upload progress" value={64} className="w-80" />
    case "questionnaire":
      return (
        <UI.Questionnaire>
          <UI.QuestionnaireItem name="role">
            <UI.QuestionnaireTitle>Which role fits best?</UI.QuestionnaireTitle>
            <UI.QuestionnaireDescription>Select one option.</UI.QuestionnaireDescription>
            <UI.QuestionnaireChoices>
              <UI.QuestionnaireChoice value="design">Design</UI.QuestionnaireChoice>
              <UI.QuestionnaireChoice value="engineering">Engineering</UI.QuestionnaireChoice>
            </UI.QuestionnaireChoices>
          </UI.QuestionnaireItem>
          <UI.QuestionnaireActions>
            <UI.QuestionnaireSubmit />
          </UI.QuestionnaireActions>
        </UI.Questionnaire>
      )
    case "radio-group":
      return (
        <UI.RadioGroup defaultValue="one">
          <label className="flex gap-2">
            <UI.RadioGroupItem value="one" />
            One
          </label>
          <label className="flex gap-2">
            <UI.RadioGroupItem value="two" />
            Two
          </label>
        </UI.RadioGroup>
      )
    case "resizable":
      return (
        <UI.ResizablePanelGroup orientation="horizontal" className="h-40 w-80 rounded border">
          <UI.ResizablePanel defaultSize={50}>
            <div className="p-4">Left</div>
          </UI.ResizablePanel>
          <UI.ResizableHandle withHandle />
          <UI.ResizablePanel defaultSize={50}>
            <div className="p-4">Right</div>
          </UI.ResizablePanel>
        </UI.ResizablePanelGroup>
      )
    case "scroll-area":
      return (
        <UI.ScrollArea className="h-32 w-64 rounded border p-3">
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>Shared item {index + 1}</p>
          ))}
        </UI.ScrollArea>
      )
    case "select":
      return (
        <UI.Select>
          <UI.SelectTrigger aria-label="Role">
            <UI.SelectValue placeholder="Select role" />
          </UI.SelectTrigger>
          <UI.SelectContent>
            <UI.SelectItem value="admin">Admin</UI.SelectItem>
            <UI.SelectItem value="member">Member</UI.SelectItem>
          </UI.SelectContent>
        </UI.Select>
      )
    case "separator":
      return (
        <div className="w-80">
          Above
          <UI.Separator className="my-3" />
          Below
        </div>
      )
    case "sheet":
      return (
        <UI.Sheet>
          <UI.SheetTrigger render={<UI.Button />}>Open sheet</UI.SheetTrigger>
          <UI.SheetContent>
            <UI.SheetHeader>
              <UI.SheetTitle>Shared sheet</UI.SheetTitle>
              <UI.SheetDescription>Reusable side panel</UI.SheetDescription>
            </UI.SheetHeader>
          </UI.SheetContent>
        </UI.Sheet>
      )
    case "sidebar":
      return (
        <UI.SidebarProvider defaultOpen>
          <div className="h-56 w-full overflow-hidden rounded border">
            <UI.Sidebar collapsible="none">
              <UI.SidebarHeader>Bridge UI</UI.SidebarHeader>
              <UI.SidebarContent>
                <UI.SidebarGroup>
                  <UI.SidebarGroupLabel>Library</UI.SidebarGroupLabel>
                  <UI.SidebarGroupContent>
                    <UI.SidebarMenu>
                      <UI.SidebarMenuItem>
                        <UI.SidebarMenuButton isActive>Components</UI.SidebarMenuButton>
                      </UI.SidebarMenuItem>
                    </UI.SidebarMenu>
                  </UI.SidebarGroupContent>
                </UI.SidebarGroup>
              </UI.SidebarContent>
            </UI.Sidebar>
          </div>
        </UI.SidebarProvider>
      )
    case "skeleton":
      return <UI.Skeleton className="h-12 w-80" />
    case "slider":
      return (
        <label>
          <span className="sr-only">Volume</span>
          <UI.Slider defaultValue={[40]} className="w-80" />
        </label>
      )
    case "spinner":
      return <UI.Spinner aria-label="Loading" />
    case "switch":
      return <UI.Switch aria-label="Notifications" />
    case "table":
      return (
        <UI.Table>
          <UI.TableHeader>
            <UI.TableRow>
              <UI.TableHead>Component</UI.TableHead>
              <UI.TableHead>Status</UI.TableHead>
            </UI.TableRow>
          </UI.TableHeader>
          <UI.TableBody>
            <UI.TableRow>
              <UI.TableCell>Button</UI.TableCell>
              <UI.TableCell>Ready</UI.TableCell>
            </UI.TableRow>
          </UI.TableBody>
        </UI.Table>
      )
    case "tabs":
      return (
        <UI.Tabs defaultValue="one">
          <UI.TabsList>
            <UI.TabsTrigger value="one">One</UI.TabsTrigger>
            <UI.TabsTrigger value="two">Two</UI.TabsTrigger>
          </UI.TabsList>
          <UI.TabsContent value="one">First panel</UI.TabsContent>
          <UI.TabsContent value="two">Second panel</UI.TabsContent>
        </UI.Tabs>
      )
    case "textarea":
      return <UI.Textarea aria-label="Notes" placeholder="Notes" />
    case "toast":
      return (
        <UI.Toaster>
          <UI.Button onClick={() => UI.toast.add({ title: "Saved" })}>Show toast</UI.Button>
        </UI.Toaster>
      )
    case "toggle":
      return <UI.Toggle aria-label="Bold">Bold</UI.Toggle>
    case "toggle-group":
      return (
        <UI.ToggleGroup defaultValue={["left"]}>
          <UI.ToggleGroupItem value="left">Left</UI.ToggleGroupItem>
          <UI.ToggleGroupItem value="right">Right</UI.ToggleGroupItem>
        </UI.ToggleGroup>
      )
    case "tooltip":
      return (
        <UI.TooltipProvider>
          <UI.Tooltip>
            <UI.TooltipTrigger render={<UI.Button />}>Hover me</UI.TooltipTrigger>
            <UI.TooltipContent>Helpful detail</UI.TooltipContent>
          </UI.Tooltip>
        </UI.TooltipProvider>
      )
    case "hover-card":
      return (
        <UI.HoverCard>
          <UI.HoverCardTrigger render={<a href="#profile">Bridge UI</a>} />
          <UI.HoverCardContent>Shared component profile</UI.HoverCardContent>
        </UI.HoverCard>
      )
    case "navigation-menu":
      return (
        <UI.NavigationMenu>
          <UI.NavigationMenuList>
            <UI.NavigationMenuItem>
              <UI.NavigationMenuTrigger>Products</UI.NavigationMenuTrigger>
              <UI.NavigationMenuContent>
                <UI.NavigationMenuLink href="#components">Components</UI.NavigationMenuLink>
              </UI.NavigationMenuContent>
            </UI.NavigationMenuItem>
          </UI.NavigationMenuList>
        </UI.NavigationMenu>
      )
    case "sonner":
      return <UI.SonnerToaster />
    default:
      throw new Error(`Missing StoryFixture composition for ${name}`)
  }
}
