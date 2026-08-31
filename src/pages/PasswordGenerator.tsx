import { useState, useEffect, useCallback } from "react"
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  ShieldX
} from "lucide-react"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState<{ label: string, score: number, color: string }>({ label: "Weak", score: 0, color: "text-red-500" })

  const generatePassword = useCallback(() => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

    if (charset === "") {
      setPassword("")
      return
    }

    let newPassword = ""
    // Ensure cryptographically secure random generation if possible
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let i = 0; i < length; i++) {
        newPassword += charset[array[i] % charset.length]
      }
    } else {
      // Fallback
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        newPassword += charset[randomIndex]
      }
    }
    setPassword(newPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const calculateStrength = useCallback((pwd: string) => {
    let score = 0
    if (pwd.length > 8) score += 1
    if (pwd.length > 12) score += 1
    if (pwd.length >= 16) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 3 || pwd.length < 8) {
      setStrength({ label: "Weak", score, color: "text-red-500" })
    } else if (score <= 5) {
      setStrength({ label: "Medium", score, color: "text-yellow-500" })
    } else {
      setStrength({ label: "Strong", score, color: "text-green-500" })
    }
  }, [])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  useEffect(() => {
    calculateStrength(password)
  }, [password, calculateStrength])

  const copyToClipboard = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy password", err)
    }
  }

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    // Prevent unchecking the last option
    const activeCount = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length
    if (value && activeCount === 1) return
    setter(!value)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight flex items-center gap-3">
          <KeyRound className="size-8 md:size-10 text-main" />
          Password Generator
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Generate secure, random passwords with custom requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-5">
            <h2 className="font-heading font-black text-xl border-b-4 border-border pb-3 flex items-center gap-2">
              <Sliders className="size-5 text-main" />
              Configuration
            </h2>

            {/* Length */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-sm">Password Length</label>
                <span className="font-mono font-black text-sm bg-main/20 px-2 py-0.5 rounded border border-border">
                  {length}
                </span>
              </div>
              <div className="flex gap-2">
                {[8, 12, 16, 24, 32].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`flex-1 py-1.5 rounded-base border-2 border-border font-bold text-xs transition-all cursor-pointer ${
                      length === l
                        ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-background hover:bg-main/20"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-main cursor-pointer mt-1"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { label: "Uppercase (A-Z)", state: includeUppercase, setter: setIncludeUppercase },
                { label: "Lowercase (a-z)", state: includeLowercase, setter: setIncludeLowercase },
                { label: "Numbers (0-9)", state: includeNumbers, setter: setIncludeNumbers },
                { label: "Symbols (!@#$)", state: includeSymbols, setter: setIncludeSymbols },
              ].map((opt) => (
                <div key={opt.label} className="flex items-center justify-between p-3 bg-background border-2 border-border rounded-base hover:border-main transition-colors cursor-pointer" onClick={() => handleToggle(opt.setter, opt.state)}>
                  <span className="font-bold text-sm select-none">{opt.label}</span>
                  <button
                    type="button"
                    className={`w-12 h-6 rounded-full border-2 border-border p-0.5 transition-colors cursor-pointer flex items-center ${
                      opt.state ? "bg-main justify-end" : "bg-muted-foreground/30 justify-start"
                    }`}
                  >
                    <div className="size-4 rounded-full bg-foreground border border-border shadow-sm" />
                  </button>
                </div>
              ))}
            </div>

            {/* Regenerate Action Button */}
            <button
              type="button"
              onClick={generatePassword}
              className="w-full bg-main text-main-foreground border-4 border-border p-3.5 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black outline-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-base mt-2"
            >
              <RefreshCw className="size-5" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full overflow-hidden">
            <div className="bg-background border-b-4 border-border p-4 flex items-center justify-between shrink-0">
              <h2 className="font-heading font-black text-xl flex items-center gap-2">
                Generated Password
              </h2>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary-background border-2 border-border rounded-base font-bold text-xs">
                    {strength.label === "Weak" && <ShieldX className={`size-4 ${strength.color}`} />}
                    {strength.label === "Medium" && <ShieldAlert className={`size-4 ${strength.color}`} />}
                    {strength.label === "Strong" && <ShieldCheck className={`size-4 ${strength.color}`} />}
                    <span className={strength.color}>{strength.label}</span>
                 </div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center gap-6 relative min-h-[300px]">
              <div className="w-full relative group">
                 <div className="absolute inset-0 bg-main translate-x-[4px] translate-y-[4px] rounded-base border-4 border-border"></div>
                 <div className="relative bg-background border-4 border-border rounded-base p-6 md:p-10 flex flex-col items-center justify-center gap-4 transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                   <p className="font-mono text-2xl md:text-4xl text-center break-all select-all selection:bg-main selection:text-main-foreground w-full">
                     {password}
                   </p>
                 </div>
              </div>

              <div className="flex gap-4 w-full max-w-md mt-4">
                <button
                  onClick={copyToClipboard}
                  disabled={!password}
                  className="flex-1 bg-background border-4 border-border p-4 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 font-black text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {copied ? (
                    <>
                      <Check className="size-6 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-6" />
                      Copy Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
