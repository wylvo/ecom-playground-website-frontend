import ReactDOM from "react-dom/client"
import { StrictMode } from "react"
import { RouterProvider } from "@tanstack/react-router"

import { router } from "@/router"
import { useValidateLocale } from "@/hooks/useValidateLocale"
import { defaultLocale } from "@/types/locale"
import "./index.css"
import {
  SupabaseAuthProvider,
  useSupabaseAuth,
} from "./features/auth/contexts/supabase-auth-context"

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export function App() {
  const locale = useValidateLocale(defaultLocale)
  const auth = useSupabaseAuth()

  return <RouterProvider router={router} context={{ auth, locale }} />
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </StrictMode>,
  )
}
