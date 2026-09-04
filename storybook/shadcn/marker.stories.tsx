import type { Meta, StoryObj } from "@storybook/react-vite"

import { Marker } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Marker,
  tags: ["autodocs"],
  title: "Shadcn/Marker"
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="marker" />
}
