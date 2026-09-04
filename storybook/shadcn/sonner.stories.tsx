import type { Meta, StoryObj } from "@storybook/react-vite"

import { SonnerToaster } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: SonnerToaster,
  tags: ["autodocs"],
  title: "Shadcn/Sonner"
} satisfies Meta<typeof SonnerToaster>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="sonner" />
}
