import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { BoldIcon, ItalicIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

function DocMenu() {
  return (
    <UI.NavigationMenu>
      <UI.NavigationMenuList>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuTrigger>Guide</UI.NavigationMenuTrigger>
          <UI.NavigationMenuContent>
            <div className="grid w-72 gap-1 p-2">
              <UI.NavigationMenuLink href="#getting-started">Getting started</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#sso">Single sign-on</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#billing">Billing and invoice</UI.NavigationMenuLink>
            </div>
          </UI.NavigationMenuContent>
        </UI.NavigationMenuItem>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuLink href="#changelog">Changelog</UI.NavigationMenuLink>
        </UI.NavigationMenuItem>
      </UI.NavigationMenuList>
    </UI.NavigationMenu>
  )
}

function Editor() {
  const [preview, setPreview] = useState(false)
  return (
    <div className="grid grid-cols-1 gap-2">
      <UI.Menubar>
        <UI.MenubarMenu>
          <UI.MenubarTrigger>Insert</UI.MenubarTrigger>
          <UI.MenubarContent>
            <UI.MenubarGroup>
              <UI.MenubarItem>Screenshot</UI.MenubarItem>
              <UI.MenubarItem>Log excerpt</UI.MenubarItem>
            </UI.MenubarGroup>
          </UI.MenubarContent>
        </UI.MenubarMenu>
        <UI.MenubarMenu>
          <UI.MenubarTrigger>View</UI.MenubarTrigger>
          <UI.MenubarContent>
            <UI.MenubarCheckboxItem checked={preview} onCheckedChange={setPreview}>
              Preview
            </UI.MenubarCheckboxItem>
          </UI.MenubarContent>
        </UI.MenubarMenu>
      </UI.Menubar>
      <div className="flex gap-1">
        <UI.Toggle aria-label="Bold">
          <BoldIcon aria-hidden="true" />
        </UI.Toggle>
        <UI.Toggle aria-label="Italic">
          <ItalicIcon aria-hidden="true" />
        </UI.Toggle>
      </div>
      <UI.Textarea aria-label="Describe your issue" placeholder="Describe your issue" />
    </div>
  )
}

export function HelpPage() {
  usePageAction(<DocMenu />)
  return (
    <UI.Page width={UI.PageWidth.form}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Help center</UI.PageTitle>
          <UI.PageDescription>
            Press{" "}
            <UI.KbdGroup>
              <UI.Kbd>⌘</UI.Kbd>
              <UI.Kbd>K</UI.Kbd>
            </UI.KbdGroup>{" "}
            anywhere to search.
          </UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8">
          <article className="grid grid-cols-1 gap-4">
            <UI.Heading as={UI.WAIHeading.H2}>Configure single sign-on</UI.Heading>
            <UI.Lead>Connect Okta, Azure AD or Google Workspace in under ten minute.</UI.Lead>
            <UI.Body>
              Open{" "}
              <UI.HoverCard>
                <UI.HoverCardTrigger render={<a href="#workspace-security">Workspace › Security</a>} />
                <UI.HoverCardContent>Only an owner or admin can change SSO.</UI.HoverCardContent>
              </UI.HoverCard>{" "}
              and paste your IdP metadata URL. The ACS URL is <UI.InlineCode>https://acme.io/sso/acs</UI.InlineCode>.
            </UI.Body>
            <UI.List ordered>
              <li>Create a SAML app in your IdP.</li>
              <li>Copy the metadata URL.</li>
              <li>Paste it in Acme and test the connection.</li>
            </UI.List>
            <UI.Blockquote>
              SSO takes effect for new session only. Existing session stay valid until expiry.
            </UI.Blockquote>
            <UI.Marker>
              <UI.MarkerIcon>i</UI.MarkerIcon>
              <UI.MarkerContent>Last updated 12 Sep 2026</UI.MarkerContent>
            </UI.Marker>
            <div className="flex items-center gap-3">
              <UI.Small>Was this helpful?</UI.Small>
              <UI.ButtonGroup aria-label="Feedback">
                <UI.Button variant="outline" size="icon-sm" aria-label="Yes" onClick={() => notify.success("Thanks!")}>
                  <ThumbsUpIcon aria-hidden="true" />
                </UI.Button>
                <UI.ButtonGroupSeparator />
                <UI.Button variant="outline" size="icon-sm" aria-label="No">
                  <ThumbsDownIcon aria-hidden="true" />
                </UI.Button>
              </UI.ButtonGroup>
            </div>
          </article>
          <UI.Separator />
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Contact support</UI.CardTitle>
              <UI.CardDescription>Average first response: 2 hour.</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <Editor />
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Button onClick={() => notify.success("Ticket T-1043 created")}>Submit</UI.Button>
            </UI.CardFooter>
          </UI.Card>
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Getting started</UI.CardTitle>
            </UI.CardHeader>
            <UI.CardContent>
              <div className="grid grid-cols-1 gap-4">
                <UI.VideoPlayer
                  embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
                  title="Workspace tour"
                  playLabel="Play Workspace tour"
                  poster={<UI.VideoThumbnail src="https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" alt="" />}
                />
                <UI.RichContent
                  variant="compact"
                  emptyFallback="No notes yet."
                  content={[
                    { type: "paragraph", children: [{ type: "text", text: "Watch the tour, then invite your team." }] },
                    {
                      type: "list",
                      ordered: false,
                      items: [
                        [{ type: "text", text: "Create a workspace" }],
                        [{ type: "text", text: "bun add @bridge/ui", code: true, copyable: true }]
                      ]
                    }
                  ]}
                />
              </div>
            </UI.CardContent>
          </UI.Card>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
