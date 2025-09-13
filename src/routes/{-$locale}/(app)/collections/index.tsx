import { createFileRoute } from "@tanstack/react-router"

import Collections from "@/features/collections/components/collections"
import { createCollectionsQueryOptions } from "@/features/collections/api/get-collections"

export const Route = createFileRoute("/{-$locale}/(app)/collections/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(createCollectionsQueryOptions())
  },
  component: Collections,
})
