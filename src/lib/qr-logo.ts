export type QrLogoDrawer = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
) => void

export const drawNfccShield: QrLogoDrawer = (ctx, cx, cy, size, color) => {
  const w = size * 0.65
  const h = size * 0.75

  const topCurve = h * 0.12

  const sx = cx - w / 2
  const startY = cy - h * 0.44

  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1, size * 0.04)
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(sx, startY + h * 0.15)
  ctx.lineTo(sx, startY + h * 0.2)
  ctx.quadraticCurveTo(
    sx + w * 0.1,
    startY - topCurve,
    sx + w * 0.5,
    startY - topCurve,
  )
  ctx.quadraticCurveTo(
    sx + w * 0.9,
    startY - topCurve,
    sx + w,
    startY + h * 0.2,
  )
  ctx.lineTo(sx + w, startY + h * 0.15)
  ctx.lineTo(sx + w * 0.75, startY + h * 0.65)
  ctx.lineTo(sx + w * 0.5, startY + h)
  ctx.lineTo(sx + w * 0.25, startY + h * 0.65)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
