import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { defaultLocale, type Locale } from "@/types/locale"
import { isValidLocale } from "@/lib/utils"

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: async ({ params, location }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: location.pathname.replace(`/${locale}`, "/"),
        params,
      })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: () => <Outlet />,
})
