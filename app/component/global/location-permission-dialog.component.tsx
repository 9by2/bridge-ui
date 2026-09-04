import {
  Dialog,
  DialogClose,
  DialogIcon,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@bridge/ui/app/component/shadcn/dialog"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import type { Locale } from "@cue/web/shared/i18n/runtime/runtime.js"
import { LocateFixedIcon } from "lucide-react"

import { Button } from "../shadcn/button"

export interface LocationPermissionDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onAllow: () => void
  readonly onCancel: () => void
  readonly locale?: Locale | undefined
}

export function LocationPermissionDialog({
  open,
  onOpenChange,
  onAllow,
  onCancel,
  locale
}: LocationPermissionDialogProps) {
  const messageOptions = locale ? { locale } : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogIcon>
          <LocateFixedIcon />
        </DialogIcon>
        <DialogHeader>
          <DialogTitle>{m.location_permission_dialog_title({}, messageOptions)}</DialogTitle>
          <DialogDescription>{m.location_permission_dialog_description({}, messageOptions)}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <DialogClose
            onClick={onCancel}
            render={<Button variant="secondary">{m.location_permission_dialog_cancel({}, messageOptions)}</Button>}
          />
          <Button onClick={onAllow}>{m.location_permission_dialog_allow({}, messageOptions)}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
