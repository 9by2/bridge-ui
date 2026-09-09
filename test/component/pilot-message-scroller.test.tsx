import { useMessageScroller as original } from "@shadcn/react/message-scroller"
import { renderToString } from "react-dom/server"
import { expect, test } from "vitest"

import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller
} from "../../app/component/brand/stylex/message-scroller"

test("message scroller retains engine hook identity and server composition", () => {
  expect(
    renderToString(
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerButton direction="start" />
        </MessageScroller>
      </MessageScrollerProvider>
    )
  ).toContain("Scroll to start")
  expect(
    renderToString(
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerButton direction="start" render={<button />}>
            Start
          </MessageScrollerButton>
        </MessageScroller>
      </MessageScrollerProvider>
    )
  ).toContain("Start")
  expect(useMessageScroller).toBe(original)
  const html = renderToString(
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent>
            <MessageScrollerItem>Message</MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
  expect(html).toContain('data-slot="message-scroller"')
  expect(html).toContain("Message")
})
