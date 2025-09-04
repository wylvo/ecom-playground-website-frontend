import ProductHandle from "@/features/products/components/product-handle"
import {
  createProductVariantsQueryOptions,
  productHandleVariantParamsSchema,
} from "@/features/products/api/get-product-variants"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/products/$productHandle",
)({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({
        to: "/products/$productHandle" as string,
        params: { productHandle: params.productHandle },
      })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  loader: ({ context: { queryClient }, params: { productHandle: handle } }) => {
    return queryClient.ensureQueryData(
      createProductVariantsQueryOptions({ handle }),
    )
  },
  component: ProductHandle,
  validateSearch: productHandleVariantParamsSchema,
})
