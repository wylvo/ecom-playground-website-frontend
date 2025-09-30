import { useNavigate } from "@tanstack/react-router"

import { useCart } from "@/features/cart/contexts/cart-context"
import { Button } from "@/components/ui/shadcn/button"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"
import CartEmpty from "./cart-empty"
import Loading from "@/components/ui/loading"
import CartSummary from "./cart-summary"
import CartItems from "./cart-items"
import Section from "@/components/ui/section"
import Wrapper from "@/components/ui/wrapper"

function Cart() {
  const { cart, isLoading } = useCart()
  const { user } = useSupabaseAuth()
  const navigate = useNavigate()

  if (isLoading) return <Loading />

  if (!cart || (cart?.cart_items && !cart.cart_items.length))
    return <CartEmpty />

  function handleClickCheckout() {
    if (!user) return navigate({ to: "/{-$locale}/checkout/customer" })
    if (user && user.is_anonymous)
      return navigate({ to: "/{-$locale}/checkout/customer" })

    return navigate({ to: "/{-$locale}/checkout/details" })
  }

  return (
    <Section>
      <Wrapper>
        <div className="grid grid-cols-2 gap-8">
          <div className="grid gap-8 p-8">
            <h1>
              <span className="text-3xl">Cart</span>
              {cart && cart.cart_items.length > 1
                ? ` — ${cart?.cart_items.length} items`
                : cart && cart.cart_items.length === 1
                  ? ` — ${cart?.cart_items.length} item`
                  : ""}
            </h1>

            <CartItems />
          </div>

          <div className="grid gap-8 p-8">
            <CartSummary id={cart.id} cart_items={cart.cart_items} />

            <div>
              <Button className="w-full" onClick={handleClickCheckout}>
                Checkout
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-2">
                * Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </Section>
  )
}

export default Cart
