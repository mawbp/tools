import { useState, useEffect } from "react"
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate, Link } from "react-router-dom"
import {
  LayoutDashboard,
  QrCode,
  ChevronDown,
  ChevronRight,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Dna,
  KeyRound,
  Hash,
  Binary,
  Braces,
  Key,
  Regex,
  Database,
  Palette,
  FileText
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"

// Import pages
import { LandingPage } from "@/pages/LandingPage"
import { QRCodeGenerator } from "@/pages/QRCodeGenerator"
import { UUIDGenerator } from "@/pages/UUIDGenerator"
import { AboutPage } from "@/pages/AboutPage"
import { ComingSoonPage } from "@/pages/ComingSoonPage"

export function App() {
  const [openGroups, setOpenGroups] = useState<string[]>(["Generators", "Utilities"])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const menuGroups = [
    {
      group: "Overview",
      items: [
        { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    },
    {
      group: "Generators",
      items: [
        { id: "qrcode", path: "/tools/qrcode", label: "QRCode", icon: QrCode },
        { id: "uuid", path: "/tools/uuid", label: "UUID Generator", icon: Dna },
        { id: "password", path: "/tools/password", label: "Password Gen", icon: KeyRound },
        { id: "hash", path: "/tools/hash", label: "Hash Generator", icon: Hash },
      ]
    },
    {
      group: "Utilities",
      items: [
        { id: "base64", path: "/tools/base64", label: "Base64 Encoder", icon: Binary },
        { id: "json", path: "/tools/json", label: "JSON Formatter", icon: Braces },
        { id: "jwt", path: "/tools/jwt", label: "JWT Decoder", icon: Key },
        { id: "regex", path: "/tools/regex", label: "Regex Tester", icon: Regex },
        { id: "sql", path: "/tools/sql", label: "SQL Formatter", icon: Database },
        { id: "color", path: "/tools/color", label: "Color Picker", icon: Palette },
        { id: "markdown", path: "/tools/markdown", label: "Markdown Editor", icon: FileText },
      ]
    }
  ]

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    )
  }

  useEffect(() => {
    setIsSidebarOpen(false)
    menuGroups.forEach(group => {
      if (group.items.some(item => location.pathname.startsWith(item.path))) {
        setOpenGroups(prev => prev.includes(group.group) ? prev : [...prev, group.group])
      }
    })
  }, [location.pathname])

  if (location.pathname === "/") {
    return <LandingPage onStart={() => navigate("/dashboard")} />
  }

  return (
    <div className="flex flex-col md:flex-row min-h-svh bg-background text-foreground transition-colors duration-300">
      <div className="flex md:hidden items-center justify-between p-4 bg-secondary-background border-b-4 border-border sticky top-0 z-30 shadow-[0_2px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-base border-2 border-border bg-background hover:bg-main hover:text-main-foreground transition-all cursor-pointer">
            <Menu className="size-4" />
          </button>
          <Link to="/" className="font-heading font-black text-lg tracking-tight hover:opacity-80 transition-opacity">MyTools 🛠️</Link>
        </div>
        <button
          onClick={() => {
            const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
            setTheme(isDark ? "light" : "dark")
          }}
          className="p-2 rounded-base border-2 bg-secondary-background border-border text-foreground/80 flex-shrink-0 hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow hover:bg-main hover:text-main-foreground transition-all cursor-pointer"
        >
          {theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? <Sun className="size-4" />
            : <Moon className="size-4" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-overlay/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`flex-col w-72 md:w-64 bg-secondary-background border-r-4 border-border p-6 h-svh fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 flex ${isSidebarOpen ? "translate-x-0 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] md:shadow-none" : "-translate-x-full md:shadow-none"}`}>
        <div className="flex items-center justify-between border-b-4 border-border pb-4 shrink-0 mb-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsSidebarOpen(false)}>
            <div className="bg-main text-main-foreground size-8 rounded-base border-2 border-border shadow-[2px_2px_0px_var(--border)] flex items-center justify-center font-black">:D</div>
            <span className="font-heading font-black text-xl tracking-tight">MyTools   🛠️</span>
          </Link>
          <button className="md:hidden p-2 rounded-base border-2 border-border bg-background hover:bg-main hover:text-main-foreground transition-colors cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 no-scrollbar pb-6">
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group) => {
              const isOpen = openGroups.includes(group.group)
              return (
                <div key={group.group} className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="flex items-center justify-between w-full text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 hover:text-foreground transition-colors cursor-pointer"
                  >
                    <span>{group.group}</span>
                    {isOpen ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-2">
                      {group.items.map((tab) => (
                        <NavLink
                          key={tab.id}
                          to={tab.path}
                          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-base text-sm font-bold border-2 transition-all cursor-pointer ${isActive
                            ? "bg-main text-main-foreground border-border shadow-shadow translate-x-reverseBoxShadowX translate-y-reverseBoxShadowY"
                            : "bg-secondary-background border-border text-foreground/80 hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow hover:bg-main hover:text-main-foreground"
                            }`}
                        >
                          <tab.icon className="size-4" />
                          <span>{tab.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
        <div className="space-y-4 border-t-4 border-border pt-4 shrink-0 mt-2">
          <Link to="/about" className="flex items-center gap-3 bg-background border-2 border-border p-2 rounded-base shadow-[2px_2px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-main hover:text-main-foreground transition-all cursor-pointer group">
            <User className="size-4" />
            {/* <span className="text-xl group-hover:scale-110 transition-transform">👥</span> */}
            <div className="min-w-0">
              <p className="font-bold text-xs truncate">About Us</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase group-hover:text-main-foreground/80">Project & Team</p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <div className="flex flex-col gap-6 max-w-5xl">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight">Dashboard 🚀</h1>
                <p className="text-muted-foreground font-medium mt-1">Select a developer tool below to get started.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  to="/tools/uuid"
                  className="bg-secondary-background border-4 border-border p-6 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="bg-main text-main-foreground p-3 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Dna className="size-6" />
                    </div>
                    <span className="bg-chart-4 text-main-foreground text-[10px] font-black uppercase px-2 py-0.5 rounded border border-border">
                      Ready
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg group-hover:text-main transition-colors">UUID Generator</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Generate UUID v4, v7, v1 in bulk & validate any UUID format.</p>
                  </div>
                </Link>

                <Link
                  to="/tools/qrcode"
                  className="bg-secondary-background border-4 border-border p-6 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="bg-main text-main-foreground p-3 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <QrCode className="size-6" />
                    </div>
                    <span className="bg-chart-4 text-main-foreground text-[10px] font-black uppercase px-2 py-0.5 rounded border border-border">
                      Ready
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg group-hover:text-main transition-colors">Code / QR Generator</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Create QR Codes, Code128, and DataMatrix with custom colors & logo.</p>
                  </div>
                </Link>
              </div>
            </div>
          } />
          <Route path="/tools/qrcode" element={<QRCodeGenerator />} />
          <Route path="/tools/uuid" element={<UUIDGenerator />} />
          <Route path="/tools/:toolId" element={<ComingSoonPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
