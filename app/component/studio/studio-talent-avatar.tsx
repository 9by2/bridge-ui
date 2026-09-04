import { Avatar, AvatarFallback } from "@bridge/ui/app/component/shadcn/avatar"
import { cn } from "cnfast"

function CreateTalentInitials(displayName: string): string {
  return (
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "T"
  )
}

export function StudioTalentAvatar({
  avatarUrl,
  className,
  displayName
}: {
  readonly avatarUrl: string | null
  readonly className?: string | undefined
  readonly displayName: string
}) {
  return (
    <Avatar className={cn("size-9 border border-white/10", className)}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={displayName} className="aspect-square size-full rounded-full object-cover" />
      ) : (
        <AvatarFallback className="font-heading text-xs font-semibold text-highlight">
          {CreateTalentInitials(displayName)}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
