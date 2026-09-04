import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Textarea,
  tags: ["autodocs"],
  title: "Shadcn/Textarea"
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="textarea" />
}
