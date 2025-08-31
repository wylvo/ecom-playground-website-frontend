import {
  createCollectionsQueryOptions,
  useCollections,
} from "@/features/collections/api/get-collections"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"

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
  component: RouteComponent,
})

function RouteComponent() {
  const { locale } = Route.useRouteContext()
  const { collections, error, isLoading } = useCollections()

  return (
    <div>
      <div>Hello "/-$locale/(app)/collections/"!</div>
      <div>Locale: {locale}</div>

      <div className="mt-8">
        <h1>Collections</h1>
        {collections &&
          collections.map((collection) => (
            <div key={collection.handle} className="mt-2">
              <p>Collection: {collection.name}</p>
              <p>
                Handle:{" "}
                <Link
                  className="underline underline-offset-4"
                  to="/{-$locale}/collections/{-$collectionHandle}"
                  params={{ collectionHandle: collection.handle }}
                >
                  {collection.handle}
                </Link>
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}
