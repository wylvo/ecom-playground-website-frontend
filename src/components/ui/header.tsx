import Navigation from "@/components/ui/navigation"
import SignOut from "@/features/auth/components/sign-out"
// import NavigationVariants from "@/components/ui/navigation_variants"

function Header() {
  return (
    <header className="flex items-center justify-center">
      <Navigation />
      {/* <NavigationVariants /> */}
      <SignOut />
    </header>
  )
}

export default Header
