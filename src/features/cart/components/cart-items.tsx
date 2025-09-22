import type { ChangeEvent } from "react"
import { useCart } from "../contexts/cart-context"
import { Link } from "@tanstack/react-router"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/shadcn/button"
import { Minus, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/shadcn/input"

function CartItems() {
  const { cart, isLoading, updateItemQuantity, removeItem } = useCart()
  const minQuantity = 1
  const maxQuantity = 10

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
    <div className="flex flex-col gap-8 mt-4">
      {cart &&
        cart.cart_items.map((cart_item) => {
          const variant = cart_item.variant
          const quantity = cart_item.quantity

          return (
            <div key={cart_item.id} className="flex gap-2">
              <Link
                to="/{-$locale}/products/{-$productHandle}"
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
                  <p>{formatPrice({ cents: variant.price })}</p>
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
                    onChange={(e) => handleQuantityOnChange(e, cart_item.id)}
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
  )
}

export default CartItems
