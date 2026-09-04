import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Button } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Button,
  tags: ["autodocs"],
  title: "Shadcn/Button"
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="button" />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Continue" })
    await userEvent.click(button)
    await expect(button).toHaveFocus()
  }
}
