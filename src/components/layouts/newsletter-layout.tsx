type CheckoutLayoutProps = {
  children: React.ReactNode
}

function NewsletterLayout({ children }: CheckoutLayoutProps) {
  return (
    <>
      <main className="min-h-screen fixed inset-0 flex items-center justify-center flex-col">
        {children}
      </main>
    </>
  )
}

export default NewsletterLayout
