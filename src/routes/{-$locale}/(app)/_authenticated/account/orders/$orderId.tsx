import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account/orders/$orderId",
)({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: "/account/orders/$orderId" as string,
        params: { orderId: params.orderId },
      })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { orderId } = Route.useParams()
  const { locale } = Route.useRouteContext()

  return (
    <div>
      <div>Hello "/-$locale/(app)/account/orders/$orderId"!</div>
      <div>Order Id: {orderId} </div>
      <div>Locale: {locale}</div>
    </div>
  )
}
