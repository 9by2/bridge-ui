import type { Meta, StoryObj } from "@storybook/react-vite"

import { NativeSelect } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: NativeSelect,
  tags: ["autodocs"],
  title: "Shadcn/Native Select"
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="native-select" />
}
