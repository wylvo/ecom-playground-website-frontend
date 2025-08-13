import { HeadContent } from "@tanstack/react-router"
import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"
import ToasterDefaults from "@/components/ui/toaster-defaults"

type AppLayoutProps = {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <HeadContent />
      <Header />
      <hr />
      <aside></aside>
      <main>{children}</main>
      <ToasterDefaults />
      <Footer />
    </>
  )
}

export default AppLayout
