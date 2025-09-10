import { unsubscribeParamsSchema } from "@/features/newsletter/api/unsubscribe"
import Unsubscribe from "@/features/newsletter/components/unsubscribe"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"
import z from "zod"

export const Route = createFileRoute(
  "/{-$locale}/(app)/newsletter/unsubscribe",
)({
  beforeLoad: ({ params, search }) => {
    const { locale } = params

    try {
      unsubscribeParamsSchema.parse(search)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw redirect({ to: "/{-$locale}" })
      }
    }

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: "/newsletter/unsubscribe" as string,
      })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: Unsubscribe,
  validateSearch: unsubscribeParamsSchema,
})
