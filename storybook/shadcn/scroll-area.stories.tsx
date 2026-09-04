import type { Meta, StoryObj } from "@storybook/react-vite"

import { ScrollArea } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ScrollArea,
  tags: ["autodocs"],
  title: "Shadcn/Scroll Area"
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="scroll-area" />
}
