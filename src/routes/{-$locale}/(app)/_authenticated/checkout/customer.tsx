import { createFileRoute } from "@tanstack/react-router"

import Customer from "@/features/checkout/components/customer"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/customer",
)({
  component: Customer,
})
