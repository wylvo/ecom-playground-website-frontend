import { createFileRoute, redirect } from "@tanstack/react-router"

import { defaultLocale, type Locale } from "@/types/locale"
import { isValidLocale } from "@/lib/utils"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account/",
)({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/account" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/(app)/account/"!</div>
}
