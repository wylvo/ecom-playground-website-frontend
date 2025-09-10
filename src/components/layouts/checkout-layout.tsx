import Header from "../ui/header"

type CheckoutLayoutProps = {
  children: React.ReactNode
}

function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default CheckoutLayout
