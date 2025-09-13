import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import z from "zod"

export const getProductVariants = async ({
  handle,
}: GetProductVariantsOptions) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `name,
      description,
      handle,

      options:product_options(
        name,
        sort_order,
        
        values:product_option_values(
          value,
          sort_order
        )
      ),

      variants:product_variants(
        id,
        name,
        price,
        discount_price,
        inventory_quantity,
        sku,
        barcode,

        variant_images:product_variant_images(
          sort_order,

          image:product_images(
            url,
            alt_text
          )
        ),

        variant_options:product_variant_options(
          option_values:product_option_values(
            value
          )
        )
      )`,
    )
    .eq("handle", handle)
    .eq("product_variants.is_active", true)
    .eq("product_variants.is_visible", true)
    .order("sort_order", {
      referencedTable: "product_options",
      ascending: true,
    })
    .order("sort_order", {
      referencedTable: "product_options.product_option_values",
      ascending: true,
    })
    .order("sort_order", {
      referencedTable: "product_variants.product_variant_images",
      ascending: true,
    })
    .single()
    .overrideTypes<{
      variants: {
        variant_images: {
          image: {
            url: any
            alt_text: any
          }
        }[]
        variant_options: {
          option_values: {
            value: any
          }
        }[]
      }[]
    }>()

  if (error) {
    console.error(error)
    throw new Error("Product variants could not be loaded")
  }

  return data
}

export function createProductVariantsQueryOptions<
  TData = GetProductVariantsResponse,
  TError = Error,
>(
  params: GetProductVariantsOptions,
  options?: Omit<
    UseQueryOptions<GetProductVariantsResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["product-variants", params],
    queryFn: () => getProductVariants(params),
  })
}

export type GetProductVariantsResponse = Awaited<
  ReturnType<typeof getProductVariants>
>

export type GetProductVariantsOptions = { handle?: string; variant?: number }

export const productHandleVariantParamsSchema = z.object({
  variant: z.number().optional().catch(undefined),
})

export function useProductVariants(
  queryOptions: typeof createProductVariantsQueryOptions = createProductVariantsQueryOptions,
) {
  const { productHandle: handle } = useParams({
    from: "/{-$locale}/(app)/products/{-$productHandle}",
  })

  const { data: product, error, isLoading } = useQuery(queryOptions({ handle }))

  return {
    product,
    error,
    isLoading,
    handle,
  }
}
