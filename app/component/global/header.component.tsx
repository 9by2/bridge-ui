import { Link } from "@tanstack/react-router"
import { Suspense, type ReactNode } from "react"

import { LogoComponent } from "./logo.component"

type HeaderComponentProps = {
  readonly warningSlot?: ReactNode
  readonly sidebarTriggerSlot?: ReactNode
  readonly localeSwitcherSlot?: ReactNode
  readonly navigationSlot?: ReactNode
}

export function HeaderComponent({
  warningSlot,
  sidebarTriggerSlot,
  localeSwitcherSlot,
  navigationSlot
}: HeaderComponentProps) {
  return (
    <header className="sticky top-0 z-10">
      {warningSlot}
      <div className="flex flex-row items-center justify-between p-4 h-16 border-b bg-background">
        <BrandComponent sidebarTriggerSlot={sidebarTriggerSlot} />
        <div className="flex items-center gap-2">
          {navigationSlot}
          {localeSwitcherSlot}
        </div>
      </div>
    </header>
  )
}

function BrandComponent({ sidebarTriggerSlot }: { readonly sidebarTriggerSlot?: ReactNode }) {
  return (
    <Suspense>
      <div className="flex flex-row gap-4 items-center">
        {sidebarTriggerSlot}
        <Link to="/">
          <LogoComponent className="h-[30px] w-auto text-white" />
        </Link>
      </div>
    </Suspense>
  )
}
