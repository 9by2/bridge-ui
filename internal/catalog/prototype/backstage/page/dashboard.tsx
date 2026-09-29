import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { barY, defineChart } from "@tanstack/charts"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { DownloadIcon, RefreshCwIcon, TicketIcon, UsersIcon } from "lucide-react"
import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

const revenue = [
  { month: "Apr", ticket: 182, merch: 64 },
  { month: "May", ticket: 205, merch: 71 },
  { month: "Jun", ticket: 248, merch: 90 },
  { month: "Jul", ticket: 231, merch: 82 },
  { month: "Aug", ticket: 296, merch: 104 },
  { month: "Sep", ticket: 318, merch: 121 }
]
const genreDefinition = defineChart({
  marks: [
    barY(
      [
        { genre: "Pop", stream: 42 },
        { genre: "Rock", stream: 28 },
        { genre: "Luk thung", stream: 35 },
        { genre: "Indie", stream: 19 },
        { genre: "Hip-hop", stream: 24 }
      ],
      { x: "genre", y: "stream", fill: "#818cf8" }
    )
  ],
  scales: { x: { scale: scaleBand }, y: { scale: scaleLinear, nice: true, grid: true } }
})
const topMusician = [
  { name: "Numb Heart", genre: "Indie", earning: "฿412,000", progress: 82, status: "success" },
  { name: "ลำไย ไหทองคำ", genre: "Luk thung", earning: "฿388,500", progress: 74, status: "success" },
  { name: "Polycat", genre: "Pop", earning: "฿301,200", progress: 61, status: "pending" },
  { name: "Slot Machine", genre: "Rock", earning: "฿215,900", progress: 43, status: "warning" }
] as const

function RevenueChart() {
  return (
    <UI.ChartContainer
      config={{ ticket: { label: "Ticket", color: "#818cf8" }, merch: { label: "Merch", color: "#2dd4bf" } }}>
      <AreaChart data={revenue}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
        <UI.ChartLegend content={<UI.ChartLegendContent />} />
        <Area dataKey="ticket" type="monotone" stackId="a" fill="var(--color-ticket)" stroke="var(--color-ticket)" />
        <Area dataKey="merch" type="monotone" stackId="a" fill="var(--color-merch)" stroke="var(--color-merch)" />
      </AreaChart>
    </UI.ChartContainer>
  )
}

function TopMusician() {
  return (
    <UI.Table>
      <UI.TableHeader>
        <UI.TableRow>
          <UI.TableHead>Musician</UI.TableHead>
          <UI.TableHead>Genre</UI.TableHead>
          <UI.TableHead>YTD earning</UI.TableHead>
          <UI.TableHead>Target</UI.TableHead>
        </UI.TableRow>
      </UI.TableHeader>
      <UI.TableBody>
        {topMusician.map((row) => (
          <UI.TableRow key={row.name}>
            <UI.TableCell>
              <UI.HoverCard>
                <UI.HoverCardTrigger render={<UI.Button variant="link" />}>{row.name}</UI.HoverCardTrigger>
                <UI.HoverCardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <UI.Heading>{row.name}</UI.Heading>
                    <UI.Muted>{row.genre} · 12 upcoming show</UI.Muted>
                    <UI.Badge variant={row.status}>{row.status}</UI.Badge>
                  </div>
                </UI.HoverCardContent>
              </UI.HoverCard>
            </UI.TableCell>
            <UI.TableCell>
              <UI.Badge variant="outline">{row.genre}</UI.Badge>
            </UI.TableCell>
            <UI.TableCell>{row.earning}</UI.TableCell>
            <UI.TableCell>
              <UI.Progress aria-label={`${row.name} target`} value={row.progress} />
            </UI.TableCell>
          </UI.TableRow>
        ))}
      </UI.TableBody>
      <UI.TableCaption>Top earning musician this year.</UI.TableCaption>
    </UI.Table>
  )
}

