import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { BubbleGroup, Bubble, BubbleContent, BubbleReactions } from "../../internal/pilot/bubble"
import {
  Message,
  MessageGroup,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter
} from "../../internal/pilot/message"

afterEach(cleanup)
test("message and bubble preserve composition and rendered link", () => {
  for (const variant of [
    undefined,
    null,
    "default",
    "secondary",
    "muted",
    "tinted",
    "outline",
    "ghost",
    "destructive"
  ] as const) {
    const { unmount } = render(
      <MessageGroup>
        <Message align="end">
          <MessageAvatar>AB</MessageAvatar>
          <MessageContent>
            <MessageHeader>Name</MessageHeader>
            <BubbleGroup>
              <Bubble variant={variant} align="end">
                <BubbleContent render={<a href="#message" />}>Message</BubbleContent>
                <BubbleReactions>Reaction</BubbleReactions>
              </Bubble>
            </BubbleGroup>
            <MessageFooter>Time</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
    )
    expect(screen.getByRole("link").getAttribute("href")).toBe("#message")
    unmount()
  }
})
