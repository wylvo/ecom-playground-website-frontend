import { createFileRoute } from "@tanstack/react-router"

import CollectionHandle from "@/features/collections/components/collection-handle"
import { createCollectionQueryOptions } from "@/features/collections/api/get-collection"

export const Route = createFileRoute(
  "/{-$locale}/(app)/collections/{-$collectionHandle}",
)({
  loader: ({ context: { queryClient }, params: { collectionHandle } }) => {
    return queryClient.ensureQueryData(
      createCollectionQueryOptions({ handle: collectionHandle }),
    )
  },
  component: CollectionHandle,
})
