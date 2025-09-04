import Collections from "@/features/collections/components/collections"
import { createCollectionsQueryOptions } from "@/features/collections/api/get-collections"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/collections/")({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/collections" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(createCollectionsQueryOptions())
  },
  component: Collections,
})
