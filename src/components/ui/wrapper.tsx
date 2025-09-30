import { cn } from "@/lib/utils"

type WrapperProps = {
  children: React.ReactNode
  className?: string
}

function Wrapper({ children, className }: WrapperProps) {
  return (
    <div className={cn("max-w-[1200px] mx-auto", className)}>{children}</div>
  )
}

export default Wrapper
