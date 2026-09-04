import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Tabs } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Tabs,
  tags: ["autodocs"],
  title: "Shadcn/Tabs"
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="tabs" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Two" }))
    await expect(canvas.getByText("Second panel")).toBeVisible()
  }
}
