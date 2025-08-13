import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/products/$productHandle",
)({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: "/products/$productHandle" as string,
        params: { productHandle: params.productHandle },
      })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: ProductsHandle,
})

function ProductsHandle() {
  const { productHandle } = Route.useParams()
  const { locale } = Route.useRouteContext()

  return (
    <div>
      <div>Hello "/(app)/products/$productHandle"!</div>
      <div>Product Handle: {productHandle} </div>
      <div>Locale: {locale}</div>
    </div>
  )
}
