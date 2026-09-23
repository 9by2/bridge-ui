import * as stylex from "@stylexjs/stylex"
import { Group, Panel, Separator } from "react-resizable-panels"
import type { GroupProps, PanelProps, SeparatorProps } from "react-resizable-panels"

import { token } from "./token.stylex"

const style = stylex.create({
  group: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: { default: "row", ':is([aria-orientation="vertical"])': "column" }
  },
  handle: {
    position: "relative",
    display: "flex",
    width: { default: 1, ':is([aria-orientation="horizontal"])': "100%" },
    height: { default: "auto", ':is([aria-orientation="horizontal"])': 1 },
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: token.border,
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 1px ${token.ring}` },
    content: { "::after": '""' }
  },
  grip: {
    zIndex: 10,
    display: "flex",
    height: 24,
    width: 4,
    flexShrink: 0,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    backgroundColor: token.border,
    rotate: { default: "0deg", [stylex.when.ancestor('[aria-orientation="horizontal"]')]: "90deg" }
  }
})
export function ResizablePanelGroup({ className, ...props }: GroupProps) {
  return (
    <Group
      data-slot="resizable-panel-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ResizablePanel(props: PanelProps) {
  return <Panel data-slot="resizable-panel" {...props} />
}
export function ResizableHandle({ className, withHandle, ...props }: SeparatorProps & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.handle).className, className].filter(Boolean).join(" ")}>
      {withHandle && <div {...stylex.props(style.grip)} />}
    </Separator>
  )
}
