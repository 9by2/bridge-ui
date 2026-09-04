import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: AspectRatio,
  tags: ["autodocs"],
  title: "Shadcn/Aspect Ratio"
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="aspect-ratio" />
}
