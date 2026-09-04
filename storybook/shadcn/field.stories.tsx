import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Field,
  tags: ["autodocs"],
  title: "Shadcn/Field"
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="field" />
}
