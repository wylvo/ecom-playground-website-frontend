import Navigation from "@/components/ui/navigation"
import Logout from "@/features/auth/components/logout"
// import NavigationVariants from "@/components/ui/navigation_variants"

function Header() {
  return (
    <header className="flex items-center justify-center">
      <Navigation />
      {/* <NavigationVariants /> */}
      <Logout />
    </header>
  )
}

export default Header
