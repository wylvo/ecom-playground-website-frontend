import type { CheckoutSchema } from "../api/checkout"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type CheckoutState = Partial<CheckoutSchema> & {
  setData: (data: Partial<CheckoutSchema>) => void
}

export const checkoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
)

export const useCheckoutStore = checkoutStore
