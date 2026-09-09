import { Separator as Primitive } from "@base-ui/react/separator"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  root: { flexShrink: 0, backgroundColor: token.border },
  horizontal: { height: 1, width: "100%" },
  vertical: { width: 1, alignSelf: "stretch" }
})
export function Separator({ className, orientation = "horizontal", ...props }: Primitive.Props) {
  return (
    <Primitive
      data-slot="separator"
      orientation={orientation}
      {...props}
      className={(state) =>
        [
          stylex.props(style.root, orientation === "vertical" ? style.vertical : style.horizontal).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
