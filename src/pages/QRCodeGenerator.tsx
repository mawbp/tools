import { useState, useRef } from "react"
import { QrCode, Download, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"

export function QRCodeGenerator() {
  const [type, setType] = useState("qrcode")
  const [content, setContent] = useState("")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [ecl, setEcl] = useState("M")
  const [logo, setLogo] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) {
      setError("Content is required")
      return
    }

    setLoading(true)
    setError(null)
    setResultImage(null)

    const formData = new FormData()
    formData.append("type", type)
    formData.append("content", content)
    formData.append("size", size.toString())

    if (type === "qrcode") {
      formData.append("fg_color", fgColor)
      formData.append("bg_color", bgColor)
      formData.append("ecl", ecl)
      if (logo) {
        formData.append("logo", logo)
      }
    }

    try {
      // Assuming Vite proxy is configured to route /api to the backend
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.error || `Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setResultImage(imageUrl)
    } catch (err: any) {
      setError(err.message || "Failed to generate code")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return
    const a = document.createElement("a")
    a.href = resultImage
    a.download = `${type}-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
          <QrCode className="size-8 text-main" />
          Code Generator
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Code Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium outline-none focus:ring-2 focus:ring-main focus:border-main transition-all appearance-none"
              >
                <option value="qrcode">QR Code</option>
                <option value="code128">Code 128 (Barcode)</option>
                <option value="datamatrix">DataMatrix (Barcode)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Content (Text or URL) <span className="text-red-500">*</span></label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter text or URL to encode..."
                rows={4}
                className="w-full bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium outline-none focus:ring-2 focus:ring-main focus:border-main transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Size (px)</label>
              <input
                type="number"
                min="50"
                max="2000"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium outline-none focus:ring-2 focus:ring-main focus:border-main transition-all"
              />
              <span className="text-xs text-muted-foreground font-semibold">For code128, this sets the width.</span>
            </div>

            {type === "qrcode" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 border-2 border-dashed border-border/50 rounded-base bg-background/50">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Foreground Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-12 w-12 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      title="Hex color code, e.g. #000000 or #FFF"
                      className="flex-1 bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-sm outline-none focus:ring-2 focus:ring-main focus:border-main transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-12 w-12 rounded-base border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      title="Hex color code, e.g. #FFFFFF or #FFF"
                      className="flex-1 bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-sm outline-none focus:ring-2 focus:ring-main focus:border-main transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Error Correction Level</label>
                  <select
                    value={ecl}
                    onChange={(e) => setEcl(e.target.value)}
                    className="w-full bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium outline-none focus:ring-2 focus:ring-main focus:border-main transition-all appearance-none"
                  >
                    <option value="L">L (7% recovery)</option>
                    <option value="M">M (15% recovery)</option>
                    <option value="Q">Q (25% recovery)</option>
                    <option value="H">H (30% recovery)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Center Logo (Optional)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-background border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm outline-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="size-4" />
                      {logo ? "Change Logo" : "Upload Logo"}
                    </button>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo(null)}
                        className="bg-red-500 text-white border-2 border-border p-3 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm outline-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogo(e.target.files[0])
                      }
                    }}
                  />
                  {logo && <span className="text-xs font-medium text-muted-foreground truncate">{logo.name}</span>}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !content}
              className="mt-4 bg-main text-main-foreground border-4 border-border p-4 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-lg outline-none hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="size-6" />
                  Generate Code
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary-background border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 h-full flex flex-col">
            <h2 className="font-heading font-black text-xl mb-4 border-b-4 border-border pb-2">Preview</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {error && (
                <div className="w-full bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-base flex flex-col items-center justify-center gap-2 text-center font-bold">
                  <AlertCircle className="size-8" />
                  <span>{error}</span>
                </div>
              )}

              {!resultImage && !error && !loading && (
                <div className="w-full aspect-square bg-background border-4 border-dashed border-border/40 rounded-base flex items-center justify-center flex-col gap-3 text-muted-foreground">
                  <ImageIcon className="size-12 opacity-50" />
                  <span className="font-bold text-sm uppercase tracking-widest opacity-50">No Image Generated</span>
                </div>
              )}

              {loading && (
                <div className="w-full aspect-square bg-background border-4 border-border rounded-base flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Loader2 className="size-12 animate-spin text-main" />
                </div>
              )}

              {resultImage && !loading && (
                <div className="flex flex-col items-center w-full gap-6 animate-fade-in">
                  <div className="p-4 bg-white border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full flex items-center justify-center">
                    <img src={resultImage} alt="Generated Code" className="max-w-full h-auto" />
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full bg-chart-2 text-main-foreground border-4 border-border p-3 rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black outline-none hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <Download className="size-5" />
                    Download PNG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
