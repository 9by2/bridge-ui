export const variantMatrix = {
  alert: { variant: ["default", "destructive"] },
  "alert-dialog": { size: ["default", "sm"] },
  attachment: {
    media: ["icon", "image"],
    orientation: ["horizontal", "vertical"],
    size: ["default", "sm", "xs"],
    state: ["idle", "uploading", "processing", "error", "done"]
  },
  avatar: { size: ["default", "sm", "lg"] },
  badge: { variant: ["default", "secondary", "destructive", "outline", "ghost", "link"] },
  bubble: {
    align: ["start", "end"],
    reactionAlign: ["start", "end"],
    reactionSide: ["top", "bottom"],
    variant: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"]
  },
  button: {
    semantic: ["enabled", "disabled", "invalid"],
    size: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    variant: ["default", "outline", "secondary", "ghost", "destructive", "link"]
  },
  "button-group": { orientation: ["horizontal", "vertical"] },
  card: { size: ["default", "sm"] },
  carousel: { orientation: ["horizontal", "vertical"] },
  checkbox: { semantic: ["unchecked", "checked", "disabled", "invalid"] },
  "context-menu": { variant: ["default", "destructive"] },
  "dropdown-menu": { variant: ["default", "destructive"] },
  field: { legend: ["legend", "label"], orientation: ["vertical", "horizontal", "responsive"] },
  input: { semantic: ["default", "disabled", "invalid"] },
  "input-group": {
    align: ["inline-start", "inline-end", "block-start", "block-end"],
    buttonSize: ["xs", "sm", "icon-xs", "icon-sm"]
  },
  item: {
    media: ["default", "icon", "image"],
    size: ["default", "sm", "xs"],
    variant: ["default", "outline", "muted"]
  },
  marker: { variant: ["default", "separator", "border"] },
  message: { align: ["start", "end"] },
  "native-select": { size: ["default", "sm"] },
  select: { semantic: ["default", "disabled", "invalid"], size: ["default", "sm"] },
  sheet: { side: ["top", "right", "bottom", "left"] },
  sidebar: {
    collapsible: ["offcanvas", "icon", "none"],
    menuButtonSize: ["default", "sm", "lg"],
    menuButtonVariant: ["default", "outline"],
    side: ["left", "right"],
    variant: ["sidebar", "floating", "inset"]
  },
  switch: { semantic: ["unchecked", "checked", "disabled", "invalid"], size: ["default", "sm"] },
  tabs: { orientation: ["horizontal", "vertical"], variant: ["default", "line"] },
  toggle: {
    semantic: ["off", "on", "disabled"],
    size: ["default", "sm", "lg"],
    variant: ["default", "outline"]
  },
  "toggle-group": { orientation: ["horizontal", "vertical"] }
} as const

export type VariantName = keyof typeof variantMatrix
