import { ArrowRightIcon, ChevronRightIcon, DotIcon, SlashIcon } from "lucide-react"
import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

const separatorExample = [
  { label: "Default chevron", separator: undefined },
  { label: "Slash", separator: "/" },
  { label: "Dot", separator: "•" },
  { label: "Arrow", separator: <ArrowRightIcon size={14} /> },
  { label: "Chevron icon", separator: <ChevronRightIcon size={14} /> },
  { label: "Slash icon", separator: <SlashIcon size={14} /> },
  { label: "Dot icon", separator: <DotIcon size={14} /> },
  { label: "Text", separator: "then" }
] as const satisfies ReadonlyArray<{ readonly label: string; readonly separator: ReactNode }>

export default function Example() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-muted-foreground">Caller-provided separator content examples.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {separatorExample.map(({ label, separator }) => (
          <section key={label} className="space-y-2">
            <h3 className="text-sm font-semibold">{label}</h3>
            <UI.Breadcrumb>
              <UI.BreadcrumbList>
                <UI.BreadcrumbItem>
                  <UI.BreadcrumbLink href="#home">Home</UI.BreadcrumbLink>
                </UI.BreadcrumbItem>
                <UI.BreadcrumbSeparator>{separator}</UI.BreadcrumbSeparator>
                <UI.BreadcrumbItem>
                  <UI.BreadcrumbPage>Current</UI.BreadcrumbPage>
                </UI.BreadcrumbItem>
              </UI.BreadcrumbList>
            </UI.Breadcrumb>
          </section>
        ))}
      </div>
    </section>
  )
}
