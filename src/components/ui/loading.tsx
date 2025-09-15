import { Loader2 } from "lucide-react"

function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader2 className="animate-spin w-4 h-4 md:w-8 md:h-8 lg:w-16 lg:h-16" />
    </div>
  )
}

export default Loading
