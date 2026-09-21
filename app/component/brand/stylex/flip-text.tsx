import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, CSSProperties } from "react"

import { segmentGrapheme } from "../stylex-support/grapheme"

import { flipTextStyle as style } from "./flip-text.stylex"

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
  const characterAmount = word.reduce((amount, value) => amount + segmentGrapheme(value).length, 0)
  const staggerDenominator = Math.max(1, characterAmount)
  let characterIndex = 0

  return (
    <span data-slot="flip-text" {...prop} className={`${stylex.props(style.root).className} ${callerClassName}`}>
      <span className={stylex.props(style.hidden).className}>{children}</span>
      <span aria-hidden="true">
        {word.map((value, wordIndex) => {
          const character = segmentGrapheme(value)
          return (
            <span key={`${value}-${wordIndex}`} {...stylex.props(style.word)}>
              {character.map((characterValue, index) => {
                const normalizedIndex = characterIndex / staggerDenominator
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
