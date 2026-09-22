import { Avatar as Primitive } from "@base-ui/react/avatar"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: 9999,
    userSelect: "none",
    boxShadow: {
      default: "none",
      [stylex.when.ancestor('[data-slot="avatar-group"]')]: `0 0 0 2px ${token.background}`
    },
    marginLeft: { default: 0, [stylex.when.ancestor('[data-slot="avatar-group"]')]: { default: -8, ":first-child": 0 } }
  },
  sm: { width: 24, height: 24 },
  lg: { width: 40, height: 40 },
  image: { aspectRatio: "1", width: "100%", height: "100%", borderRadius: 9999, objectFit: "cover" },
  fallback: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: token.muted,
    fontSize: { default: 14, [stylex.when.ancestor('[data-size="sm"]')]: 12 },
    lineHeight: "20px",
    color: token.foreground
  },
  badge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: token.primary,
    color: token.primaryForeground,
    backgroundBlendMode: "color",
    boxShadow: `0 0 0 2px ${token.background}`,
    userSelect: "none",
    width: {
      default: 10,
      [stylex.when.ancestor('[data-size="sm"]')]: 8,
      [stylex.when.ancestor('[data-size="lg"]')]: 12
    },
    height: {
      default: 10,
      [stylex.when.ancestor('[data-size="sm"]')]: 8,
      [stylex.when.ancestor('[data-size="lg"]')]: 12
    }
  },
  group: { display: "flex" },
  count: {
    position: "relative",
    display: "flex",
    width: {
      default: 32,
      [stylex.when.ancestor(':has([data-size="lg"])')]: 40,
      [stylex.when.ancestor(':has([data-size="sm"])')]: 24
    },
    height: {
      default: 32,
      [stylex.when.ancestor(':has([data-size="lg"])')]: 40,
      [stylex.when.ancestor(':has([data-size="sm"])')]: 24
    },
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: token.muted,
    fontSize: 14,
    color: token.mutedForeground,
    boxShadow: `0 0 0 2px ${token.background}`,
    marginLeft: -8
  }
})
export function Avatar({
  className,
  size = "default",
  ...props
}: Primitive.Root.Props & { size?: "default" | "sm" | "lg" }) {
  return (
    <Primitive.Root
      data-slot="avatar"
      data-size={size}
      {...props}
      className={(state) =>
        [
          stylex.props(stylex.defaultMarker(), style.root, size !== "default" && style[size]).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AvatarImage({ className, ...props }: Primitive.Image.Props) {
  return (
    <Primitive.Image
      data-slot="avatar-image"
      {...props}
      className={(state) =>
        [stylex.props(style.image).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AvatarFallback({ className, ...props }: Primitive.Fallback.Props) {
  return (
    <Primitive.Fallback
      data-slot="avatar-fallback"
      {...props}
      className={(state) =>
        [stylex.props(style.fallback).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      {...props}
      className={[stylex.props(style.badge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AvatarGroupCount({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      {...props}
      className={[stylex.props(style.count).className, className].filter(Boolean).join(" ")}
    />
  )
}
