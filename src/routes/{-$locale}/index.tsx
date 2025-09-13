import { createFileRoute } from "@tanstack/react-router"
import Home from "@/components/ui/home"

export const Route = createFileRoute("/{-$locale}/")({
  component: Home,
})
