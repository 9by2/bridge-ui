import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Dialog } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Dialog,
  tags: ["autodocs"],
  title: "Shadcn/Dialog"
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="dialog" />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }))
    const dialog = canvasElement.ownerDocument.body.querySelector('[role="dialog"]')
    await expect(dialog).toHaveTextContent("Shared dialog")
  }
}
