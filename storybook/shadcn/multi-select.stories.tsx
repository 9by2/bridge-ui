import type { Meta, StoryObj } from "@storybook/react-vite"

import { MultiSelect } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: MultiSelect,
  tags: ["autodocs"],
  title: "Shadcn/Multi Select"
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="multi-select" />
}
