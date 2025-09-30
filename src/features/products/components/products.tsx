import { getRouteApi, Link } from "@tanstack/react-router"

import { useProducts } from "@/features/products/api/get-products"
import Section from "@/components/ui/section"
import Wrapper from "@/components/ui/wrapper"

const route = getRouteApi("/{-$locale}/(app)/products/")

function Products() {
  const { locale } = route.useRouteContext()
  const { products } = useProducts()

  return (
    <Section>
      <Wrapper>
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
                  to="/{-$locale}/products/{-$productHandle}"
                  params={{ productHandle: product.handle }}
                >
                  {product.name}
                </Link>

                <p>{product.description}</p>
              </div>
            ))}
        </div>
      </Wrapper>
    </Section>
  )
}

export default Products
