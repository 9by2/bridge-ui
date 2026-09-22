import { MonitorIcon } from "lucide-react"
import { Bar, BarChart } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {[false, true].map((hideIcon) => (
        <section key={String(hideIcon)}>
          <UI.Heading as={UI.WAIHeading.H3}>{hideIcon ? "Text only" : "Custom icon"}</UI.Heading>
          <UI.ChartContainer
            className="h-56 w-full"
            config={{
              desktop: { label: "Desktop", icon: MonitorIcon, theme: { light: "#4f46e5", dark: "#a5b4fc" } },
              mobile: { label: "Mobile", color: "#2dd4bf" }
            }}>
            <BarChart
              data={[
                { name: "Jan", desktop: 40, mobile: 30 },
                { name: "Feb", desktop: 60, mobile: 50 }
              ]}>
              <Bar dataKey="desktop" fill="var(--color-desktop)" />
              <Bar dataKey="mobile" fill="var(--color-mobile)" />
              <UI.ChartLegend
                verticalAlign={hideIcon ? "top" : "bottom"}
                content={<UI.ChartLegendContent hideIcon={hideIcon} />}
              />
            </BarChart>
          </UI.ChartContainer>
        </section>
      ))}
    </div>
  )
}
