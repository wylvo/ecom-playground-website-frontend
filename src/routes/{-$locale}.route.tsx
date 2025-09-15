import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { defaultLocale, type Locale } from "@/types/locale"
import { isValidLocale } from "@/lib/utils"
import Layout from "@/components/layouts/layout"

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: async ({ params, location }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      const to = location.pathname.replace(`/${locale}`, "/")
      throw redirect({ to, params })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: LocaleComponent,
})

function LocaleComponent() {
  const context = Route.useRouteContext()

  return (
    <Layout pathname={location.pathname} locale={context.locale}>
      <Outlet />
    </Layout>
  )
}
