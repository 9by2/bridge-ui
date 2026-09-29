import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { PrototypeMedia } from "@catalog-prototype/shared/support"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

function EditorMenu() {
  const [ruler, setRuler] = useState(true)
  return (
    <UI.Menubar>
      <UI.MenubarMenu>
        <UI.MenubarTrigger>File</UI.MenubarTrigger>
        <UI.MenubarContent>
          <UI.MenubarItem onClick={() => notify.info("Draft saved")}>
            Save draft
            <UI.MenubarShortcut>⌘S</UI.MenubarShortcut>
          </UI.MenubarItem>
          <UI.MenubarItem>Duplicate banner</UI.MenubarItem>
          <UI.MenubarSeparator />
          <UI.MenubarSub>
            <UI.MenubarSubTrigger>Export</UI.MenubarSubTrigger>
            <UI.MenubarSubContent>
              <UI.MenubarItem>PNG</UI.MenubarItem>
              <UI.MenubarItem>WebP</UI.MenubarItem>
            </UI.MenubarSubContent>
          </UI.MenubarSub>
        </UI.MenubarContent>
      </UI.MenubarMenu>
      <UI.MenubarMenu>
        <UI.MenubarTrigger>View</UI.MenubarTrigger>
        <UI.MenubarContent>
          <UI.MenubarCheckboxItem checked={ruler} onCheckedChange={setRuler}>
            Show safe area
          </UI.MenubarCheckboxItem>
          <UI.MenubarRadioGroup defaultValue="desktop">
            <UI.MenubarLabel>Preview</UI.MenubarLabel>
            <UI.MenubarRadioItem value="desktop">Desktop</UI.MenubarRadioItem>
            <UI.MenubarRadioItem value="mobile">Mobile</UI.MenubarRadioItem>
          </UI.MenubarRadioGroup>
        </UI.MenubarContent>
      </UI.MenubarMenu>
    </UI.Menubar>
  )
}

function Placement() {
  return (
    <UI.NavigationMenu>
      <UI.NavigationMenuList>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuTrigger>Placement</UI.NavigationMenuTrigger>
          <UI.NavigationMenuContent>
            <div className="grid w-72 gap-1 p-2">
              <UI.NavigationMenuLink href="#home-hero">Home hero</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#event-strip">Event strip</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#checkout">Checkout upsell</UI.NavigationMenuLink>
            </div>
          </UI.NavigationMenuContent>
        </UI.NavigationMenuItem>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuLink href="#guideline">Brand guideline</UI.NavigationMenuLink>
        </UI.NavigationMenuItem>
      </UI.NavigationMenuList>
    </UI.NavigationMenu>
  )
}

function BannerForm() {
  const [schedule, setSchedule] = useState("now")
  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={(event) => event.preventDefault()}>
      <UI.FieldSet>
        <UI.FieldLegend>Copy</UI.FieldLegend>
        <UI.FieldGroup>
          <UI.Field>
            <UI.FieldLabel htmlFor="banner-title">Headline</UI.FieldLabel>
            <UI.Input id="banner-title" defaultValue="Polycat Live in Bangkok" />
          </UI.Field>
          <UI.Field>
            <UI.FieldLabel htmlFor="banner-body">Body</UI.FieldLabel>
            <UI.ToggleGroup aria-label="Text style" multiple>
              <UI.ToggleGroupItem value="bold" aria-label="Bold">
                <BoldIcon aria-hidden="true" />
              </UI.ToggleGroupItem>
              <UI.ToggleGroupItem value="italic" aria-label="Italic">
                <ItalicIcon aria-hidden="true" />
              </UI.ToggleGroupItem>
            </UI.ToggleGroup>
            <UI.Textarea id="banner-body" defaultValue="บัตรรอบสุดท้าย เปิดขาย 1 ตุลาคม เวลา 10:00 น." />
          </UI.Field>
        </UI.FieldGroup>
      </UI.FieldSet>
      <UI.FieldSeparator />
      <UI.FieldSet>
        <UI.FieldLegend>Style</UI.FieldLegend>
        <UI.Field>
          <UI.Label id="banner-background">Background</UI.Label>
          <UI.ColorPicker mode="gradient" kind="linear" aria-labelledby="banner-background" defaultValue="electric" />
        </UI.Field>
        <UI.Field>
          <UI.FieldLabel htmlFor="banner-overlay">Overlay opacity</UI.FieldLabel>
          <UI.Slider id="banner-overlay" defaultValue={[40]} aria-label="Overlay opacity" />
        </UI.Field>
        <UI.Field orientation="horizontal">
          <UI.Toggle aria-label="Underline call to action">
            <UnderlineIcon aria-hidden="true" />
          </UI.Toggle>
          <UI.FieldContent>
            <UI.FieldTitle>Underline call to action</UI.FieldTitle>
            <UI.FieldDescription>Improves link affordance on image background.</UI.FieldDescription>
          </UI.FieldContent>
        </UI.Field>
      </UI.FieldSet>
      <UI.FieldSeparator />
      <UI.FieldSet>
        <UI.FieldLegend>Schedule</UI.FieldLegend>
        <UI.RadioGroup value={schedule} onValueChange={(value) => setSchedule(String(value))}>
          <UI.Field orientation="horizontal">
            <UI.RadioGroupItem id="schedule-now" value="now" />
            <UI.FieldLabel htmlFor="schedule-now">Publish now</UI.FieldLabel>
          </UI.Field>
          <UI.Field orientation="horizontal">
            <UI.RadioGroupItem id="schedule-later" value="later" />
            <UI.FieldLabel htmlFor="schedule-later">Schedule for 1 Oct 2026, 10:00</UI.FieldLabel>
          </UI.Field>
        </UI.RadioGroup>
        <UI.Field orientation="horizontal">
          <UI.Checkbox id="banner-mobile" defaultChecked />
          <UI.FieldLabel htmlFor="banner-mobile">Also show on mobile app</UI.FieldLabel>
        </UI.Field>
      </UI.FieldSet>
      <UI.PageFormAction sticky>
        <UI.Button variant="outline" type="button">
          Discard
        </UI.Button>
        <UI.Button type="submit" onClick={() => notify.success("Banner published")}>
          Publish
        </UI.Button>
      </UI.PageFormAction>
    </form>
  )
}

