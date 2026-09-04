import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Tooltip } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Tooltip,
  tags: ["autodocs"],
  title: "Shadcn/Tooltip"
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="tooltip" />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Hover me" }))
    await expect(canvasElement.ownerDocument.body).toHaveTextContent("Helpful detail")
  }
}
