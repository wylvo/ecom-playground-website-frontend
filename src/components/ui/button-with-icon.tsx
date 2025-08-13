import { Button } from "@/components/ui/shadcn/button"
import type { ComponentPropsWithoutRef } from "react"

type ButtonProps = ComponentPropsWithoutRef<typeof Button>

export type ButtonWithIconProps = {
  children?: React.ReactNode
  icon: React.ReactNode
  iconPosition?: "after" | "before"
} & ButtonProps

function ButtonWithIcon({
  children,
  icon,
  iconPosition = "before",
  ...props
}: ButtonWithIconProps) {
  return (
    <Button {...props}>
      {iconPosition === "before" && icon}
      {children}
      {iconPosition === "after" && icon}
    </Button>
  )
}

export default ButtonWithIcon
