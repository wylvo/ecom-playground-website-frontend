import { createFileRoute, redirect } from "@tanstack/react-router"

import Shipping from "@/features/checkout/components/shipping"
import { checkoutStore } from "@/features/checkout/stores/checkout-store"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout/shipping",
)({
  beforeLoad: async () => {
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
    const phone_number = checkoutStore.getState().phone_number
    const shipping_full_name = checkoutStore.getState().shipping_full_name
    const shipping_address_line_1 =
      checkoutStore.getState().shipping_address_line_1
    const shipping_city = checkoutStore.getState().shipping_city
    const shipping_region = checkoutStore.getState().shipping_region
    const shipping_zip = checkoutStore.getState().shipping_zip
    const shipping_country = checkoutStore.getState().shipping_country
    const billing_full_name = checkoutStore.getState().billing_full_name
    const billing_address_line_1 =
      checkoutStore.getState().billing_address_line_1
    const billing_city = checkoutStore.getState().billing_city
    const billing_region = checkoutStore.getState().billing_region
    const billing_zip = checkoutStore.getState().billing_zip
    const billing_country = checkoutStore.getState().billing_country

    if (
      !email ||
      !phone_number ||
      !shipping_full_name ||
      !shipping_address_line_1 ||
      !shipping_city ||
      !shipping_region ||
      !shipping_zip ||
      !shipping_country ||
      !billing_full_name ||
      !billing_address_line_1 ||
      !billing_city ||
      !billing_region ||
      !billing_zip ||
      !billing_country
    )
      throw redirect({
        to: "/{-$locale}/checkout/details",
      })
  },
  component: Shipping,
})
