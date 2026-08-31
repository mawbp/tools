import { Sparkles, Play, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-300 overflow-hidden select-none animate-fade-in">
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12] transition-opacity" style={{ backgroundImage: `radial-gradient(var(--border) 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }} />
      <div className="absolute top-12 left-12 bg-chart-3 border-2 border-border px-4 py-2.5 rounded-base shadow-shadow rotate-[-6deg] hidden md:flex items-center gap-2 text-sm font-bold text-main-foreground">
        <Sparkles className="size-4 animate-pulse" />
        <span>Welcome!</span>
      </div>
      <div className="absolute bottom-12 right-12 bg-chart-2 border-2 border-border px-4 py-2.5 rounded-base shadow-shadow rotate-[6deg] hidden md:flex items-center gap-2 text-sm font-bold text-main-foreground">
        <Code className="size-4" />
        <span>React 19 + Bun</span>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center bg-secondary-background border-4 border-border p-8 md:p-12 rounded-base shadow-shadow max-w-md w-full text-center transform hover:scale-[1.01] transition-transform duration-200">
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tight text-foreground mb-6 break-words drop-shadow-[3px_3px_0px_var(--border)] leading-none">MyTools</h1>
        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-[280px] font-medium leading-normal flex items-center justify-center">Click start to launch the application.</p>
        <Button size="lg" className="relative font-bold text-base px-8 py-6 group flex items-center gap-2 cursor-pointer" onClick={onStart}>
          <Play className="size-5 group-hover:scale-110 transition-transform" />
          <span>Start</span>
        </Button>
        <div className="mt-8 hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground border-t-2 border-dashed border-border/40 pt-4 w-full justify-center">
          <span>Press</span>
          <kbd className="bg-secondary-background border border-border px-1.5 py-0.5 rounded-sm shadow-[1.5px_1.5px_0px_0px_var(--border)] font-bold text-foreground">D</kbd>
          <span>to toggle dark mode</span>
        </div>
      </div>
    </div>
  )
}
