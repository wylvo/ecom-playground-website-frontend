import { createFileRoute } from "@tanstack/react-router"

import Shipping from "@/features/checkout/components/shipping"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/shipping",
)({
  component: Shipping,
})