function AudienceSurvey() {
  return (
    <UI.Questionnaire
      onSubmit={(event) => {
        event.preventDefault()
        notify.success("Survey saved")
      }}>
      <UI.QuestionnaireProgress />
      <UI.QuestionnaireItem name="goal" required>
        <UI.QuestionnaireTitle>What is the banner goal?</UI.QuestionnaireTitle>
        <UI.QuestionnaireDescription>Used to pick the default call to action.</UI.QuestionnaireDescription>
        <UI.QuestionnaireChoices>
          <UI.QuestionnaireChoice value="sale">Ticket sale</UI.QuestionnaireChoice>
          <UI.QuestionnaireChoice value="awareness">Awareness</UI.QuestionnaireChoice>
          <UI.QuestionnaireChoice value="merch">Merchandise</UI.QuestionnaireChoice>
        </UI.QuestionnaireChoices>
      </UI.QuestionnaireItem>
      <UI.QuestionnaireItem name="audience">
        <UI.QuestionnaireTitle>Who is the audience?</UI.QuestionnaireTitle>
        <UI.QuestionnaireInput placeholder="e.g. Bangkok, 18–30" />
      </UI.QuestionnaireItem>
      <UI.QuestionnaireActions>
        <UI.QuestionnairePrevious />
        <UI.QuestionnaireNext />
        <UI.QuestionnaireSubmit />
      </UI.QuestionnaireActions>
    </UI.Questionnaire>
  )
}

export function ContentPage() {
  usePageAction(<EditorMenu />)
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Marketing</UI.PageEyebrow>
          <UI.PageTitle>Web banner</UI.PageTitle>
        </UI.PageHeading>
        <UI.PageAction>
          <Placement />
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <BannerForm />
          <div className="grid grid-cols-1 content-start gap-6">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Preview</UI.CardTitle>
                <UI.CardDescription>WebGL refracted glass hero; a static image is the fallback.</UI.CardDescription>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.FractalGlass imageSrc={PrototypeMedia.IMAGE} label="Polycat banner preview" />
              </UI.CardContent>
            </UI.Card>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Brief</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <AudienceSurvey />
              </UI.CardContent>
            </UI.Card>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Teaser</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <UI.VideoPlayer
                    embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
                    title="Polycat teaser"
                    playLabel="Play Polycat teaser"
                    poster={<UI.VideoThumbnail src="https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" alt="" />}
                  />
                  <UI.RichContent
                    variant="compact"
                    emptyFallback="No notes yet."
                    content={[
                      {
                        type: "paragraph",
                        children: [{ type: "text", text: "Pin the teaser under the hero on the event page." }]
                      },
                      {
                        type: "list",
                        ordered: false,
                        items: [
                          [{ type: "text", text: "Autoplay stays off" }],
                          [{ type: "text", text: "polycat-2026-teaser", code: true, copyable: true }]
                        ]
                      }
                    ]}
                  />
                </div>
              </UI.CardContent>
            </UI.Card>
            <div className="grid grid-cols-1 gap-2">
              <UI.Lead>Guideline</UI.Lead>
              <UI.Body>Keep headline under 40 character. ใช้ภาษาไทยเป็นหลัก และใส่ภาษาอังกฤษเฉพาะชื่อศิลปินหรือชื่องาน</UI.Body>
            </div>
          </div>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
