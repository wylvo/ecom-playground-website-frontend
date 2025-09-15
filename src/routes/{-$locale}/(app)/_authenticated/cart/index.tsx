import { createFileRoute } from "@tanstack/react-router"

import Cart from "@/features/cart/components/cart"

export const Route = createFileRoute("/{-$locale}/(app)/_authenticated/cart/")({
  component: Cart,
})
