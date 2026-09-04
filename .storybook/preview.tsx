import type { Preview } from "@storybook/react-vite"
import { useEffect } from "react"

import "../app/style/global.css"

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light"
      const locale = context.globals.locale === "th" ? "th" : "en"
      const reducedMotion = context.globals.motion === "reduced"

      useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
        document.documentElement.lang = locale
        document.documentElement.dataset.motion = reducedMotion ? "reduced" : "normal"
      }, [locale, reducedMotion, theme])

      return (
        <div className="min-h-40 bg-background p-6 text-foreground">
          <p className="mb-4 text-xs text-muted-foreground">
            {locale === "th" ? "ตัวอย่างคอมโพเนนต์ที่ใช้ร่วมกัน" : "Shared component example"}
          </p>
          <Story />
        </div>
      )
    }
  ],
  globalTypes: {
    locale: {
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { title: "English", value: "en" },
          { title: "Thai", value: "th" }
        ]
      }
    },
    motion: {
      defaultValue: "normal",
      toolbar: {
        icon: "lightning",
        items: [
          { title: "Normal motion", value: "normal" },
          { title: "Reduced motion", value: "reduced" }
        ]
      }
    },
    theme: {
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" }
        ]
      }
    }
  },
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    layout: "fullscreen"
  },
  tags: ["autodocs"]
}

export default preview
