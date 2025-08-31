import ButtonWithIcon from "@/components/ui/button-with-icon"
import { useSupabaseAuth } from "../contexts/supabase-auth-context"
import { LogOut } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

function SignOut() {
  const { signOut, user, isAuthenticated } = useSupabaseAuth()
  const navigate = useNavigate()

  const isAnonymous = user?.is_anonymous
  const isAuthenticatedUser = isAuthenticated && !isAnonymous

  async function handleSignout() {
    signOut(void undefined, {
      onSuccess: () => {
        toast.success("You have successfully signed out")
        navigate({ to: "/" })
      },
      onError: (error) => {
        console.error(error)
        toast.error("Sign out failed", {
          style: {
            color: "var(--destructive)",
          },
        })
      },
    })
  }

  return (
    <>
      {isAuthenticatedUser && (
        <ButtonWithIcon
          size="sm"
          variant="outline"
          icon={<LogOut />}
          onClick={handleSignout}
        />
      )}
    </>
  )
}

export default SignOut
