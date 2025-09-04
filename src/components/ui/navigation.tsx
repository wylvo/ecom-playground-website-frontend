import { Link, linkOptions } from "@tanstack/react-router"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/shadcn/navigation-menu"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"

const navLinks = linkOptions([
  {
    to: "/{-$locale}",
    label: "Home",
    activeOptions: { exact: true },
  },
  {
    to: "/{-$locale}/collections",
    label: "Collections",
  },
  {
    to: "/{-$locale}/products",
    label: "Products",
  },
  {
    to: "/{-$locale}/checkout/customer",
    label: "Checkout",
  },
  {
    to: "/{-$locale}/account",
    label: "Account",
  },
  {
    to: "/{-$locale}/cart",
    label: "Cart",
  },
  {
    to: "/{-$locale}/register" as string,
    label: "Register",
  },
  {
    to: "/{-$locale}/sign-in" as string,
    label: "Sign in",
  },
])

function Navigation() {
  const { isAuthenticated, user } = useSupabaseAuth()
  const isAnonymous = user?.is_anonymous

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((linkOption) => {
            if (
              isAuthenticated &&
              !isAnonymous &&
              linkOption.to === "/{-$locale}/sign-in"
            )
              return

            if (
              isAuthenticated &&
              !isAnonymous &&
              linkOption.to === "/{-$locale}/register"
            )
              return

            return (
              <NavigationMenuItem key={linkOption.to}>
                <NavigationMenuLink asChild>
                  <Link
                    //{...linkOption}
                    key={linkOption.to}
                    to={linkOption.to}
                    activeProps={{ className: "font-bold" }}
                  >
                    {linkOption.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default Navigation
