import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Popover } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Popover,
  tags: ["autodocs"],
  title: "Shadcn/Popover"
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="popover" />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open popover" }))
    await expect(canvasElement.ownerDocument.body).toHaveTextContent("Shared popover content")
  }
}
