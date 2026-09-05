import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.TooltipProvider>
      <UI.Tooltip>
        <UI.TooltipTrigger render={<UI.Button />}>Hover me</UI.TooltipTrigger>
        <UI.TooltipContent>Helpful detail</UI.TooltipContent>
      </UI.Tooltip>
    </UI.TooltipProvider>
  )
}
