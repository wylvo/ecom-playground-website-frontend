import { getRouteApi, Link } from "@tanstack/react-router"

import AppLayout from "@/components/layouts/app-layout"
import { useCollection } from "@/features/collections/api/get-collection"

const route = getRouteApi("/{-$locale}/(app)/collections/{-$collectionHandle}")

function CollectionHandle() {
  const { locale } = route.useRouteContext()
  const { collection, handle } = useCollection()
  const hasCollection = collection?.length

  if (!hasCollection) return <div>Collection Handle: {handle} Not Found</div>

  const [theCollection] = collection

  return (
    <AppLayout>
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
    </AppLayout>
  )
}

export default CollectionHandle
