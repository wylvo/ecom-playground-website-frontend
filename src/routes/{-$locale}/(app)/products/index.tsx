import Products from "@/features/products/components/products"
import {
  createProductsQueryOptions,
  productParamsSchema,
} from "@/features/products/api/get-products"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/products/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(createProductsQueryOptions())
  },
  component: Products,
  validateSearch: productParamsSchema,
})
