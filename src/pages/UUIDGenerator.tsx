import { useState, useEffect } from "react"
import {
  Dna,
  Copy,
  Check,
  RefreshCw,
  Search,
  Sparkles,
  Sliders,
  CheckCircle2,
  XCircle,
  Clock,
  FileJson,
  FileSpreadsheet,
  FileText,
} from "lucide-react"

type UUIDVersion = "v4" | "v7" | "v1" | "nil"
type UUIDFormat = "standard" | "no-hyphens" | "braces" | "quotes" | "json-array"

// Helper function to generate UUID v4
function generateV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 1 (RFC 4122)
  return bytesToHex(bytes)
}

// Helper function to generate UUID v7 (Timestamp + Random)
function generateV7(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  const timestamp = Date.now()
  // 48-bit timestamp
  bytes[0] = (timestamp / 0x10000000000) & 0xff
  bytes[1] = (timestamp / 0x100000000) & 0xff
  bytes[2] = (timestamp / 0x1000000) & 0xff
  bytes[3] = (timestamp / 0x10000) & 0xff
  bytes[4] = (timestamp / 0x100) & 0xff
  bytes[5] = timestamp & 0xff

  bytes[6] = (bytes[6] & 0x0f) | 0x70 // Version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 1 (RFC 4122)

  return bytesToHex(bytes)
}

// Helper function to generate UUID v1 (Gregorian timestamp-based)
function generateV1(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // 100-nanosecond intervals since Gregorian calendar reform (15 Oct 1582)
  const gregorianOffset = 122192928000000000n
  const now = BigInt(Date.now()) * 10000n + gregorianOffset

  const timeLow = Number(now & 0xffffffffn)
  const timeMid = Number((now >> 32n) & 0xffffn)
  const timeHi = Number((now >> 48n) & 0x0fffn)

  bytes[0] = (timeLow >>> 24) & 0xff
  bytes[1] = (timeLow >>> 16) & 0xff
  bytes[2] = (timeLow >>> 8) & 0xff
  bytes[3] = timeLow & 0xff

  bytes[4] = (timeMid >>> 8) & 0xff
  bytes[5] = timeMid & 0xff

  bytes[6] = ((timeHi >>> 8) & 0x0f) | 0x10 // Version 1
  bytes[7] = timeHi & 0xff

  bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 1

  return bytesToHex(bytes)
}

function bytesToHex(bytes: Uint8Array): string {
  const hex: string[] = []
  for (let i = 0; i < 16; i++) {
    hex.push(bytes[i].toString(16).padStart(2, "0"))
  }
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-")
}

function formatUUID(
  rawUuid: string,
  uppercase: boolean,
  format: UUIDFormat
): string {
  let val = rawUuid.toLowerCase()

  if (format === "no-hyphens") {
    val = val.replace(/-/g, "")
  }

  if (uppercase) {
    val = val.toUpperCase()
  }

  if (format === "braces") {
    return `{${val}}`
  }
  if (format === "quotes") {
    return `"${val}"`
  }

  return val
}

