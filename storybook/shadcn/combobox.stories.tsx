import type { Meta, StoryObj } from "@storybook/react-vite"

import { Combobox } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Combobox,
  tags: ["autodocs"],
  title: "Shadcn/Combobox"
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="combobox" />
}
