import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

import type { VariantName } from "./variant-matrix"

function Axis({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{label}</h3>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

function Sample({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <div className="flex min-w-24 flex-col gap-1 rounded-lg border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

const labels = (
  <>
    <UI.SelectValue placeholder="Select role" />
  </>
)
const options = (
  <UI.SelectContent>
    <UI.SelectItem value="admin">Admin</UI.SelectItem>
    <UI.SelectItem value="member">Member</UI.SelectItem>
  </UI.SelectContent>
)

export function VariantFixture({ name }: { readonly name: VariantName }): ReactNode {
  switch (name) {
    case "alert":
      return (
        <Axis label="variant">
          {(["default", "destructive"] as const).map((variant) => (
            <Sample key={variant} label={variant}>
              <UI.Alert variant={variant}>
                <UI.AlertTitle>{variant}</UI.AlertTitle>
                <UI.AlertDescription>Variant alert</UI.AlertDescription>
              </UI.Alert>
            </Sample>
          ))}
        </Axis>
      )
    case "alert-dialog":
      return (
        <Axis label="size">
          {(["default", "sm"] as const).map((size) => (
            <UI.AlertDialog key={size}>
              <UI.AlertDialogTrigger render={<UI.Button variant="outline" />}>{size}</UI.AlertDialogTrigger>
              <UI.AlertDialogContent size={size}>
                <UI.AlertDialogHeader>
                  <UI.AlertDialogTitle>{size} dialog</UI.AlertDialogTitle>
                  <UI.AlertDialogDescription>Size variant</UI.AlertDialogDescription>
                </UI.AlertDialogHeader>
                <UI.AlertDialogFooter>
                  <UI.AlertDialogCancel>Close</UI.AlertDialogCancel>
                </UI.AlertDialogFooter>
              </UI.AlertDialogContent>
            </UI.AlertDialog>
          ))}
        </Axis>
      )
    case "attachment":
      return (
        <div className="space-y-6">
          <Axis label="state">
            {(["idle", "uploading", "processing", "error", "done"] as const).map((state) => (
              <UI.Attachment key={state} state={state}>
                <UI.AttachmentMedia>PDF</UI.AttachmentMedia>
                <UI.AttachmentContent>
                  <UI.AttachmentTitle>{state}</UI.AttachmentTitle>
                  <UI.AttachmentDescription style={state === "error" ? { color: "#991b1b" } : undefined}>
                    document.pdf
                  </UI.AttachmentDescription>
                </UI.AttachmentContent>
              </UI.Attachment>
            ))}
          </Axis>
          <Axis label="size">
            {(["default", "sm", "xs"] as const).map((size) => (
              <UI.Attachment key={size} size={size}>
                <UI.AttachmentContent>
                  <UI.AttachmentTitle>{size}</UI.AttachmentTitle>
                </UI.AttachmentContent>
              </UI.Attachment>
            ))}
          </Axis>
          <Axis label="orientation and media">
            <UI.Attachment orientation="horizontal">
              <UI.AttachmentMedia variant="icon">PDF</UI.AttachmentMedia>
              <UI.AttachmentContent>horizontal icon</UI.AttachmentContent>
            </UI.Attachment>
            <UI.Attachment orientation="vertical">
              <UI.AttachmentMedia variant="image">
                <div className="size-full bg-muted" />
              </UI.AttachmentMedia>
              <UI.AttachmentContent>vertical image</UI.AttachmentContent>
            </UI.Attachment>
          </Axis>
        </div>
      )
    case "avatar":
      return (
        <Axis label="size">
          {(["sm", "default", "lg"] as const).map((size) => (
            <Sample key={size} label={size}>
              <UI.Avatar size={size}>
                <UI.AvatarFallback className="text-foreground">BU</UI.AvatarFallback>
              </UI.Avatar>
            </Sample>
          ))}
        </Axis>
      )
    case "badge":
      return (
        <Axis label="variant">
          {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map((variant) => (
            <UI.Badge key={variant} variant={variant} className={variant === "secondary" ? "text-white" : undefined}>
              {variant}
            </UI.Badge>
          ))}
        </Axis>
      )
    case "bubble":
      return (
        <div className="space-y-6">
          <Axis label="variant">
            {(["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const).map(
              (variant) => (
                <UI.Bubble key={variant} variant={variant}>
                  <UI.BubbleContent style={variant === "secondary" ? { color: "#ffffff" } : undefined}>
                    {variant}
                  </UI.BubbleContent>
                </UI.Bubble>
              )
            )}
          </Axis>
          <Axis label="align and reactions">
            <UI.Bubble align="start">
              <UI.BubbleContent>start</UI.BubbleContent>
              <UI.BubbleReactions side="top" align="start">
                👍
              </UI.BubbleReactions>
            </UI.Bubble>
            <UI.Bubble align="end">
              <UI.BubbleContent>end</UI.BubbleContent>
              <UI.BubbleReactions side="bottom" align="end">
                ✓
              </UI.BubbleReactions>
            </UI.Bubble>
          </Axis>
        </div>
      )
    case "button":
      return (
        <div className="space-y-6">
          <Axis label="variant">
            {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((variant) => (
              <UI.Button key={variant} variant={variant} className={variant === "secondary" ? "text-white" : undefined}>
                {variant}
              </UI.Button>
            ))}
          </Axis>
          <Axis label="size">
            {(["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const).map((size) => (
              <UI.Button key={size} size={size} aria-label={size}>
                {size.startsWith("icon") ? "+" : size}
              </UI.Button>
            ))}
          </Axis>
          <Axis label="semantic">
            <UI.Button>enabled</UI.Button>
            <UI.Button disabled>disabled</UI.Button>
            <UI.Button aria-invalid>invalid</UI.Button>
          </Axis>
        </div>
      )
    case "button-group":
      return (
        <Axis label="orientation">
          {(["horizontal", "vertical"] as const).map((orientation) => (
            <Sample key={orientation} label={orientation}>
              <UI.ButtonGroup orientation={orientation}>
                <UI.Button>One</UI.Button>
                <UI.Button>Two</UI.Button>
              </UI.ButtonGroup>
            </Sample>
          ))}
        </Axis>
      )
    case "card":
      return (
        <Axis label="size">
          {(["default", "sm"] as const).map((size) => (
            <UI.Card key={size} size={size} className="w-56">
              <UI.CardHeader>
                <UI.CardTitle>{size}</UI.CardTitle>
                <UI.CardDescription>Card size</UI.CardDescription>
              </UI.CardHeader>
            </UI.Card>
          ))}
        </Axis>
      )
    case "carousel":
      return (
        <Axis label="orientation">
          {(["horizontal", "vertical"] as const).map((orientation) => (
            <Sample key={orientation} label={orientation}>
              <UI.Carousel
                aria-label={`${orientation} carousel`}
                orientation={orientation}
                className={orientation === "vertical" ? "h-48 w-48" : "w-48"}>
                <UI.CarouselContent className={orientation === "vertical" ? "h-48" : undefined}>
                  <UI.CarouselItem>
                    <div className="rounded bg-muted p-8">One</div>
                  </UI.CarouselItem>
                  <UI.CarouselItem>
                    <div className="rounded bg-muted p-8">Two</div>
                  </UI.CarouselItem>
                </UI.CarouselContent>
              </UI.Carousel>
            </Sample>
          ))}
        </Axis>
      )
    case "checkbox":
      return (
        <Axis label="semantic">
          <UI.Checkbox aria-label="Unchecked" />
          <UI.Checkbox aria-label="Checked" defaultChecked />
          <UI.Checkbox aria-label="Disabled" disabled />
          <UI.Checkbox aria-label="Invalid" aria-invalid />
        </Axis>
      )
    case "context-menu":
      return (
        <Axis label="item variant">
          <UI.ContextMenu>
            <UI.ContextMenuTrigger className="rounded border p-6">Right click</UI.ContextMenuTrigger>
            <UI.ContextMenuContent>
              <UI.ContextMenuItem variant="default">Default</UI.ContextMenuItem>
              <UI.ContextMenuItem variant="destructive">Destructive</UI.ContextMenuItem>
            </UI.ContextMenuContent>
          </UI.ContextMenu>
        </Axis>
      )
    case "dropdown-menu":
      return (
        <Axis label="item variant">
          <UI.DropdownMenu defaultOpen>
            <UI.DropdownMenuTrigger render={<UI.Button />}>Menu</UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent>
              <UI.DropdownMenuItem variant="default">Default</UI.DropdownMenuItem>
              <UI.DropdownMenuItem variant="destructive">Destructive</UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
        </Axis>
      )
    case "field":
      return (
        <div className="space-y-6">
          <Axis label="orientation">
            {(["vertical", "horizontal", "responsive"] as const).map((orientation) => (
              <UI.Field key={orientation} orientation={orientation}>
                <UI.FieldLabel htmlFor={`field-${orientation}`}>{orientation}</UI.FieldLabel>
                <UI.Input id={`field-${orientation}`} />
              </UI.Field>
            ))}
          </Axis>
          <Axis label="legend">
            <UI.FieldSet>
              <UI.FieldLegend variant="legend">Legend</UI.FieldLegend>
            </UI.FieldSet>
            <UI.FieldSet>
              <UI.FieldLegend variant="label">Label</UI.FieldLegend>
            </UI.FieldSet>
          </Axis>
        </div>
      )
    case "input":
      return (
        <Axis label="semantic">
          <UI.Input aria-label="Default input" placeholder="Default" />
          <UI.Input aria-label="Disabled input" disabled placeholder="Disabled" />
          <UI.Input aria-label="Invalid input" aria-invalid placeholder="Invalid" />
        </Axis>
      )
    case "input-group":
      return (
        <div className="space-y-6">
          <Axis label="addon align">
            {(["inline-start", "inline-end", "block-start", "block-end"] as const).map((align) => (
              <UI.InputGroup key={align} className="w-56">
                <UI.InputGroupAddon align={align}>{align}</UI.InputGroupAddon>
                <UI.InputGroupInput aria-label={align} />
              </UI.InputGroup>
            ))}
          </Axis>
          <Axis label="button size">
            {(["xs", "sm", "icon-xs", "icon-sm"] as const).map((size) => (
              <UI.InputGroupButton key={size} size={size} aria-label={size}>
                {size.startsWith("icon") ? "+" : size}
              </UI.InputGroupButton>
            ))}
          </Axis>
        </div>
      )
    case "item":
      return (
        <div className="space-y-6">
          <Axis label="variant">
            {(["default", "outline", "muted"] as const).map((variant) => (
              <UI.Item key={variant} variant={variant} className="w-56">
                <UI.ItemContent>
                  <UI.ItemTitle>{variant}</UI.ItemTitle>
                </UI.ItemContent>
              </UI.Item>
            ))}
          </Axis>
          <Axis label="size">
            {(["default", "sm", "xs"] as const).map((size) => (
              <UI.Item key={size} size={size} className="w-48">
                <UI.ItemContent>
                  <UI.ItemTitle>{size}</UI.ItemTitle>
                </UI.ItemContent>
              </UI.Item>
            ))}
          </Axis>
          <Axis label="media">
            <UI.ItemMedia variant="default">D</UI.ItemMedia>
            <UI.ItemMedia variant="icon">+</UI.ItemMedia>
            <UI.ItemMedia variant="image">
              <div className="size-full bg-muted" />
            </UI.ItemMedia>
          </Axis>
        </div>
      )
    case "marker":
      return (
        <Axis label="variant">
          {(["default", "separator", "border"] as const).map((variant) => (
            <UI.Marker key={variant} variant={variant}>
              <UI.MarkerContent>{variant}</UI.MarkerContent>
            </UI.Marker>
          ))}
        </Axis>
      )
    case "message":
      return (
        <Axis label="align">
          {(["start", "end"] as const).map((align) => (
            <UI.Message key={align} align={align}>
              <UI.MessageContent>
                <UI.Bubble align={align}>
                  <UI.BubbleContent>{align}</UI.BubbleContent>
                </UI.Bubble>
              </UI.MessageContent>
            </UI.Message>
          ))}
        </Axis>
      )
    case "native-select":
      return (
        <Axis label="size">
          {(["default", "sm"] as const).map((size) => (
            <UI.NativeSelect key={size} size={size} aria-label={`${size} native select`}>
              <UI.NativeSelectOption>{size}</UI.NativeSelectOption>
            </UI.NativeSelect>
          ))}
        </Axis>
      )
    case "select":
      return (
        <div className="space-y-6">
          <Axis label="size">
            {(["default", "sm"] as const).map((size) => (
              <UI.Select key={size}>
                <UI.SelectTrigger size={size} aria-label={`${size} select`}>
                  {labels}
                </UI.SelectTrigger>
                {options}
              </UI.Select>
            ))}
          </Axis>
          <Axis label="semantic">
            <UI.Select>
              <UI.SelectTrigger aria-label="Default select">{labels}</UI.SelectTrigger>
              {options}
            </UI.Select>
            <UI.Select disabled>
              <UI.SelectTrigger aria-label="Disabled select">{labels}</UI.SelectTrigger>
              {options}
            </UI.Select>
            <UI.Select>
              <UI.SelectTrigger aria-label="Invalid select" aria-invalid>
                {labels}
              </UI.SelectTrigger>
              {options}
            </UI.Select>
          </Axis>
        </div>
      )
    case "sheet":
      return (
        <Axis label="side">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <UI.Sheet key={side}>
              <UI.SheetTrigger render={<UI.Button variant="outline" />}>{side}</UI.SheetTrigger>
              <UI.SheetContent side={side}>
                <UI.SheetHeader>
                  <UI.SheetTitle>{side} sheet</UI.SheetTitle>
                  <UI.SheetDescription>Side variant</UI.SheetDescription>
                </UI.SheetHeader>
              </UI.SheetContent>
            </UI.Sheet>
          ))}
        </Axis>
      )
    case "sidebar":
      return (
        <div className="space-y-6">
          <Axis label="side and variant">
            {(["left", "right"] as const).flatMap((side) =>
              (["sidebar", "floating", "inset"] as const).map((variant) => (
                <Sample key={`${side}-${variant}`} label={`${side} ${variant}`}>
                  <UI.SidebarProvider defaultOpen>
                    <div className="h-32 w-48 overflow-hidden">
                      <UI.Sidebar side={side} variant={variant} collapsible="none">
                        <UI.SidebarContent>
                          <UI.SidebarGroupLabel>{variant}</UI.SidebarGroupLabel>
                        </UI.SidebarContent>
                      </UI.Sidebar>
                    </div>
                  </UI.SidebarProvider>
                </Sample>
              ))
            )}
          </Axis>
          <Axis label="collapsible">
            {(["offcanvas", "icon", "none"] as const).map((collapsible) => (
              <span key={collapsible} className="rounded border p-2">
                {collapsible}
              </span>
            ))}
          </Axis>
          <Axis label="menu button">
            {(["default", "outline"] as const).flatMap((variant) =>
              (["default", "sm", "lg"] as const).map((size) => (
                <UI.SidebarProvider key={`${variant}-${size}`}>
                  <UI.SidebarMenuButton variant={variant} size={size}>
                    {variant} {size}
                  </UI.SidebarMenuButton>
                </UI.SidebarProvider>
              ))
            )}
          </Axis>
        </div>
      )
    case "switch":
      return (
        <div className="space-y-6">
          <Axis label="size">
            {(["default", "sm"] as const).map((size) => (
              <UI.Switch key={size} size={size} aria-label={`${size} switch`} />
            ))}
          </Axis>
          <Axis label="semantic">
            <UI.Switch aria-label="Unchecked switch" />
            <UI.Switch aria-label="Checked switch" defaultChecked />
            <UI.Switch aria-label="Disabled switch" disabled />
            <UI.Switch aria-label="Invalid switch" aria-invalid />
          </Axis>
        </div>
      )
    case "tabs":
      return (
        <Axis label="orientation and variant">
          {(["horizontal", "vertical"] as const).flatMap((orientation) =>
            (["default", "line"] as const).map((variant) => (
              <UI.Tabs key={`${orientation}-${variant}`} defaultValue="one" orientation={orientation}>
                <UI.TabsList variant={variant}>
                  <UI.TabsTrigger value="one">One</UI.TabsTrigger>
                  <UI.TabsTrigger value="two">Two</UI.TabsTrigger>
                </UI.TabsList>
                <UI.TabsContent value="one">
                  {orientation} {variant}
                </UI.TabsContent>
              </UI.Tabs>
            ))
          )}
        </Axis>
      )
    case "toggle":
      return (
        <div className="space-y-6">
          <Axis label="variant">
            {(["default", "outline"] as const).map((variant) => (
              <UI.Toggle key={variant} variant={variant}>
                {variant}
              </UI.Toggle>
            ))}
          </Axis>
          <Axis label="size">
            {(["default", "sm", "lg"] as const).map((size) => (
              <UI.Toggle key={size} size={size}>
                {size}
              </UI.Toggle>
            ))}
          </Axis>
          <Axis label="semantic">
            <UI.Toggle>off</UI.Toggle>
            <UI.Toggle defaultPressed>on</UI.Toggle>
            <UI.Toggle disabled>disabled</UI.Toggle>
          </Axis>
        </div>
      )
    case "toggle-group":
      return (
        <Axis label="orientation">
          {(["horizontal", "vertical"] as const).map((orientation) => (
            <UI.ToggleGroup key={orientation} orientation={orientation} defaultValue={["one"]}>
              <UI.ToggleGroupItem value="one">One</UI.ToggleGroupItem>
              <UI.ToggleGroupItem value="two">Two</UI.ToggleGroupItem>
            </UI.ToggleGroup>
          ))}
        </Axis>
      )
  }
}
