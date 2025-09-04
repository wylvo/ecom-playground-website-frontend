import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { z } from "zod"

export const getProducts = async (/*params?: GetProductsOptions*/) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `name,
      description,
      handle,
      product_images(
        url,
        alt_text
      )`,
    )
    .eq("is_active", true)
    .overrideTypes<
      Array<{
        product_images: {
          url: any
          alt_text: any
        }
      }>
    >()

  if (error) {
    console.error(error)
    throw new Error("Products could not be loaded")
  }

  return data
}

export function createProductsQueryOptions<
  TData = GetProductsResponse,
  TError = Error,
>(
  params?: GetProductsOptions,
  options?: Omit<
    UseQueryOptions<GetProductsResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["products", params],
    queryFn: () => getProducts(/*params*/),
  })
}

export type GetProductsResponse = Awaited<ReturnType<typeof getProducts>>
export type GetProductsOptions = z.infer<typeof productParamsSchema>

export const productParamsSchema = z.object({
  page: z.number().optional().catch(1),
  filter: z.string().optional().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).optional().catch("newest"),
})

export function useProducts(
  queryOptions: typeof createProductsQueryOptions = createProductsQueryOptions,
) {
  const { data: products, error, isLoading } = useQuery(queryOptions())

  return { products, error, isLoading }
}
