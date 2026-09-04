import type { Meta, StoryObj } from "@storybook/react-vite"

import { InputOTP } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: InputOTP,
  tags: ["autodocs"],
  title: "Shadcn/Input Otp"
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="input-otp" />
}
