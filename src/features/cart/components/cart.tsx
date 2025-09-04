import { type ChangeEvent } from "react"
import { Link } from "@tanstack/react-router"
import { Minus, Plus, X } from "lucide-react"

import AppLayout from "@/components/layouts/app-layout"
import { useCart } from "@/features/cart/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"

function Cart() {
  const { cart, isLoading, removeItem, updateItemQuantity } = useCart()
  const { user } = useSupabaseAuth()

  const minQuantity = 1
  const maxQuantity = 10
  const freeShippingTreshold = 150
  const subtotal = cart
    ? {
        amount: Number(
          cart.cart_items.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.variant.price * currentValue.quantity,
            0,
          ) / 100,
        ),
        formatted: formatPrice(
          cart.cart_items.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.variant.price * currentValue.quantity,
            0,
          ),
        ),
      }
    : {
        amount: 0,
        formatted: formatPrice(0),
      }

  function handleDecrementQuantity(cartItemId: string, quantity: number) {
    if (quantity === minQuantity) return
    updateItemQuantity({ id: cartItemId, quantity: quantity - 1 })
  }

  function handleIncrementQuantity(cartItemId: string, quantity: number) {
    if (quantity >= maxQuantity) return
    updateItemQuantity({ id: cartItemId, quantity: quantity + 1 })
  }

  function handleRemoveCartItem(cartItemId: string) {
    removeItem(cartItemId)
  }

  function handleQuantityOnChange(
    e: ChangeEvent<HTMLInputElement>,
    cartItemId: string,
  ) {
    const newQuantity = Number(e.target.value)
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      updateItemQuantity({
        id: cartItemId,
        quantity: newQuantity,
      })
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 p-8">
        <h1>
          <span className="text-3xl">Cart</span>
          {cart && cart.cart_items.length > 1
            ? ` — ${cart?.cart_items.length} items`
            : cart && cart.cart_items.length === 1
              ? ` — ${cart?.cart_items.length} item`
              : ""}
        </h1>

        <div className="flex flex-col gap-8 mt-4">
          {cart &&
            cart.cart_items.map((cart_item) => {
              const variant = cart_item.variant
              const quantity = cart_item.quantity

              return (
                <div key={cart_item.id} className="flex gap-2">
                  <Link
                    to="/{-$locale}/products/$productHandle"
                    params={{ productHandle: variant.product.handle }}
                    search={{ variant: variant.id }}
                  >
                    <img
                      className="w-24 h-24 object-cover rounded-md"
                      src={variant.variant_images[0].image.url}
                      alt={variant.variant_images[0].image.alt_text}
                    />
                  </Link>
                  <div className="flex flex-col flex-grow gap-1">
                    <div>
                      <p>{variant.product.name}</p>
                      <p>{formatPrice(variant.price)}</p>
                    </div>

                    <div>
                      {variant.variant_options.map((vo: any, i: number) => (
                        <p key={i}>
                          <span>{vo.option_value.option.name}: </span>
                          <span>{vo.option_value.value}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={isLoading || quantity === minQuantity}
                        onClick={() =>
                          handleDecrementQuantity(cart_item.id, quantity)
                        }
                      >
                        <Minus />
                      </Button>
                      <Input
                        className="w-[60px]"
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityOnChange(e, cart_item.id)
                        }
                      />
                      <Button
                        variant="outline"
                        disabled={isLoading || quantity === maxQuantity}
                        onClick={() =>
                          handleIncrementQuantity(cart_item.id, quantity)
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-grow justify-end">
                    <Button
                      className=""
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => handleRemoveCartItem(cart_item.id)}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              )
            })}
        </div>
        <div>
          <h2 className="text-2xl mb-2">Order Summary</h2>
          {subtotal.amount >= freeShippingTreshold && <p>FREE SHIPPING</p>}
          <p>Subtotal: {subtotal.formatted}</p>
        </div>

        <Button>
          {!user ? (
            <Link to="/{-$locale}/checkout/customer">Checkout</Link>
          ) : user && user.is_anonymous ? (
            <Link to="/{-$locale}/checkout/customer">Checkout</Link>
          ) : (
            <Link to="/{-$locale}/checkout/details">Checkout</Link>
          )}
        </Button>
      </div>
    </AppLayout>
  )
}

export default Cart
