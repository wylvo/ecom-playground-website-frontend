import { createFileRoute, redirect } from "@tanstack/react-router"
import { defaultLocale, type Locale } from "@/types/locale"
import { isValidLocale } from "@/lib/utils"
import Home from "@/components/ui/home"

export const Route = createFileRoute("/{-$locale}/")({
  beforeLoad: async ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/" })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
    }
  },
  component: Home,
})
