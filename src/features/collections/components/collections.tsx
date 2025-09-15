import { useCollections } from "@/features/collections/api/get-collections"
import { getRouteApi, Link } from "@tanstack/react-router"

const route = getRouteApi("/{-$locale}/(app)/collections/")

function Collections() {
  const { locale } = route.useRouteContext()
  const { collections } = useCollections()

  return (
    <>
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
    </>
  )
}

export default Collections
