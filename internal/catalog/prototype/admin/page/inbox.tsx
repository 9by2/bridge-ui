import { notify } from "@catalog-prototype/shared/console-shell"
import { ArchiveIcon, SendIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

const ticket = [
  {
    id: "T-1042",
    from: "Globex",
    initial: "GX",
    subject: "SSO login loop after IdP change",
    priority: "destructive",
    unread: true
  },
  {
    id: "T-1039",
    from: "Initech",
    initial: "IN",
    subject: "Invoice currency should be EUR",
    priority: "warning",
    unread: true
  },
  {
    id: "T-1033",
    from: "Umbrella",
    initial: "UM",
    subject: "How to export audit log?",
    priority: "info",
    unread: false
  }
] as const
const reply = [
  {
    id: "r1",
    own: false,
    author: "Globex IT",
    initial: "GX",
    body: "Since we switched IdP, every login redirects back to the sign-in page.",
    time: "08:02"
  },
  {
    id: "r2",
    own: true,
    author: "You",
    initial: "AK",
    body: "Thanks. Could you confirm the new ACS URL in your IdP?",
    time: "08:10"
  },
  {
    id: "r3",
    own: false,
    author: "Globex IT",
    initial: "GX",
    body: "It is https://acme.io/sso/acs — same as before.",
    time: "08:14"
  },
  {
    id: "r4",
    own: true,
    author: "You",
    initial: "AK",
    body: "Found it: the entity ID changed. I have updated it on our side.",
    time: "08:20"
  }
] as const

function Thread({ id }: { id: string }) {
  const [draft, setDraft] = useState("")
  const current = ticket.find((item) => item.id === id) ?? ticket[0]
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid gap-1 p-4">
        <UI.Heading as={UI.WAIHeading.H2}>{current.subject}</UI.Heading>
        <UI.Muted>
          {current.id} · {current.from}
        </UI.Muted>
      </div>
      <UI.Separator />
      <UI.MessageScrollerProvider>
        <div className="min-h-0 flex-1">
          <UI.MessageScroller>
            <UI.MessageScrollerViewport>
              <UI.MessageScrollerContent>
                <UI.MessageGroup>
                  {reply.map((item) => (
                    <UI.MessageScrollerItem key={item.id}>
                      <UI.Message align={item.own ? "end" : "start"}>
                        <UI.MessageAvatar>{item.initial}</UI.MessageAvatar>
                        <UI.MessageContent>
                          <UI.MessageHeader>{item.author}</UI.MessageHeader>
                          <UI.BubbleGroup>
                            <UI.Bubble align={item.own ? "end" : "start"} variant={item.own ? "default" : "muted"}>
                              <UI.BubbleContent>{item.body}</UI.BubbleContent>
                            </UI.Bubble>
                          </UI.BubbleGroup>
                          <UI.MessageFooter>{item.time}</UI.MessageFooter>
                        </UI.MessageContent>
                      </UI.Message>
                    </UI.MessageScrollerItem>
                  ))}
                </UI.MessageGroup>
              </UI.MessageScrollerContent>
            </UI.MessageScrollerViewport>
            <UI.MessageScrollerButton />
          </UI.MessageScroller>
        </div>
      </UI.MessageScrollerProvider>
      <form
        className="grid gap-2 p-4"
        onSubmit={(event) => {
          event.preventDefault()
          setDraft("")
          notify.success("Reply sent")
        }}>
        <UI.Label htmlFor="reply">Reply</UI.Label>
        <UI.Textarea id="reply" value={draft} onChange={(event) => setDraft(event.target.value)} />
        <div className="flex justify-end gap-2">
          <UI.Button type="button" variant="outline" onClick={() => notify.info("Ticket archived")}>
            <ArchiveIcon aria-hidden="true" />
            Archive
          </UI.Button>
          <UI.Button type="submit">
            <SendIcon aria-hidden="true" />
            Send
          </UI.Button>
        </div>
      </form>
    </div>
  )
}

export function InboxPage() {
  const [active, setActive] = useState<string>(ticket[0].id)
  return (
    <UI.Page width={UI.PageWidth.editor} density={UI.PageDensity.none}>
      <UI.PageContent>
        <div className="h-[calc(100svh-4rem)] min-h-[32rem]">
          <UI.ResizablePanelGroup orientation="horizontal">
            <UI.ResizablePanel defaultSize={34} minSize={22}>
              <UI.ScrollArea>
                <div className="grid gap-1 p-2">
                  {ticket.map((item) => (
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
                        <UI.ItemHeader>
                          <UI.ItemTitle>{item.from}</UI.ItemTitle>
                          {item.unread ? <UI.Badge variant={item.priority}>new</UI.Badge> : null}
                        </UI.ItemHeader>
                        <UI.ItemDescription>{item.subject}</UI.ItemDescription>
                      </UI.ItemContent>
                    </UI.Item>
                  ))}
                </div>
              </UI.ScrollArea>
            </UI.ResizablePanel>
            <UI.ResizableHandle withHandle />
            <UI.ResizablePanel defaultSize={66}>
              <Thread key={active} id={active} />
            </UI.ResizablePanel>
          </UI.ResizablePanelGroup>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
