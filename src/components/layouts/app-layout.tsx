import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"

type AppLayoutProps = {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <hr />
      <aside></aside>
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default AppLayout
