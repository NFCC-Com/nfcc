import * as React from 'react'
import QRCodeLib from 'qrcode'
import { DownloadIcon, PaletteIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button.tsx'
import { Collapsible, CollapsibleContent } from '#/components/ui/collapsible.tsx'
import { Label } from '#/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select.tsx'
import { Slider } from '#/components/ui/slider.tsx'
import { Separator } from '#/components/ui/separator.tsx'
import { Card } from '#/components/ui/card.tsx'
import { ColorPicker } from '#/components/dashboard/color-picker.tsx'

let logoImagePromise: Promise<HTMLImageElement> | null = null

function loadLogoImage(): Promise<HTMLImageElement> {
  if (!logoImagePromise) {
    logoImagePromise = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = '/logo.png'
    })
  }
  return logoImagePromise
}

function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  url: string,
  size: number,
  fg: string,
  bg: string,
  logoSize: number,
  bgPadding: number,
  bgOpacity: number,
): void {
  const dpr = window.devicePixelRatio || 2
  const px = size * dpr

  QRCodeLib.toCanvas(canvas, url, {
    width: px,
    margin: 0,
    color: { dark: fg, light: bg },
    errorCorrectionLevel: 'H',
  }, () => {
    const ctx = canvas.getContext('2d')!
    const cw = canvas.width
    const ch = canvas.height
    const cx = cw / 2
    const cy = ch / 2

    const half = Math.min(cw, ch) / 2
    const logoRadius = half * (logoSize / 100)
    const bpad = half * (bgPadding / 100)

    ctx.save()

    if (bpad > 0.5) {
      ctx.beginPath()
      ctx.arc(cx, cy, logoRadius + bpad + 2, 0, Math.PI * 2)
      ctx.fillStyle = hexToRgba(bg, bgOpacity / 100 * 0.95)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, logoRadius + bpad, 0, Math.PI * 2)
      ctx.fillStyle = hexToRgba(bg, bgOpacity / 100)
      ctx.fill()
    }

    const logoSize2x = logoRadius * 1.6

    loadLogoImage().then((img) => {
      const ratio = Math.min(logoSize2x / img.width, logoSize2x / img.height)
      const dw = img.width * ratio
      const dh = img.height * ratio
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
      ctx.restore()
    })
  })
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

async function downloadPng(
  url: string,
  size: number,
  fg: string,
  bg: string,
  logoSize: number,
  bgPadding: number,
  bgOpacity: number,
  filename: string,
) {
  const offscreen = document.createElement('canvas')
  renderQrToCanvas(offscreen, url, size, fg, bg, logoSize, bgPadding, bgOpacity)
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = offscreen.toDataURL('image/png')
  link.click()
}

function useCanvasSize(ref: React.RefObject<HTMLDivElement | null>, maxSize: number) {
  const [size, setSize] = React.useState(maxSize)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      setSize(Math.min(maxSize, w - 4))
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, maxSize])

  return size
}

export function QrCodeCard({
  shortUrl,
  code,
}: {
  shortUrl: string
  code: string
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [fgColor, setFgColor] = React.useState('#0b1220')
  const [bgColor, setBgColor] = React.useState('#ffffff')
  const [logoSize, setLogoSize] = React.useState(25)
  const [bgPadding, setBgPadding] = React.useState(6)
  const [bgOpacity, setBgOpacity] = React.useState(90)
  const [downloadSize, setDownloadSize] = React.useState('800')
  const [downloading, setDownloading] = React.useState(false)
  const [customizeOpen, setCustomizeOpen] = React.useState(false)

  const canvasSize = useCanvasSize(wrapperRef, 280)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || canvasSize === 0) return
    canvas.style.width = `${canvasSize}px`
    canvas.style.height = `${canvasSize}px`
    renderQrToCanvas(canvas, shortUrl, canvasSize, fgColor, bgColor, logoSize, bgPadding, bgOpacity)
  }, [shortUrl, fgColor, bgColor, logoSize, bgPadding, bgOpacity, canvasSize])

  async function handleDownload() {
    setDownloading(true)
    try {
      await downloadPng(shortUrl, Number(downloadSize), fgColor, bgColor, logoSize, bgPadding, bgOpacity, `nfcc-qr-${code}`)
      toast.success('QR code terdownload')
    } catch {
      toast.error('Download gagal')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card ref={wrapperRef} className="flex items-center justify-center bg-white p-3">
        <canvas ref={canvasRef} className="shrink-0" />
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleDownload} disabled={downloading} className="flex-1">
          <DownloadIcon className="size-4" />
          {downloading ? 'Generate\u2026' : `Download PNG (${downloadSize}px)`}
        </Button>
        <Button variant="outline" onClick={() => setCustomizeOpen((v) => !v)}>
          <PaletteIcon className="size-4" />
          Kustomisasi
        </Button>
      </div>

      <Collapsible open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <CollapsibleContent>
          <Separator className="my-1" />
          <div className="flex flex-col gap-5 pt-3">
            {/* Colors */}
            <section className="flex flex-col gap-3">
              <h4 className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                Warna
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ColorPicker value={fgColor} onChange={setFgColor} label="Foreground" />
                <ColorPicker value={bgColor} onChange={setBgColor} label="Background" />
              </div>
            </section>

            {/* Logo & background */}
            <section className="flex flex-col gap-3">
              <h4 className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                Logo
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Ukuran</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">{logoSize}%</span>
                  </div>
                  <Slider value={[logoSize]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v; if (val != null) setLogoSize(val) }} min={0} max={40} step={1} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Radius background</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">{bgPadding > 0 ? `${bgPadding}%` : 'Mati'}</span>
                  </div>
                  <Slider value={[bgPadding]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v; if (val != null) setBgPadding(val) }} min={0} max={15} step={1} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Opasitas background</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">{bgOpacity}%</span>
                  </div>
                  <Slider value={[bgOpacity]} onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v; if (val != null) setBgOpacity(val) }} min={0} max={100} step={5} />
                </div>
              </div>
            </section>

            {/* Download */}
            <section className="flex flex-col gap-3">
              <h4 className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                Download
              </h4>
              <Select
                items={{ '512': '512px', '800': '800px', '1024': '1024px', '2048': '2048px' }}
                value={downloadSize}
                onValueChange={(v) => { if (v) setDownloadSize(v) }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="800">800px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="2048">2048px</SelectItem>
                </SelectContent>
              </Select>
            </section>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
