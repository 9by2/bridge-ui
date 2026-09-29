import { PaperclipIcon, SendIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

type Chat = { id: string; author: string; initial: string; body: string; time: string; own: boolean }
const thread = [
  { id: "promoter", name: "Impact Arena promoter", initial: "IA", preview: "Load-in moved to 13:00", unread: 2 },
  { id: "polycat", name: "Polycat manager", initial: "PC", preview: "Rider v3 attached", unread: 0 },
  { id: "label", name: "Smallroom label", initial: "SR", preview: "Statement for August", unread: 1 }
] as const
const initialChat: Chat[] = [
  {
    id: "1",
    author: "Impact Arena",
    initial: "IA",
    body: "Hi Nara, load-in moved to 13:00 on show day.",
    time: "09:12",
    own: false
  },
  {
    id: "2",
    author: "You",
    initial: "NW",
    body: "Noted. Does the sound check stay at 15:00?",
    time: "09:14",
    own: true
  },
  {
    id: "3",
    author: "Impact Arena",
    initial: "IA",
    body: "Yes, 15:00 – 16:30. Gate open 17:30.",
    time: "09:15",
    own: false
  },
  { id: "4", author: "You", initial: "NW", body: "ขอบคุณครับ จะแจ้งทีมงานให้ครับ", time: "09:16", own: true },
  {
    id: "5",
    author: "Impact Arena",
    initial: "IA",
    body: "Parking pass for 3 truck is ready at the north gate.",
    time: "09:20",
    own: false
  },
  { id: "6", author: "You", initial: "NW", body: "Great, sending the crew list now.", time: "09:21", own: true }
]

function Conversation() {
  const [chat, setChat] = useState(initialChat)
  const [draft, setDraft] = useState("")
  const send = () => {
    if (draft.trim() === "") return
    setChat((value) => [
      ...value,
      { id: String(value.length + 1), author: "You", initial: "NW", body: draft, time: "now", own: true }
    ])
    setDraft("")
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <UI.MessageScrollerProvider>
        <div className="min-h-0 flex-1">
          <UI.MessageScroller>
            <UI.MessageScrollerViewport>
              <UI.MessageScrollerContent>
                <UI.Marker variant="separator">
                  <UI.MarkerContent>Today</UI.MarkerContent>
                </UI.Marker>
                {chat.map((item) => (
                  <UI.MessageScrollerItem key={item.id}>
                    <UI.Message align={item.own ? "end" : "start"}>
                      <UI.MessageAvatar>{item.initial}</UI.MessageAvatar>
                      <UI.MessageContent>
                        <UI.MessageHeader>{item.author}</UI.MessageHeader>
                        <UI.Bubble align={item.own ? "end" : "start"} variant={item.own ? "default" : "secondary"}>
                          <UI.BubbleContent>{item.body}</UI.BubbleContent>
                          {item.id === "3" ? <UI.BubbleReactions>👍</UI.BubbleReactions> : null}
                        </UI.Bubble>
                        <UI.MessageFooter>{item.time}</UI.MessageFooter>
                      </UI.MessageContent>
                    </UI.Message>
                  </UI.MessageScrollerItem>
                ))}
              </UI.MessageScrollerContent>
            </UI.MessageScrollerViewport>
            <UI.MessageScrollerButton />
          </UI.MessageScroller>
        </div>
      </UI.MessageScrollerProvider>
      <form
        className="p-3"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}>
        <UI.InputGroup>
          <UI.InputGroupTextarea
            aria-label="Message"
            placeholder="Write a message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <UI.InputGroupAddon align="block-end">
            <UI.InputGroupButton size="icon-xs" aria-label="Attach file">
              <PaperclipIcon aria-hidden="true" />
            </UI.InputGroupButton>
            <UI.InputGroupButton type="submit" variant="default" size="sm">
              <SendIcon aria-hidden="true" />
              Send
            </UI.InputGroupButton>
          </UI.InputGroupAddon>
        </UI.InputGroup>
      </form>
    </div>
  )
}

export function MessagePage() {
  const [active, setActive] = useState<string>(thread[0].id)
  return (
    <UI.Page width={UI.PageWidth.editor} density={UI.PageDensity.none}>
      <UI.PageContent>
        <div className="h-[calc(100svh-4rem)] min-h-[32rem]">
          <UI.ResizablePanelGroup orientation="horizontal">
            <UI.ResizablePanel defaultSize={32} minSize={20}>
              <div className="grid content-start gap-2 p-3">
                <UI.Input aria-label="Search conversation" placeholder="Search conversation" />
                <UI.ItemGroup>
                  {thread.map((item) => (
                    <UI.Item
                      key={item.id}
                      variant={item.id === active ? "muted" : "default"}
                      render={<button type="button" onClick={() => setActive(item.id)} />}>
                      <UI.ItemMedia>
                        <UI.Avatar>
                          <UI.AvatarFallback>{item.initial}</UI.AvatarFallback>
                        </UI.Avatar>
                      </UI.ItemMedia>
                      <UI.ItemContent>
                        <UI.ItemTitle>{item.name}</UI.ItemTitle>
                        <UI.ItemDescription>{item.preview}</UI.ItemDescription>
                      </UI.ItemContent>
                      {item.unread > 0 ? (
                        <UI.ItemActions>
                          <UI.Badge>{item.unread}</UI.Badge>
                        </UI.ItemActions>
                      ) : null}
                    </UI.Item>
                  ))}
                </UI.ItemGroup>
              </div>
            </UI.ResizablePanel>
            <UI.ResizableHandle withHandle />
            <UI.ResizablePanel defaultSize={68}>
              <Conversation key={active} />
            </UI.ResizablePanel>
          </UI.ResizablePanelGroup>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
