import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Accordion } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Accordion,
  tags: ["autodocs"],
  title: "Shadcn/Accordion"
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="accordion" />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Can I reuse this?" })
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  }
}
