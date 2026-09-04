import type { Meta, StoryObj } from "@storybook/react-vite"

import { DirectionProvider } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: DirectionProvider,
  tags: ["autodocs"],
  title: "Shadcn/Direction"
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="direction" />
}
