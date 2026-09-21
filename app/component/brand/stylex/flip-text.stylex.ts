import * as stylex from "@stylexjs/stylex"

const flip = stylex.keyframes({
  from: { opacity: 1, transform: "rotateX(0deg)" },
  "40%, 60%": { opacity: 0, transform: "rotateX(-90deg)" },
  to: { opacity: 1, transform: "rotateX(0deg)" }
})

export const flipTextStyle = stylex.create({
  root: { display: "inline-block", lineHeight: 1, perspective: "1000px" },
  word: { display: "inline-block", whiteSpace: "nowrap", transformStyle: "preserve-3d" },
  character: {
    position: "relative",
    display: "inline-block",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    animationName: flip,
    animationDuration: { default: "var(--flip-duration)", "@media (prefers-reduced-motion: reduce)": "0s" },
    animationDelay: "var(--flip-delay)",
    animationIterationCount: "var(--flip-iteration)",
    animationTimingFunction: "ease-in-out",
    animationFillMode: "both"
  },
  separator: { display: "inline-block" },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0
  }
})
