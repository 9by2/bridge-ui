import { cn } from "cn"

interface SuccessBurstComponentProps {
  readonly className?: string
}

/**
 * Decorative arrival graphic for a confirmed payment (design D6/D7/D8): a halo, a
 * stroke-drawn ring, a brand disc, and a stroke-drawn check. Pure presentation — no
 * data props, no effects. The celebration hook (group 8) owns the confetti canvas
 * separately; this component never touches `canvas-confetti`.
 *
 * The fill pairs `--brand` with `--brand-foreground` (see `status-badge.component.tsx`
 * for the same pairing) — never `--brand-accent`, which `app/globals.css` documents as
 * fill-only at 2.66:1 and therefore not legal as an icon/text colour on its own.
 *
 * All motion is CSS transform/opacity driven by the `.success-burst` classes below and
 * is flattened under `prefers-reduced-motion` (design D5) — see `globals.css`.
 */
export function SuccessBurstComponent({ className }: SuccessBurstComponentProps) {
  return (
    <div aria-hidden="true" className={cn("success-burst relative grid size-[108px] place-items-center", className)}>
      <div className="success-burst-halo absolute -inset-3.5 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand)_42%,transparent)_0%,transparent_68%)] opacity-0" />
      <svg viewBox="0 0 108 108" className="absolute inset-0" focusable="false">
        <circle
          className="success-burst-ring origin-center -rotate-90 fill-none stroke-brand"
          cx="54"
          cy="54"
          r="50"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="314"
          strokeDashoffset="314"
        />
      </svg>
      <div className="success-burst-disc grid size-[74px] scale-[0.4] place-items-center rounded-full bg-brand opacity-0">
        <svg width="38" height="38" viewBox="0 0 24 24" focusable="false">
          <path
            className="success-burst-tick fill-none stroke-brand-foreground"
            d="M5 12.5 10 17.5 19 7"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="42"
            strokeDashoffset="42"
          />
        </svg>
      </div>
    </div>
  )
}
