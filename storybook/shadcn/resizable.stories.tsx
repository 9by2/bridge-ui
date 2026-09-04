import type { Meta, StoryObj } from "@storybook/react-vite"

import { ResizablePanelGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  title: "Shadcn/Resizable"
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="resizable" />
}
