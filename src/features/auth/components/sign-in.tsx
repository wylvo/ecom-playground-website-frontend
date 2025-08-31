import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "@tanstack/react-router"

import AuthLayout from "@/components/layouts/auth-layout"
import SignInForm from "./sign-in-form"

function SignIn() {
  return (
    <AuthLayout>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/{-$locale}"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Brand Name Inc.
          </Link>
          <SignInForm />
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignIn
