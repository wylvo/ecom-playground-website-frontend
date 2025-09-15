import { Button } from "@/components/ui/shadcn/button"
import { useNavigate } from "@tanstack/react-router"
import { PackageOpen } from "lucide-react"

function CartEmpty() {
  const navigate = useNavigate({ from: "/{-$locale}/cart" })
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <PackageOpen strokeWidth="0.5" className="w-16 h-16" />
        <h1 className="text-2xl">Your cart is empty</h1>
        <Button
          className="w-full"
          onClick={() => navigate({ to: "/{-$locale}/products" })}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}

export default CartEmpty
