import Loading from "@/components/ui/loading"
import { createCountriesAndRegionsQueryOptions } from "@/features/checkout/api/get-countries-and-regions"
import { createShippingMethodsQueryOptions } from "@/features/checkout/api/get-shipping-methods"
import { createTaxRatesQueryOptions } from "@/features/checkout/api/get-tax-rates"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

const defaultShippingCountryName = import.meta.env
  .VITE_DEFAULT_SHIPPING_COUNTRY_NAME

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/checkout",
)({
  beforeLoad: ({ context, location }) => {
    const { user, isAuthenticated } = context.auth
    const cart = context.cart
    const isDefaultLocale = context.isDefaultLocale
    const locale = context.locale

    if (cart === undefined)
      throw redirect({ to: "/{-$locale}/cart", replace: true })

    if (
      isAuthenticated &&
      (!cart || (cart?.cart_items && !cart.cart_items.length))
    )
      throw redirect({ to: "/{-$locale}/cart", replace: true })

    if (isDefaultLocale) {
      // Authenticated + not anonymous => skip customer step
      if (
        isAuthenticated &&
        !user?.is_anonymous &&
        (location.pathname.startsWith("/checkout/customer") ||
          location.pathname === "/checkout/" ||
          location.pathname === "/checkout")
      )
        throw redirect({ to: "/{-$locale}/checkout/details", replace: true })

      // No /checkout file route. Redirect to /checkout/customer
      if (
        location.pathname === "/checkout" ||
        location.pathname === "/checkout/"
      )
        throw redirect({ to: "/{-$locale}/checkout/customer", replace: true })
    } else {
      // Authenticated + not anonymous (with locale) => skip customer step
      if (
        isAuthenticated &&
        !user?.is_anonymous &&
        (location.pathname.startsWith(`/${locale}/checkout/customer`) ||
          location.pathname === `/${locale}/checkout/` ||
          location.pathname === `/${locale}/checkout`)
      )
        throw redirect({ to: "/{-$locale}/checkout/details", replace: true })

      // No /checkout file route. Redirect to /checkout/customer (with locale)
      if (
        location.pathname === `/${locale}/checkout` ||
        location.pathname === `/${locale}/checkout/`
      )
        throw redirect({ to: "/{-$locale}/checkout/customer", replace: true })
    }
  },
  loader: async ({ context: { queryClient } }) => {
    return await Promise.all([
      queryClient.ensureQueryData(createCountriesAndRegionsQueryOptions()),
      queryClient.ensureQueryData(createShippingMethodsQueryOptions()),
      queryClient.ensureQueryData(
        createTaxRatesQueryOptions({ countryName: defaultShippingCountryName }),
      ),
    ])
  },
  component: () => <Outlet />,
  pendingComponent: () => <Loading />,
})
