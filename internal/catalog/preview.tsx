import { useEffect, useRef, useState } from "react"

export function Preview({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      rootMargin: "200px"
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} data-preview={title} style={{ minHeight: 420 }}>
      {visible ? <iframe title={title} src={src} /> : <p className="p-4 text-sm">Preview loads when visible.</p>}
    </div>
  )
}
