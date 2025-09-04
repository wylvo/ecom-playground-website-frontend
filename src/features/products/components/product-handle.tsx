import { getRouteApi } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"

import {
  useProductVariants,
  type GetProductVariantsResponse,
} from "@/features/products/api/get-product-variants"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/shadcn/button"
import {
  SelectOptions,
  type SelectedOptions,
} from "@/components/ui/select-options"
import AppLayout from "@/components/layouts/app-layout"
import { useCart } from "@/features/cart/contexts/cart-context"

const route = getRouteApi("/{-$locale}/(app)/products/$productHandle")

function ProductHandle() {
  const navigate = route.useNavigate()
  const { variant: variantId } = route.useSearch()
  const { locale } = route.useRouteContext()
  const { product, handle, isLoading } = useProductVariants()
  const cart = useCart()

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  let productVariant: GetProductVariantsResponse["variants"][number] | undefined

  // Match selected option values with a product variant, update URL state
  useEffect(() => {
    if (!product) return

    if (Object.keys(selectedOptions).length === product.options.length) {
      const selectedValues = Object.values(selectedOptions)

      const matchingVariant = product.variants.find((variant) => {
        const variantValues = variant.variant_options.map(
          (vo) => vo.option_values.value,
        )

        return (
          variantValues.length === selectedValues.length &&
          selectedValues.every((val) => variantValues.includes(val))
        )
      })

      const defaultVariant = product.variants[0]

      // Only update URL if it's NOT the default variant
      if (
        matchingVariant &&
        matchingVariant.id !== variantId &&
        matchingVariant.id !== defaultVariant.id
      ) {
        navigate({ search: { variant: matchingVariant.id } })
      }

      // If it's the default variant and the URL has ?variant=..., clean it up
      if (
        matchingVariant &&
        matchingVariant.id === defaultVariant.id &&
        variantId !== undefined
      ) {
        navigate({ search: {}, replace: true }) // remove `variant` from URL
      }
    }
  }, [selectedOptions, product, navigate, variantId])

  // Set and update selected options matching product variant options into state
  useEffect(() => {
    if (!productVariant || !product?.options) return

    const initialSelectedOptions: SelectedOptions = {}

    product.options.forEach((option) => {
      const matching = productVariant?.variant_options.find((vo) =>
        option.values.some((val) => val.value === vo.option_values.value),
      )

      if (matching) {
        initialSelectedOptions[option.name] = matching.option_values.value
      }
    })

    setSelectedOptions(initialSelectedOptions)
  }, [productVariant, product])

  function handleAddToCart() {
    if (!productVariant) return
    cart.addItem({
      cart_id: cart.cart?.id,
      product_variant_id: productVariant.id,
      quantity: 1,
    })
  }

  if (isLoading) return <div>Loading...</div>

  if (!product?.handle)
    return (
      <div>
        <h1 className="text-2xl">Not Found</h1>
        <p>Product Handle: {handle}</p>
        {variantId && <p>Product Variant: {variantId}</p>}
      </div>
    )

  productVariant = variantId
    ? product.variants.find((variant) => variant.id === variantId)
    : product.variants[0] // If no variantId, use the first variant

  if (!productVariant) productVariant = product.variants[0]!

  return (
    <AppLayout>
      <div>
        <div>Hello "/(app)/products/$productHandle"!</div>
        <div>Product Handle: {handle} </div>
        <div>Locale: {locale}</div>

        <div className="mt-12 flex flex-col gap-4">
          <div className="flex gap-8">
            {productVariant.variant_images.map((vi, i) => (
              <img
                key={i}
                className="w-32 h-32 object-cover"
                src={vi.image.url}
                alt={vi.image.alt_text}
              />
            ))}
          </div>
          <p>product name: {product.name}</p>
          <p>variant name: {productVariant.name}</p>
          {/* <p>description: {product.description}</p> */}
          <p>price: {formatPrice(productVariant.price, locale)}</p>
          {productVariant.discount_price && (
            <p>
              discount price:{" "}
              {formatPrice(productVariant.discount_price, locale)}
            </p>
          )}

          <Button
            className="w-[200px]"
            onClick={handleAddToCart}
            disabled={cart.isLoading}
          >
            {cart.isLoading ? (
              <span>Loading...</span>
            ) : (
              <span>Add to cart</span>
            )}
            <ShoppingCart />
          </Button>

          {product.options &&
            product.options.map((option, i) => (
              <SelectOptions
                key={i}
                label={option.name}
                placeholder={option.name}
                data={option.values}
                defaultValue={
                  productVariant.variant_options.find((vo) =>
                    option.values.find(
                      (ov) => ov.value === vo.option_values.value,
                    ),
                  )?.option_values.value
                }
                onValueChange={(value) => {
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [option.name]: value,
                  }))
                }}
              />
            ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default ProductHandle
