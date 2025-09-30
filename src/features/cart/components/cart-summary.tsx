import { formatPrice } from "@/lib/utils"
import type { GetCartResponse } from "../api/cart"
import { Progress } from "@/components/ui/shadcn/progress"
import { Truck } from "lucide-react"

const freeShippingTreshold = import.meta.env.VITE_FREE_SHIPPING_THRESHOLD

function CartSummary(cart: GetCartResponse) {
  const subtotal = cart
    ? {
        amount: Number(
          cart.cart_items.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.variant.price * currentValue.quantity,
            0,
          ),
        ),
        formatted: formatPrice({
          cents: cart.cart_items.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.variant.price * currentValue.quantity,
            0,
          ),
        }),
      }
    : {
        amount: 0,
        formatted: formatPrice({ cents: 0 }),
      }
  const progressValue = (subtotal.amount / freeShippingTreshold) * 100
  const hasFreeShipping = progressValue >= 100
  const remainingAmount = formatPrice({
    cents: freeShippingTreshold - subtotal.amount,
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl mb-4">Summary</h2>
        <Progress value={progressValue} />
        <div className="flex gap-2 items-center">
          <Truck />
          {hasFreeShipping ? (
            <p>
              Congratulations! You qualify for <strong>FREE shipping</strong>
            </p>
          ) : (
            <p>
              Add <strong>{remainingAmount}</strong> to qualify for free
              shipping
            </p>
          )}
        </div>
      </div>
      <div className="text-lg">
        {subtotal.amount >= freeShippingTreshold && (
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>FREE</p>
          </div>
        )}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{subtotal.formatted}</p>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
