import { createFileRoute } from "@tanstack/react-router"

import Summary from "@/features/checkout/components/summary"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/summary",
)({
  component: Summary,
})
