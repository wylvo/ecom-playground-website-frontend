import AppLayout from "../../../components/layouts/app-layout"

interface AccountProps {
  children: React.ReactNode
}

function Account({ children }: AccountProps) {
  return <AppLayout>{children}</AppLayout>
}

export default Account
