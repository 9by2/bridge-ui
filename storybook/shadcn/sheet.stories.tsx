import type { Meta, StoryObj } from "@storybook/react-vite"

import { Sheet } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Sheet,
  tags: ["autodocs"],
  title: "Shadcn/Sheet"
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="sheet" />
}
