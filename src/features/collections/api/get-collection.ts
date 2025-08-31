import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

export async function getCollection({ handle }: GetCollectionOptions) {
  const { data, error } = await supabase
    .from("product_collections")
    .select(
      `parent_product_collection_id,
      name,
      image_url,
      handle,

      products(
        name,
        description,
        handle,
        
        product_images(
          url,
          alt_text
        )
      )`,
    )
    .eq("products.is_active", true)
    .eq("is_active", true)
    .eq("handle", handle)
    .overrideTypes<
      Array<{
        products: {
          product_images: {
            url: any
            alt_text: any
          }
        }[]
      }>
    >()

  if (error) {
    console.error(error)
    throw new Error("Collection not found")
  }

  return data
}

export function createCollectionQueryOptions<
  TData = GetCollectionResponse,
  TError = Error,
>(
  params: GetCollectionOptions,
  options?: Omit<
    UseQueryOptions<GetCollectionResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["collections", params],
    queryFn: () => getCollection(params),
  })
}

export type GetCollectionResponse = Awaited<ReturnType<typeof getCollection>>
export type GetCollectionOptions = { handle: string | undefined }

export function useCollection(
  queryOptions: typeof createCollectionQueryOptions = createCollectionQueryOptions,
) {
  const { collectionHandle: handle } = useParams({
    from: "/{-$locale}/(app)/collections/{-$collectionHandle}",
  })

  const {
    data: collection,
    error,
    isLoading,
  } = useQuery(queryOptions({ handle }))

  return { collection, error, isLoading, handle }
}
