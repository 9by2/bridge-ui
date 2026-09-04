import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Progress,
  tags: ["autodocs"],
  title: "Shadcn/Progress"
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="progress" />
}
