import type { Meta, StoryObj } from "@storybook/react-vite"

import { Toggle } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Toggle,
  tags: ["autodocs"],
  title: "Shadcn/Toggle"
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="toggle" />
}
