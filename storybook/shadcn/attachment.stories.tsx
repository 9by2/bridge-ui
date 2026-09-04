import type { Meta, StoryObj } from "@storybook/react-vite"

import { Attachment } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Attachment,
  tags: ["autodocs"],
  title: "Shadcn/Attachment"
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="attachment" />
}
