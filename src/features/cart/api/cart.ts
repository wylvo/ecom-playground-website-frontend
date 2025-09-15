import supabase from "@/services/supabase"

export type CartItem = {
  id: string
  product_variant_id: number
  cart_id: string
  quantity: number
}
export type AddCartItem = Omit<CartItem, "id">
export type GetCartItem = Omit<CartItem, "id" | "quantity">
export type UpdateCartItemQuantity = Omit<
  CartItem,
  "cart_id" | "product_variant_id"
>

export type GetCartResponse = Awaited<ReturnType<typeof getCart>>

export async function getCart(authUserId: string) {
  const { data, error } = await supabase
    .from("carts")
    .select(
      `id,

      cart_items(
        id,
        quantity,

        variant:product_variants(
          id,
          name,
          price,
          discount_price,
          inventory_quantity,
          sku,
          barcode,

          product:products(
            name,
            handle
          ),

          variant_images:product_variant_images(
            sort_order,

            image:product_images(
              url,
              alt_text
            )
          ),

          variant_options:product_variant_options(
            option_value:product_option_values(
              value,

              option:product_options(
                name,
                sort_order
              )
            )
          )
        )
      )`,
    )
    .eq("auth_user_id", authUserId)
    .eq("cart_items.variant.variant_images.sort_order", 1)
    .order("created_at", { referencedTable: "cart_items", ascending: true })
    .single()
    .overrideTypes<{
      id: any
      cart_items: {
        id: any
        quantity: any
        variant: {
          id: any
          name: any
          price: any
          discount_price: any
          inventory_quantity: any
          sku: any
          barcode: any
          product: {
            name: any
            handle: any
          }

          variant_images: {
            sort_order: any
            image: {
              url: any
              alt_text: any
            }
          }[]

          variant_options: {
            option_value: {
              value: any
              option: {
                name: any
                sort_order: any
              }[]
            }[]
          }[]
        }
      }[]
    }>()

  if (error) throw error

  return data
}

export async function getCartItem({
  cart_id: cartId,
  product_variant_id: productVariantId,
}: GetCartItem) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, cart_id, quantity, product_variant_id")
    .eq("cart_id", cartId)
    .eq("product_variant_id", productVariantId)

  if (error) throw error

  return data
}

export async function addCartItemToCart(item: AddCartItem) {
  const { cart_id, product_variant_id } = item

  const existingItemInCart = await getCartItem({
    cart_id,
    product_variant_id,
  })

  let query: any = supabase.from("cart_items")

  if (existingItemInCart.length && existingItemInCart[0].id)
    query = query
      .update({
        quantity: existingItemInCart[0].quantity + 1,
      })
      .eq("cart_id", existingItemInCart[0].cart_id)
      .eq("product_variant_id", existingItemInCart[0].product_variant_id)

  if (!existingItemInCart.length || existingItemInCart[0].id === undefined)
    query = query.insert({
      cart_id: item.cart_id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
    })

  const { data, error } = await query.select().single()

  if (error) throw error

  return data
}

export async function removeCartItemFromCart(id: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", id)

  if (error) throw error
}

export async function updateCartItemQuantity({
  id,
  quantity,
}: UpdateCartItemQuantity) {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}
