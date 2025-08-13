import { defaultLocale, type Locale } from "@/types/locale"
import { isValidLocale } from "@/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/checkout/customer")({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/checkout/customer" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/(app)/checkout/customer"!</div>
}
