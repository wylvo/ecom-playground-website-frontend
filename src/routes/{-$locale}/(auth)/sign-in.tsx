import SignIn from "@/features/auth/components/sign-in"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(auth)/sign-in")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/{-$locale}/",
  }),
  beforeLoad: ({ context, search, params }) => {
    const { locale } = params

    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/sign-in" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: SignIn,
})
