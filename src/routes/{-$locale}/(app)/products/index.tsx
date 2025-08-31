import {
  createProductsQueryOptions,
  useProducts,
} from "@/features/products/api/get-products"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { z } from "zod"

const productSearchSchema = z.object({
  page: z.number().optional().catch(1),
  filter: z.string().optional().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).optional().catch("newest"),
})

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
  validateSearch: productSearchSchema,
})

function Products() {
  const { locale } = Route.useRouteContext()
  const { products, error, isLoading } = useProducts()

  console.log(products)

  return (
    <div>
      <div>Hello "/(app)/products/"!</div>
      <p>Locale: {locale}</p>

      <div className="mt-8">
        <h1 className="mb-4">Products</h1>

        {products &&
          products.map((product) => (
            <div key={product.handle} className="mb-8">
              <img
                className="w-32 h-32 object-cover"
                src={product.product_images.url}
                alt={product.product_images.alt_text}
              />
              <Link
                className="underline underline-offset-4"
                to="/{-$locale}/products/$productHandle"
                params={{ productHandle: product.handle }}
              >
                {product.name}
              </Link>

              <p>{product.description}</p>
            </div>
          ))}
      </div>
    </div>
  )
}
