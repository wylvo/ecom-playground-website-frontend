import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { z } from "zod"

export const getCollections = async (/*params?: GetCollectionsOptions*/) => {
  const { data, error } = await supabase
    .from("product_collections")
    .select(
      `parent_product_collection_id,
      name,
      image_url,
      handle`,
    )
    .eq("is_active", true)

  if (error) {
    console.error(error)
    throw new Error("Collections could not be loaded")
  }

  return data
}

export function createCollectionsQueryOptions<
  TData = GetCollectionsResponse,
  TError = Error,
>(
  params?: GetCollectionsOptions,
  options?: Omit<
    UseQueryOptions<GetCollectionsResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["collections", params],
    queryFn: () => getCollections(/*params*/),
  })
}

export type GetCollectionsResponse = Awaited<ReturnType<typeof getCollections>>
export type GetCollectionsOptions = z.infer<typeof collectionParamsSchema>

export const collectionParamsSchema = z.object({
  page: z.number().optional().catch(1),
  filter: z.string().optional().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).optional().catch("newest"),
})

export function useCollections(
  queryOptions: typeof createCollectionsQueryOptions = createCollectionsQueryOptions,
) {
  const { data: collections, error, isLoading } = useQuery(queryOptions())

  return { collections, error, isLoading }
}
