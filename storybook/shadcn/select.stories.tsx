import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Select } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Select,
  tags: ["autodocs"],
  title: "Shadcn/Select"
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="select" />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Role" })
    await userEvent.click(trigger)
    const option = await canvasElement.ownerDocument.body.querySelector('[role="option"]')
    await expect(option).not.toBeNull()
    if (!option) throw new Error("Select option did not render")
    await userEvent.click(option)
    await expect(trigger).toHaveTextContent("admin")
  }
}
