import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(defaultValue?: boolean) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(defaultValue)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (!isMobile) return
  return children
}

export function NonMobileOnly({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  if (isMobile) return
  return children
}
