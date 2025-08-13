import ButtonWithIcon from "@/components/ui/button-with-icon"
import { useSupabaseAuth } from "../contexts/supabase-auth-context"
import { LogOut } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

function Logout() {
  const supabaseAuth = useSupabaseAuth()
  const navigate = useNavigate()

  const isAnonymous = supabaseAuth.user?.is_anonymous

  return (
    <>
      {supabaseAuth.isAuthenticated && !isAnonymous && (
        <ButtonWithIcon
          size="sm"
          variant="outline"
          icon={<LogOut />}
          onClick={() => {
            supabaseAuth.logout()
            navigate({ to: "/" })
          }}
        />
      )}
    </>
  )
}

export default Logout
