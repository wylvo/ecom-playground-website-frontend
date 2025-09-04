import { createFileRoute, redirect } from "@tanstack/react-router"

import CollectionHandle from "@/features/collections/components/collection-handle"
import { createCollectionQueryOptions } from "@/features/collections/api/get-collection"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"

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
  loader: ({ context: { queryClient }, params: { collectionHandle } }) => {
    return queryClient.ensureQueryData(
      createCollectionQueryOptions({ handle: collectionHandle }),
    )
  },
  component: CollectionHandle,
})
