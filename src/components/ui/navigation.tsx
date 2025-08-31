import { Link, linkOptions } from "@tanstack/react-router"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/shadcn/navigation-menu"

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
    to: "/{-$locale}/cart",
    label: "Cart",
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
    to: "/{-$locale}/register" as string,
    label: "Register",
  },
  {
    to: "/{-$locale}/sign-in" as string,
    label: "Sign in",
  },
])

function Navigation() {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((linkOption) => {
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