export function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)
  usePageAction(
    <UI.Button onClick={() => notify.success("Report exported", "backstage-ytd-2026.csv")}>
      <DownloadIcon aria-hidden="true" />
      Export
    </UI.Button>
  )
  return (
    <UI.Page>
      <UI.PageBreadcrumb>
        <UI.Breadcrumb>
          <UI.BreadcrumbList>
            <UI.BreadcrumbItem>
              <UI.BreadcrumbLink render={<button type="button" />}>Backstage</UI.BreadcrumbLink>
            </UI.BreadcrumbItem>
            <UI.BreadcrumbSeparator />
            <UI.BreadcrumbItem>
              <UI.BreadcrumbPage>Dashboard</UI.BreadcrumbPage>
            </UI.BreadcrumbItem>
          </UI.BreadcrumbList>
        </UI.Breadcrumb>
      </UI.PageBreadcrumb>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Studio · 2026</UI.PageEyebrow>
          <UI.PageTitle>Good morning, Nara</UI.PageTitle>
          <UI.PageDescription>
            Year-to-date earning, streaming and upcoming show across every roster.
          </UI.PageDescription>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.ButtonGroup>
            <UI.Button variant="outline">7 day</UI.Button>
            <UI.Button variant="outline">30 day</UI.Button>
            <UI.Button variant="outline">YTD</UI.Button>
          </UI.ButtonGroup>
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6">
          <UI.Alert variant="info">
            <UI.AlertTitle>September payout is ready</UI.AlertTitle>
            <UI.AlertDescription>
              Review 14 musician statement before 30 Sep to release payment on time.
            </UI.AlertDescription>
          </UI.Alert>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <UI.MetricTile variants="featured" label="YTD earning" value="฿4.82M" description="+18% vs last year" />
            <UI.MetricTile
              variants="standard"
              label="Ticket sold"
              value="38,214"
              description="All event"
              icon={<TicketIcon aria-hidden="true" />}
            />
            <UI.MetricTile
              variants="standard"
              label="Active musician"
              value="126"
              description="12 new this month"
              icon={<UsersIcon aria-hidden="true" />}
            />
            {refreshing ? (
              <UI.MetricTile variants="compact" label="Queue" value="" loading loadingLabel="Refreshing queue" />
            ) : (
              <UI.MetricTile variants="compact" label="Queue" value="23" description="Waiting review" />
            )}
          </div>
          <UI.Tabs defaultValue="revenue">
            <UI.TabsList>
              <UI.TabsTrigger value="revenue">Revenue</UI.TabsTrigger>
              <UI.TabsTrigger value="genre">Streaming by genre</UI.TabsTrigger>
              <UI.TabsTrigger value="loading">Live feed</UI.TabsTrigger>
            </UI.TabsList>
            <UI.TabsContent value="revenue">
              <UI.Card>
                <UI.CardHeader>
                  <UI.CardTitle>Monthly revenue</UI.CardTitle>
                  <UI.CardDescription>Ticket and merchandise, thousand baht.</UI.CardDescription>
                  <UI.CardAction>
                    <UI.Button
                      variant="ghost"
                      size="icon"
                      aria-label="Refresh"
                      onClick={() => {
                        setRefreshing(true)
                        setTimeout(() => setRefreshing(false), 1200)
                      }}>
                      {refreshing ? <UI.Spinner aria-label="Refreshing" /> : <RefreshCwIcon aria-hidden="true" />}
                    </UI.Button>
                  </UI.CardAction>
                </UI.CardHeader>
                <UI.CardContent>
                  <RevenueChart />
                </UI.CardContent>
              </UI.Card>
            </UI.TabsContent>
            <UI.TabsContent value="genre">
              <UI.Card>
                <UI.CardHeader>
                  <UI.CardTitle>Streaming by genre</UI.CardTitle>
                  <UI.CardDescription>Million stream, rendered with TsChart.</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <UI.TsChart definition={genreDefinition} ariaLabel="Streaming by genre" />
                </UI.CardContent>
              </UI.Card>
            </UI.TabsContent>
            <UI.TabsContent value="loading">
              <UI.Card>
                <UI.CardHeader>
                  <UI.CardTitle>Live feed</UI.CardTitle>
                  <UI.CardDescription>Waiting for the next ticket scan.</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <UI.Skeleton />
                    <UI.Skeleton />
                    <UI.Skeleton />
                  </div>
                </UI.CardContent>
              </UI.Card>
            </UI.TabsContent>
          </UI.Tabs>
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Top musician</UI.CardTitle>
              <UI.CardDescription>Hover a name for a profile preview.</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <TopMusician />
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Muted>Updated 5 minutes ago</UI.Muted>
            </UI.CardFooter>
          </UI.Card>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
