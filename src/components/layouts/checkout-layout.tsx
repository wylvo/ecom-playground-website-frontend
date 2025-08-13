import { HeadContent } from "@tanstack/react-router"

import Header from "../ui/header"
import ToasterDefaults from "@/components/ui/toaster-defaults"

type CheckoutLayoutProps = {
  children: React.ReactNode
}

function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <>
      <HeadContent />
      <Header />
      <main>{children}</main>
      <ToasterDefaults />
    </>
  )
}

export default CheckoutLayout
