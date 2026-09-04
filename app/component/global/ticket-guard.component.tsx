import type { ReactNode } from "react"

export interface TicketGuardProps {
  readonly hasActiveTickets: boolean
  readonly fallback: ReactNode
  readonly children: ReactNode
}

export function TicketGuard({ hasActiveTickets, fallback, children }: TicketGuardProps) {
  return hasActiveTickets ? children : fallback
}
