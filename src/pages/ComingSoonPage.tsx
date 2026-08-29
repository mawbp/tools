import { Construction, ArrowLeft } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function ComingSoonPage() {
  const location = useLocation()
  const toolName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Tool"

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center">
      <div className="bg-chart-3 text-main-foreground size-20 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center animate-bounce">
        <Construction className="size-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight capitalize">
          {toolName}
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          This tool is currently under construction. Check back later!
        </p>
      </div>

      <Link 
        to="/dashboard" 
        className="mt-4 flex items-center gap-2 bg-main text-main-foreground font-bold px-6 py-3 border-2 border-border rounded-base hover:translate-x-[2px] hover:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all uppercase tracking-wider text-sm"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
