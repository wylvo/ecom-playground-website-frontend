import { createFileRoute } from "@tanstack/react-router"

import OrderDetails from "@/features/checkout/components/details"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/details",
)({
  component: OrderDetails,
})
