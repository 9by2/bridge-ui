import type { Meta, StoryObj } from "@storybook/react-vite"

import { Kbd } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Kbd,
  tags: ["autodocs"],
  title: "Shadcn/Kbd"
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="kbd" />
}
