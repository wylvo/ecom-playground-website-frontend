import AppLayout from "@/components/layouts/app-layout"
import Home from "@/components/ui/home"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <AppLayout>
        <Home />
      </AppLayout>
    )
  },
})
