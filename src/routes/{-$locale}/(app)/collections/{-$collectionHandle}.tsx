import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/collections/{-$collectionHandle}",
)({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: "/collections/$collectionHandle" as string,
        params: { collectionHandle: params.collectionHandle },
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
  const { collectionHandle } = Route.useParams()
  const { locale } = Route.useRouteContext()

  return (
    <div>
      <div>Hello "/-$locale/collections/-$collectionHandle"!</div>
      <div>Collection Handle: {collectionHandle} </div>
      <div>Locale: {locale}</div>
    </div>
  )
}