export function UUIDGenerator() {
  const [activeTab, setActiveTab] = useState<"generator" | "inspector">("generator")
  const [version, setVersion] = useState<UUIDVersion>("v4")
  const [quantity, setQuantity] = useState<number>(5)
  const [uppercase, setUppercase] = useState<boolean>(false)
  const [format, setFormat] = useState<UUIDFormat>("standard")
  const [uuids, setUuids] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState<boolean>(false)
  const [isRotating, setIsRotating] = useState<boolean>(false)

  // Inspector states
  const [inspectInput, setInspectInput] = useState<string>("")

  const generateUUIDs = () => {
    setIsRotating(true)
    setTimeout(() => setIsRotating(false), 500)

    const list: string[] = []
    for (let i = 0; i < quantity; i++) {
      let raw = ""
      if (version === "v4") raw = generateV4()
      else if (version === "v7") raw = generateV7()
      else if (version === "v1") raw = generateV1()
      else if (version === "nil") raw = "00000000-0000-0000-0000-000000000000"

      list.push(formatUUID(raw, uppercase, format))
    }
    setUuids(list)
  }

  useEffect(() => {
    generateUUIDs()
  }, [version, quantity, uppercase, format])

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text)
    if (typeof index === "number") {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } else {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    }
  }

  const handleCopyAll = () => {
    if (format === "json-array") {
      copyToClipboard(JSON.stringify(uuids, null, 2))
    } else {
      copyToClipboard(uuids.join("\n"))
    }
  }

  const downloadFile = (fileType: "txt" | "json" | "csv") => {
    let content = ""
    let mimeType = "text/plain"
    let filename = `uuid-${version}-${Date.now()}`

    if (fileType === "json") {
      content = JSON.stringify({ version, count: uuids.length, data: uuids }, null, 2)
      mimeType = "application/json"
      filename += ".json"
    } else if (fileType === "csv") {
      content = "index,uuid\n" + uuids.map((u, i) => `${i + 1},${u}`).join("\n")
      mimeType = "text/csv"
      filename += ".csv"
    } else {
      content = uuids.join("\n")
      mimeType = "text/plain"
      filename += ".txt"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // UUID Inspector parsing
  const inspectUUID = (input: string) => {
    const cleaned = input.trim().replace(/[{}"']/g, "")
    const standardRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f]{4})-([0-9a-f]{4})-[0-9a-f]{12}$/i
    const noHyphenRegex = /^[0-9a-f]{32}$/i

    let normalized = cleaned
    let isValid = false

    if (standardRegex.test(cleaned)) {
      isValid = true
      normalized = cleaned.toLowerCase()
    } else if (noHyphenRegex.test(cleaned)) {
      isValid = true
      normalized = `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`.toLowerCase()
    }

    if (!isValid) {
      return {
        isValid: false,
        error: "Invalid UUID format. Standard format: 8-4-4-4-12 hex characters.",
      }
    }

    const versionNibble = parseInt(normalized.charAt(14), 16)
    const variantNibble = parseInt(normalized.charAt(19), 16)

    let versionName = `Version ${versionNibble}`
    if (normalized === "00000000-0000-0000-0000-000000000000") {
      versionName = "Nil UUID (All zeros)"
    } else if (versionNibble === 4) {
      versionName = "v4 (Randomly generated)"
    } else if (versionNibble === 7) {
      versionName = "v7 (Unix Timestamp + Random)"
    } else if (versionNibble === 1) {
      versionName = "v1 (Gregorian Time-based)"
    } else if (versionNibble === 5) {
      versionName = "v5 (SHA-1 namespace name)"
    } else if (versionNibble === 3) {
      versionName = "v3 (MD5 namespace name)"
    }

    let variantName = "Unknown"
    if ((variantNibble & 0x8) === 0x0) variantName = "NCS Backward Compatibility"
    else if ((variantNibble & 0xc) === 0x8) variantName = "RFC 4122 / ISO/IEC 9834-8 (Standard)"
    else if ((variantNibble & 0xe) === 0xc) variantName = "Microsoft Corporation (COM GUID)"
    else variantName = "Reserved for future definition"

    let extractedTimestamp: string | null = null

    // Decode timestamp if v7
    if (versionNibble === 7) {
      const timeHex = normalized.replace(/-/g, "").slice(0, 12)
      const ms = parseInt(timeHex, 16)
      if (!isNaN(ms)) {
        extractedTimestamp = new Date(ms).toISOString() + ` (${new Date(ms).toLocaleString()})`
      }
    }

    return {
      isValid: true,
      normalized,
      version: versionName,
      versionNumber: versionNibble,
      variant: variantName,
      timestamp: extractedTimestamp,
      hasHyphens: input.includes("-"),
    }
  }

  const inspectorResult = inspectInput.trim() ? inspectUUID(inspectInput) : null

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-main text-main-foreground p-2 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Dna className="size-7" />
            </div>
            <h1 className="text-3xl font-heading font-black tracking-tight">UUID Generator</h1>
          </div>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Generate cryptographically strong, unique identifiers (UUID v4, v7, v1, Nil) in bulk.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-secondary-background border-2 border-border rounded-base p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 text-sm font-bold rounded-base transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "generator"
                ? "bg-main text-main-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-foreground hover:bg-main/20"
            }`}
          >
            <Sparkles className="size-4" />
            Generator
          </button>
          <button
            onClick={() => setActiveTab("inspector")}
            className={`px-4 py-2 text-sm font-bold rounded-base transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "inspector"
                ? "bg-main text-main-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "text-foreground hover:bg-main/20"
            }`}
          >
            <Search className="size-4" />
            Inspector & Validator
          </button>
        </div>
      </div>

      {activeTab === "generator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-5">
              <h2 className="font-heading font-black text-xl border-b-4 border-border pb-3 flex items-center gap-2">
                <Sliders className="size-5 text-main" />
                Configuration
              </h2>

              {/* Version Selector */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">UUID Version</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVersion("v4")}
                    className={`p-2.5 rounded-base border-2 border-border font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                      version === "v4"
                        ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-background hover:bg-main/20"
                    }`}
                  >
                    v4 (Random)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion("v7")}
                    className={`p-2.5 rounded-base border-2 border-border font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                      version === "v7"
                        ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-background hover:bg-main/20"
                    }`}
                  >
                    v7 (Time-ordered)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion("v1")}
                    className={`p-2.5 rounded-base border-2 border-border font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                      version === "v1"
                        ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-background hover:bg-main/20"
                    }`}
                  >
                    v1 (Gregorian)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion("nil")}
                    className={`p-2.5 rounded-base border-2 border-border font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer ${
                      version === "nil"
                        ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-background hover:bg-main/20"
                    }`}
                  >
                    Nil (Empty)
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-sm">Quantity</label>
                  <span className="font-mono font-black text-sm bg-main/20 px-2 py-0.5 rounded border border-border">
                    {quantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 5, 10, 25, 50].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`flex-1 py-1.5 rounded-base border-2 border-border font-bold text-xs transition-all cursor-pointer ${
                        quantity === q
                          ? "bg-main text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-background hover:bg-main/20"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-main cursor-pointer mt-1"
                />
              </div>

              {/* Format Options */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Format Style</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as UUIDFormat)}
                  className="w-full bg-background border-2 border-border p-2.5 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium outline-none focus:ring-2 focus:ring-main focus:border-main cursor-pointer"
                >
                  <option value="standard">Standard (with hyphens)</option>
                  <option value="no-hyphens">No hyphens (raw hex)</option>
                  <option value="braces">Curly braces {"{ ... }"}</option>
                  <option value="quotes">Quotes " ... "</option>
                  <option value="json-array">JSON Array</option>
                </select>
              </div>

              {/* Case Toggle */}
              <div className="flex items-center justify-between p-3 bg-background border-2 border-border rounded-base">
                <span className="font-bold text-sm">Uppercase (A-F)</span>
                <button
                  type="button"
                  onClick={() => setUppercase(!uppercase)}
                  className={`w-12 h-6 rounded-full border-2 border-border p-0.5 transition-colors cursor-pointer flex items-center ${
                    uppercase ? "bg-main justify-end" : "bg-muted-foreground/30 justify-start"
                  }`}
                >
                  <div className="size-4 rounded-full bg-foreground border border-border shadow-sm" />
                </button>
              </div>

              {/* Regenerate Action Button */}
              <button
                type="button"
                onClick={generateUUIDs}
                className="w-full bg-main text-main-foreground border-4 border-border p-3.5 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black outline-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-base mt-2"
              >
                <RefreshCw className={`size-5 ${isRotating ? "animate-spin" : ""}`} />
                Regenerate
              </button>
            </div>

            {/* Quick Info Box */}
            <div className="bg-background border-2 border-border p-4 rounded-base text-xs space-y-2">
              <div className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                <Clock className="size-4 text-main" />
                Version Guide
              </div>
              <p className="text-muted-foreground">
                <strong>v4:</strong> Universally unique random values. Best for most IDs.
              </p>
              <p className="text-muted-foreground">
                <strong>v7:</strong> Lexicographically sortable by creation timestamp. Ideal for database primary keys.
              </p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col h-full">
              {/* Output Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-xl">Generated UUIDs</span>
                  <span className="bg-chart-3 text-main-foreground text-xs font-black px-2.5 py-0.5 rounded-base border-2 border-border">
                    {uuids.length} {uuids.length === 1 ? "UUID" : "UUIDs"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    className="inline-flex items-center gap-1.5 bg-background border-2 border-border px-3 py-2 rounded-base text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Copy all to clipboard"
                  >
                    {copiedAll ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                    {copiedAll ? "Copied All!" : "Copy All"}
                  </button>

                  <button
                    onClick={() => downloadFile("txt")}
                    className="inline-flex items-center gap-1.5 bg-background border-2 border-border px-3 py-2 rounded-base text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Download as .txt"
                  >
                    <FileText className="size-4" />
                    TXT
                  </button>

                  <button
                    onClick={() => downloadFile("json")}
                    className="inline-flex items-center gap-1.5 bg-background border-2 border-border px-3 py-2 rounded-base text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Download as .json"
                  >
                    <FileJson className="size-4" />
                    JSON
                  </button>

                  <button
                    onClick={() => downloadFile("csv")}
                    className="inline-flex items-center gap-1.5 bg-background border-2 border-border px-3 py-2 rounded-base text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    title="Download as .csv"
                  >
                    <FileSpreadsheet className="size-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* UUID List Display */}
              <div className="flex-1 overflow-y-auto max-h-[580px] space-y-2.5 pr-1">
                {uuids.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between bg-background border-2 border-border p-3 rounded-base hover:border-main transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-mono text-xs font-bold text-muted-foreground w-6 text-right select-none">
                        {idx + 1}.
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold select-all tracking-wide truncate text-foreground">
                        {item}
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item, idx)}
                      className={`p-2 rounded-base border-2 border-border text-xs font-bold transition-all cursor-pointer shrink-0 ml-2 ${
                        copiedIndex === idx
                          ? "bg-green-500 text-white shadow-none"
                          : "bg-secondary-background hover:bg-main hover:text-main-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      }`}
                      title="Copy this UUID"
                    >
                      {copiedIndex === idx ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Inspector / Validator Tab */
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 space-y-6">
            <h2 className="font-heading font-black text-2xl border-b-4 border-border pb-3 flex items-center gap-2">
              <Search className="size-6 text-main" />
              UUID Inspector & Validator
            </h2>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Paste any UUID string</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inspectInput}
                  onChange={(e) => setInspectInput(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000 or without hyphens"
                  className="flex-1 bg-background border-2 border-border p-3.5 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-sm outline-none focus:ring-2 focus:ring-main focus:border-main"
                />
                {inspectInput && (
                  <button
                    type="button"
                    onClick={() => setInspectInput("")}
                    className="bg-background border-2 border-border px-4 font-bold rounded-base hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground font-semibold">Quick test examples:</span>
                <button
                  type="button"
                  onClick={() => setInspectInput(generateV4())}
                  className="text-xs font-mono text-main underline cursor-pointer"
                >
                  Random v4
                </button>
                <button
                  type="button"
                  onClick={() => setInspectInput(generateV7())}
                  className="text-xs font-mono text-main underline cursor-pointer"
                >
                  v7 Timestamp
                </button>
                <button
                  type="button"
                  onClick={() => setInspectInput("00000000-0000-0000-0000-000000000000")}
                  className="text-xs font-mono text-main underline cursor-pointer"
                >
                  Nil
                </button>
              </div>
            </div>

            {/* Analysis Result */}
            {inspectorResult && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div
                  className={`p-4 rounded-base border-2 flex items-center gap-3 ${
                    inspectorResult.isValid
                      ? "bg-green-100 border-green-600 text-green-950 dark:bg-green-950/40 dark:text-green-200 dark:border-green-500"
                      : "bg-red-100 border-red-600 text-red-950 dark:bg-red-950/40 dark:text-red-200 dark:border-red-500"
                  }`}
                >
                  {inspectorResult.isValid ? (
                    <CheckCircle2 className="size-6 text-green-600 shrink-0" />
                  ) : (
                    <XCircle className="size-6 text-red-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-black text-base">
                      {inspectorResult.isValid ? "Valid UUID Detected" : "Invalid UUID"}
                    </h3>
                    <p className="text-xs font-medium opacity-90">
                      {inspectorResult.isValid
                        ? "This string matches the canonical RFC 4122 / RFC 9562 UUID specification."
                        : inspectorResult.error}
                    </p>
                  </div>
                </div>

                {inspectorResult.isValid && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background border-2 border-border p-4 rounded-base space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Normalized UUID</div>
                      <div className="font-mono text-sm font-black select-all text-foreground">
                        {inspectorResult.normalized}
                      </div>
                    </div>

                    <div className="bg-background border-2 border-border p-4 rounded-base space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Version</div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-2">
                        <span className="bg-main text-main-foreground px-2 py-0.5 rounded text-xs font-black">
                          {inspectorResult.versionNumber !== undefined ? `v${inspectorResult.versionNumber}` : "N/A"}
                        </span>
                        <span>{inspectorResult.version}</span>
                      </div>
                    </div>

                    <div className="bg-background border-2 border-border p-4 rounded-base space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Variant</div>
                      <div className="font-bold text-sm text-foreground">{inspectorResult.variant}</div>
                    </div>

                    <div className="bg-background border-2 border-border p-4 rounded-base space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Decoded Timestamp</div>
                      <div className="font-mono text-xs font-bold text-foreground">
                        {inspectorResult.timestamp ? (
                          inspectorResult.timestamp
                        ) : (
                          <span className="text-muted-foreground font-normal">Not time-encoded (random/name-based)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UUIDGenerator
