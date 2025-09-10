type AuthLayoutProps = {
  children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}

export default AuthLayout
