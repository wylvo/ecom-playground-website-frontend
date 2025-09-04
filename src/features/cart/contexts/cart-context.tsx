import { createContext, useContext } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutateFunction,
} from "@tanstack/react-query"
import {
  getCart,
  addCartItemToCart,
  removeCartItemFromCart,
  updateCartItemQuantity,
  type AddCartItem,
  type UpdateCartItemQuantity,
  type GetCartResponse,
} from "@/features/cart/api/cart"
import {
  useSupabaseAuth,
  type UserClaims,
} from "@/features/auth/contexts/supabase-auth-context"

interface CartContextValue {
  cart: GetCartResponse | undefined
  isLoading: boolean
  error: Error | null
  addItem: UseMutateFunction<void, Error, AddCartItem, unknown>
  removeItem: UseMutateFunction<void, Error, string, unknown>
  updateItemQuantity: UseMutateFunction<
    void,
    Error,
    UpdateCartItemQuantity,
    unknown
  >
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSupabaseAuth()
  const queryClient = useQueryClient()

  const userId =
    typeof user === "object" && user?.id
      ? user.id
      : (user as UserClaims)?.sub
        ? (user as UserClaims)?.sub
        : null

  const {
    data: cart,
    isLoading: isLoadingCart,
    error: cartError,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCart(userId!),
    enabled: !!userId,
  })

  const {
    mutate: addItem,
    isPending: isAddingItem,
    error: addItemError,
  } = useMutation({
    mutationFn: addCartItemToCart,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      }),
  })

  const {
    mutate: removeItem,
    isPending: isRemovingItem,
    error: removeItemError,
  } = useMutation({
    mutationFn: removeCartItemFromCart,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      }),
  })

  const {
    mutate: updateItemQuantity,
    isPending: isUpdatingItemQuantity,
    error: updateItemQuantityError,
  } = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItemQuantity({ id, quantity }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart", userId],
      }),
  })

  // Consolidate loading and error states
  const isLoading =
    isLoadingCart || isAddingItem || isRemovingItem || isUpdatingItemQuantity
  const error =
    cartError || addItemError || removeItemError || updateItemQuantityError

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error: error ?? null,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCart }
