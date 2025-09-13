import ProductHandle from "@/features/products/components/product-handle"
import {
  createProductVariantsQueryOptions,
  productHandleVariantParamsSchema,
} from "@/features/products/api/get-product-variants"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/products/{-$productHandle}",
)({
  loader: ({ context: { queryClient }, params: { productHandle: handle } }) => {
    return queryClient.ensureQueryData(
      createProductVariantsQueryOptions({ handle }),
    )
  },
  component: ProductHandle,
  validateSearch: productHandleVariantParamsSchema,
})
