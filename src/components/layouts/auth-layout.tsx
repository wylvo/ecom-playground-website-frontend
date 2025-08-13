import { HeadContent } from "@tanstack/react-router"
import ToasterDefaults from "@/components/ui/toaster-defaults"

type AuthLayoutProps = {
  children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <HeadContent />
      <main>{children}</main>
      <ToasterDefaults />
    </>
  )
}

export default AuthLayout
