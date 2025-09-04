import Products from "@/features/products/components/products"
import {
  createProductsQueryOptions,
  productParamsSchema,
} from "@/features/products/api/get-products"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/products/")({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/products" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(createProductsQueryOptions())
  },
  component: Products,
  validateSearch: productParamsSchema,
})
