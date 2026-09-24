import type { SVGProps } from "react"

import * as UI from "@bridge/ui"

/**
 * Neutral placeholder mark standing in for a consumer brand/social icon (DEC-003).
 * No intrinsic width/height and `currentColor` fill: the host slot owns size and color.
 */
function PlaceholderMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-testid="placeholder-mark" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  )
}

export default function Example() {
  return (
    <div className="grid w-full max-w-3xl gap-6">
      <section className="flex flex-wrap items-center gap-3" aria-label="Button slot">
        <UI.Button>
          <PlaceholderMark />
          Connect account
        </UI.Button>
        <UI.Button variant="outline" size="sm">
          <PlaceholderMark />
          Share
        </UI.Button>
        <UI.Button variant="ghost" size="icon" aria-label="Open profile">
          <PlaceholderMark />
        </UI.Button>
      </section>
      <UI.Item variant="outline" aria-label="Item slot">
        <UI.ItemMedia variant="icon">
          <PlaceholderMark />
        </UI.ItemMedia>
        <UI.ItemContent>
          <UI.ItemTitle>Streaming channel</UI.ItemTitle>
          <UI.ItemDescription>A consumer-supplied mark in ItemMedia.</UI.ItemDescription>
        </UI.ItemContent>
      </UI.Item>
      <UI.MetricTile variants="standard" label="Follower" value="12.4k" icon={<PlaceholderMark />} />
      <div className="flex flex-wrap items-center gap-4" aria-label="Other slot">
        <UI.Marker>
          <UI.MarkerIcon>
            <PlaceholderMark />
          </UI.MarkerIcon>
          <UI.MarkerContent>Marker</UI.MarkerContent>
        </UI.Marker>
        <UI.Badge>
          <PlaceholderMark />
          Badge
        </UI.Badge>
        <UI.SidebarProvider className="min-h-0 w-auto">
          <UI.SidebarMenuButton>
            <PlaceholderMark />
            <span>Sidebar</span>
          </UI.SidebarMenuButton>
        </UI.SidebarProvider>
      </div>
      <UI.Settings aria-label="Settings slot" className="min-h-0">
        <UI.SettingsNavItem isActive>
          <PlaceholderMark />
          Linked account
        </UI.SettingsNavItem>
      </UI.Settings>
      <UI.DataState>
        <UI.DataStateMedia>
          <PlaceholderMark />
        </UI.DataStateMedia>
        <UI.DataStateTitle>DataStateMedia</UI.DataStateTitle>
      </UI.DataState>
      <UI.Empty>
        <UI.EmptyHeader>
          <UI.EmptyMedia variant="icon">
            <PlaceholderMark />
          </UI.EmptyMedia>
          <UI.EmptyTitle>EmptyMedia</UI.EmptyTitle>
        </UI.EmptyHeader>
      </UI.Empty>
    </div>
  )
}
