import { useEffect, useState } from "react"

const breakpoint = 768

export function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setMobile(window.innerWidth < breakpoint)
    query.addEventListener("change", update)
    update()
    return () => query.removeEventListener("change", update)
  }, [])
  return mobile
}
