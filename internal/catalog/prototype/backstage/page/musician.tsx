import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { PrototypeMedia } from "@catalog-prototype/shared/support"
import { MicVocalIcon, PlusIcon } from "lucide-react"
import { useState, type FormEvent } from "react"

import * as UI from "@bridge/ui"

const musician = [
  { id: "m-1", name: "Polycat", initial: "PC", genre: "pop", member: 3, label: "Smallroom" },
  { id: "m-2", name: "ลำไย ไหทองคำ", initial: "ลย", genre: "luk-thung", member: 1, label: "Independent" },
  { id: "m-3", name: "Numb Heart", initial: "NH", genre: "indie", member: 4, label: "What The Duck" },
  { id: "m-4", name: "Slot Machine", initial: "SM", genre: "rock", member: 4, label: "Genie Records" },
  { id: "m-5", name: "YOUNGOHM", initial: "YO", genre: "hip-hop", member: 1, label: "Rap Is Now" },
  { id: "m-6", name: "Tilly Birds", initial: "TB", genre: "pop", member: 3, label: "Gene Lab" }
] as const
const genre = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "indie", label: "Indie" },
  { value: "luk-thung", label: "Luk thung" },
  { value: "hip-hop", label: "Hip-hop" }
] as const

function AddMusicianDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const invalid = submitted && name.trim() === ""
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (name.trim() === "") return
    setOpen(false)
    notify.success(`${name} added`, "Mapping job queued")
  }
  return (
    <UI.Dialog open={open} onOpenChange={setOpen}>
      <UI.DialogTrigger render={<UI.Button />}>
        <PlusIcon aria-hidden="true" />
        Add musician
      </UI.DialogTrigger>
      <UI.DialogContent>
        <form onSubmit={submit} noValidate>
          <UI.DialogHeader>
            <UI.DialogIcon>
              <MicVocalIcon aria-hidden="true" />
            </UI.DialogIcon>
            <UI.DialogTitle>Add musician</UI.DialogTitle>
            <UI.DialogDescription>Link a Backstage artist ID to a new roster profile.</UI.DialogDescription>
          </UI.DialogHeader>
          <UI.FieldGroup>
            <UI.Field data-invalid={invalid}>
              <UI.FieldLabel htmlFor="musician-name">Stage name</UI.FieldLabel>
              <UI.Input
                id="musician-name"
                aria-invalid={invalid}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {invalid ? <UI.FieldError>Stage name is required.</UI.FieldError> : null}
            </UI.Field>
            <UI.Field>
              <UI.FieldLabel htmlFor="musician-genre">Genre</UI.FieldLabel>
              <UI.NativeSelect id="musician-genre" defaultValue="pop">
                {genre.map((item) => (
                  <UI.NativeSelectOption key={item.value} value={item.value}>
                    {item.label}
                  </UI.NativeSelectOption>
                ))}
              </UI.NativeSelect>
            </UI.Field>
            <UI.Field>
              <UI.FieldLabel htmlFor="backstage-id">Backstage artist ID</UI.FieldLabel>
              <UI.FieldDescription>Six character code from the distributor portal.</UI.FieldDescription>
              <UI.InputOTP id="backstage-id" maxLength={6}>
                <UI.InputOTPGroup>
                  <UI.InputOTPSlot index={0} />
                  <UI.InputOTPSlot index={1} />
                  <UI.InputOTPSlot index={2} />
                </UI.InputOTPGroup>
                <UI.InputOTPSeparator />
                <UI.InputOTPGroup>
                  <UI.InputOTPSlot index={3} />
                  <UI.InputOTPSlot index={4} />
                  <UI.InputOTPSlot index={5} />
                </UI.InputOTPGroup>
              </UI.InputOTP>
            </UI.Field>
          </UI.FieldGroup>
          <UI.DialogFooter>
            <UI.DialogClose render={<UI.Button variant="outline" />}>Cancel</UI.DialogClose>
            <UI.Button type="submit">Add</UI.Button>
          </UI.DialogFooter>
        </form>
      </UI.DialogContent>
    </UI.Dialog>
  )
}

function RosterCard({ item }: { item: (typeof musician)[number] }) {
  return (
    <UI.Card>
      <UI.AspectRatio ratio={16 / 9}>
        <UI.ResponsiveImage alt={`${item.name} cover`} src={PrototypeMedia.IMAGE} />
      </UI.AspectRatio>
      <UI.CardHeader>
        <UI.CardTitle>{item.name}</UI.CardTitle>
        <UI.CardDescription>{item.label}</UI.CardDescription>
        <UI.CardAction>
          <UI.Badge variant="secondary">{genre.find((entry) => entry.value === item.genre)?.label}</UI.Badge>
        </UI.CardAction>
      </UI.CardHeader>
      <UI.CardContent>
        <UI.AvatarGroup>
          {Array.from({ length: Math.min(item.member, 3) }, (_, index) => (
            <UI.Avatar key={`${item.id}-${index}`} size="sm">
              <UI.AvatarFallback>{item.initial}</UI.AvatarFallback>
            </UI.Avatar>
          ))}
          {item.member > 3 ? <UI.AvatarGroupCount>+{item.member - 3}</UI.AvatarGroupCount> : null}
        </UI.AvatarGroup>
      </UI.CardContent>
    </UI.Card>
  )
}

export function MusicianPage() {
  const [filter, setFilter] = useState<string[]>([])
  usePageAction(<AddMusicianDialog />)
  const visible = filter.length === 0 ? musician : musician.filter((item) => filter.includes(item.genre))
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Musician</UI.PageTitle>
          <UI.PageDescription>Roster mapped to Backstage artist ID.</UI.PageDescription>
        </UI.PageHeading>
        <UI.PageFilter aria-label="Musician filter">
          <UI.MultiSelect values={filter} onValuesChange={setFilter}>
            <UI.MultiSelectTrigger aria-label="Filter genre">
              <UI.MultiSelectValue placeholder="All genre" />
            </UI.MultiSelectTrigger>
            <UI.MultiSelectContent>
              <UI.MultiSelectGroup>
                {genre.map((item) => (
                  <UI.MultiSelectItem key={item.value} value={item.value}>
                    {item.label}
                  </UI.MultiSelectItem>
                ))}
              </UI.MultiSelectGroup>
            </UI.MultiSelectContent>
          </UI.MultiSelect>
        </UI.PageFilter>
      </UI.PageHeader>
      <UI.PageContent>
        {visible.length === 0 ? (
          <UI.Empty variant="outline">
            <UI.EmptyHeader>
              <UI.EmptyMedia variant="icon">
                <MicVocalIcon aria-hidden="true" />
              </UI.EmptyMedia>
              <UI.EmptyTitle>No musician</UI.EmptyTitle>
              <UI.EmptyDescription>No roster match the selected genre.</UI.EmptyDescription>
            </UI.EmptyHeader>
            <UI.EmptyContent>
              <UI.Button variant="outline" onClick={() => setFilter([])}>
                Clear filter
              </UI.Button>
            </UI.EmptyContent>
          </UI.Empty>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <RosterCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </UI.PageContent>
    </UI.Page>
  )
}
