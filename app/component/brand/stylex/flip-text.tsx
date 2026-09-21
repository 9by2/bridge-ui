import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, CSSProperties } from "react"

const flip = stylex.keyframes({
  from: { opacity: 1, transform: "rotateX(0deg)" },
  "40%, 60%": { opacity: 0, transform: "rotateX(-90deg)" },
  to: { opacity: 1, transform: "rotateX(0deg)" }
})

const style = stylex.create({
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

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
const grapheme = (value: string) => {
  const result: Intl.SegmentData[] = []
  for (const entry of segmenter.segment(value)) result.push(entry)
  return result
}

export type FlipTextProps = Omit<ComponentProps<"span">, "children"> & {
  children: string
  delay?: number
  duration?: number
  loop?: boolean
  separator?: string
  together?: boolean
}

type CharacterStyle = CSSProperties & Record<`--${string}`, string>

export function FlipText({
  children,
  className: callerClassName = "",
  delay = 0,
  duration = 2.2,
  loop = true,
  separator = " ",
  together = false,
  ...prop
}: FlipTextProps) {
  const word = children.split(separator)
  const characterAmount = word.reduce((amount, value) => amount + grapheme(value).length, 0)
  let characterIndex = 0

  return (
    <span data-slot="flip-text" {...prop} className={`${stylex.props(style.root).className} ${callerClassName}`}>
      <span {...stylex.props(style.hidden)}>{children}</span>
      <span aria-hidden="true">
        {word.map((value, wordIndex) => {
          const character = grapheme(value)
          return (
            <span key={`${value}-${wordIndex}`} {...stylex.props(style.word)}>
              {character.map((characterValue, index) => {
                const normalizedIndex = characterAmount === 0 ? 0 : characterIndex / characterAmount
                const calculatedDelay = together
                  ? delay
                  : Math.sin(normalizedIndex * (Math.PI / 2)) * (duration * 0.25) + delay
                const characterStyle: CharacterStyle = {
                  "--flip-duration": `${duration}s`,
                  "--flip-delay": `${calculatedDelay}s`,
                  "--flip-iteration": loop ? "infinite" : "1"
                }
                characterIndex += 1

                return (
                  <span
                    key={`${characterValue.segment}-${index}`}
                    data-slot="flip-text-character"
                    data-character={characterValue.segment}
                    style={characterStyle}
                    className={stylex.props(style.character).className}>
                    {characterValue.segment}
                  </span>
                )
              })}
              {wordIndex < word.length - 1 ? <span {...stylex.props(style.separator)}>{separator}</span> : null}
            </span>
          )
        })}
      </span>
    </span>
  )
}
