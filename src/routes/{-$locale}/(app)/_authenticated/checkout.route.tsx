import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout",
)({
  beforeLoad: ({ context, location }) => {
    const { user, isAuthenticated } = context.auth
    const cart = context.cart
    console.log(cart)
    console.log(user)

    if (cart === undefined)
      throw redirect({ to: "/{-$locale}/cart", replace: true })

    if (
      isAuthenticated &&
      (!cart || (cart?.cart_items && !cart.cart_items.length))
    )
      throw redirect({ to: "/{-$locale}/cart", replace: true })

    // Authenticated + not anonymous => skip customer step
    if (
      isAuthenticated &&
      !user?.is_anonymous &&
      location.pathname.startsWith("/checkout/customer")
    )
      throw redirect({ to: "/{-$locale}/checkout/details", replace: true })
  },
  component: () => <Outlet />,
})
