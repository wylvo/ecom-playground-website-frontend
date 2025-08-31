import {
  createCollectionQueryOptions,
  useCollection,
} from "@/features/collections/api/get-collection"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"

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
  component: RouteComponent,
})

function RouteComponent() {
  const { locale } = Route.useRouteContext()
  const { collection, error, isLoading, handle } = useCollection()
  const hasCollection = collection?.length

  if (!hasCollection) return <div>Collection Handle: {handle} Not Found</div>

  const [theCollection] = collection

  return (
    <div>
      <div>Hello "/-$locale/collections/-$collectionHandle"!</div>
      <div>Collection Handle: {handle} </div>
      <div>Locale: {locale}</div>

      <div className="mt-12">
        {theCollection.products.map((product) => (
          <div key={product.handle} className="mt-8">
            <Link
              className="underline underline-offset-4"
              to="/{-$locale}/products/$productHandle"
              params={{ productHandle: product.handle }}
            >
              <img
                className="w-32 h-32 object-cover"
                src={product.product_images.url}
                alt={product.product_images.alt_text}
              />
              <p>{product.name}</p>
            </Link>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
