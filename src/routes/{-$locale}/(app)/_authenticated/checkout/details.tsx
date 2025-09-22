import { createFileRoute, redirect } from "@tanstack/react-router"

import OrderDetails from "@/features/checkout/components/details"
import { checkoutStore } from "@/features/checkout/stores/checkout-store"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/details",
)({
  beforeLoad: async ({ context: { auth } }) => {
    const user = auth.user

    // Wait for Zustand store to hydrate (from localStorage or other storage)
    if (!checkoutStore.persist.hasHydrated()) {
      await new Promise<void>((resolve) => {
        const unsub = checkoutStore.persist.onFinishHydration(() => {
          unsub()
          resolve()
        })
      })
    }

    const email = checkoutStore.getState().email

    if (user?.is_anonymous && !email)
      throw redirect({ to: "/{-$locale}/checkout/customer" })
  },
  component: OrderDetails,
})
