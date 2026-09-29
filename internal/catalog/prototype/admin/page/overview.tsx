import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { defineChart, dot, lineY } from "@tanstack/charts"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { ActivityIcon, ArrowUpRightIcon, DollarSignIcon, UsersIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

const signup = [
  { week: "W1", free: 320, paid: 48 },
  { week: "W2", free: 410, paid: 61 },
  { week: "W3", free: 388, paid: 72 },
  { week: "W4", free: 502, paid: 90 }
]
const latency = [
  { hour: 0, ms: 182 },
  { hour: 4, ms: 140 },
  { hour: 8, ms: 236 },
  { hour: 12, ms: 298 },
  { hour: 16, ms: 264 },
  { hour: 20, ms: 201 }
]
const latencyDefinition = defineChart({
  marks: [
    lineY(latency, { x: "hour", y: "ms", stroke: "#818cf8" }),
    dot(latency, { x: "hour", y: "ms", fill: "#2dd4bf" })
  ],
  scales: { x: { scale: scaleLinear }, y: { scale: scaleLinear, nice: true, grid: true } }
})
const activity = [
  { who: "Alex Kim", initial: "AK", what: "upgraded Acme Inc. to Business", when: "2 min ago" },
  { who: "Priya Shah", initial: "PS", what: "invited 4 member to Globex", when: "18 min ago" },
  { who: "Tom Becker", initial: "TB", what: "rotated an API key", when: "1 hour ago" }
] as const

export function OverviewPage() {
  usePageAction(
    <UI.Button variant="outline" onClick={() => notify.info("Report scheduled for Monday 09:00")}>
      Schedule report
    </UI.Button>
  )
  return (
    <UI.Page>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Overview</UI.PageTitle>
          <UI.PageDescription>Account health for the last 30 day.</UI.PageDescription>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.Select defaultValue="30d">
            <UI.SelectTrigger aria-label="Period">
              <UI.SelectValue />
            </UI.SelectTrigger>
            <UI.SelectContent>
              <UI.SelectItem value="7d">Last 7 day</UI.SelectItem>
              <UI.SelectItem value="30d">Last 30 day</UI.SelectItem>
              <UI.SelectItem value="90d">Last 90 day</UI.SelectItem>
            </UI.SelectContent>
          </UI.Select>
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <UI.MetricTile
              variants="featured"
              label="MRR"
              value="$84,210"
              description="+6.2% month over month"
              icon={<DollarSignIcon aria-hidden="true" />}
            />
            <UI.MetricTile
              variants="standard"
              label="Active account"
              value="1,284"
              icon={<UsersIcon aria-hidden="true" />}
            />
            <UI.MetricTile variants="standard" label="Churn" value="1.8%" description="Below 2% target" />
            <UI.MetricTile
              variants="compact"
              label="Uptime"
              value="99.98%"
              icon={<ActivityIcon aria-hidden="true" />}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Weekly signup</UI.CardTitle>
                <UI.CardDescription>Free and paid plan.</UI.CardDescription>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.ChartContainer
                  config={{ free: { label: "Free", color: "#94a3b8" }, paid: { label: "Paid", color: "#818cf8" } }}>
                  <BarChart data={signup}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} />
                    <UI.ChartTooltip content={<UI.ChartTooltipContent indicator="dashed" />} />
                    <UI.ChartLegend content={<UI.ChartLegendContent />} />
                    <Bar dataKey="free" fill="var(--color-free)" radius={4} />
                    <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                  </BarChart>
                </UI.ChartContainer>
              </UI.CardContent>
            </UI.Card>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>API latency p95</UI.CardTitle>
                <UI.CardDescription>Millisecond by hour of day.</UI.CardDescription>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.TsChart definition={latencyDefinition} ariaLabel="API latency by hour" />
              </UI.CardContent>
            </UI.Card>
          </div>
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Recent activity</UI.CardTitle>
              <UI.CardAction>
                <UI.Button variant="ghost" size="sm">
                  View all
                  <ArrowUpRightIcon aria-hidden="true" />
                </UI.Button>
              </UI.CardAction>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.ItemGroup>
                {activity.map((item, index) => (
                  <div key={item.who}>
                    {index > 0 ? <UI.ItemSeparator /> : null}
                    <UI.Item>
                      <UI.ItemMedia>
                        <UI.Avatar>
                          <UI.AvatarFallback>{item.initial}</UI.AvatarFallback>
                        </UI.Avatar>
                      </UI.ItemMedia>
                      <UI.ItemContent>
                        <UI.ItemTitle>{item.who}</UI.ItemTitle>
                        <UI.ItemDescription>{item.what}</UI.ItemDescription>
                      </UI.ItemContent>
                      <UI.ItemActions>
                        <UI.Small>{item.when}</UI.Small>
                      </UI.ItemActions>
                    </UI.Item>
                  </div>
                ))}
              </UI.ItemGroup>
            </UI.CardContent>
          </UI.Card>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
