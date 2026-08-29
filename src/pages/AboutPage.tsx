import { GitBranch, Users, History, Star } from "lucide-react"

export function AboutPage() {
  const changelog = [
    { version: "v1.1.0", date: "August 2026", desc: "Added QRCode generator tool and UI revamp." },
    { version: "v1.0.0", date: "July 2026", desc: "Initial release with dashboard base." }
  ]

  const contributors = [
    { name: "Super Developer", role: "Creator & Lead" },
    { name: "Open Source Community", role: "Ideas & Feedback" }
  ]

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
          <Users className="size-8 text-main" />
          About This Project
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <div className="bg-secondary-background border-4 border-border p-6 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-heading font-black text-xl mb-4 border-b-4 border-border pb-2 flex items-center gap-2">
              <GitBranch className="size-5" />
              Repository
            </h2>
            <p className="font-medium mb-4 text-muted-foreground">
              MyTools is an open-source collection of developer utilities built with React 19, Tailwind CSS, and Vite.
            </p>
            <a 
              href="https://github.com/example/mytools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-main text-main-foreground font-bold px-4 py-3 border-2 border-border rounded-base hover:translate-x-[2px] hover:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all uppercase tracking-wider text-sm"
            >
              <Star className="size-4" />
              Star on GitHub
            </a>
          </div>

          <div className="bg-secondary-background border-4 border-border p-6 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-heading font-black text-xl mb-4 border-b-4 border-border pb-2 flex items-center gap-2">
              <Users className="size-5" />
              Special Thanks
            </h2>
            <ul className="flex flex-col gap-3">
              {contributors.map((c, i) => (
                <li key={i} className="flex flex-col bg-background p-3 border-2 border-border rounded-base">
                  <span className="font-black text-foreground">{c.name}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{c.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-secondary-background border-4 border-border p-6 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-fit">
          <h2 className="font-heading font-black text-xl mb-4 border-b-4 border-border pb-2 flex items-center gap-2">
            <History className="size-5" />
            Changelog
          </h2>
          <div className="relative border-l-4 border-main ml-4 pl-6 space-y-6">
            {changelog.map((log, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[35px] top-1 h-5 w-5 rounded-full bg-main border-4 border-border" />
                <h3 className="font-black text-lg">{log.version}</h3>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{log.date}</span>
                <p className="mt-2 font-medium bg-background p-3 border-2 border-border rounded-base">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
