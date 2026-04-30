// Resize-and-recompress an image File to a JPEG/PNG data URL bounded by
// `maxDimension` on its longest side. Most photo uploads from a phone or
// camera land at 3-12 MB; persisting that into IndexedDB or sending it
// through a capture pipeline either bloats the snapshot or trips
// payload-size limits. Compressing on the client keeps the visual result
// equivalent for ~400px-wide preview tiles while shrinking each image to
// roughly 50–250 KB.
//
// Defaults: 1600px max side, 0.82 JPEG quality. Tune if a callsite needs
// higher fidelity (e.g. hero image) or a smaller payload (e.g. thumbnail).

export interface CompressImageOptions {
  /** Maximum width or height in pixels. The other axis is scaled to keep ratio. */
  maxDimension?: number
  /** JPEG quality from 0 to 1. Ignored if `mimeType` is `image/png`. */
  quality?: number
  /** Output mime type. PNGs with transparency should use 'image/png'. */
  mimeType?: 'image/jpeg' | 'image/png'
}

const DEFAULTS: Required<CompressImageOptions> = {
  maxDimension: 1024,
  quality: 0.7,
  mimeType: 'image/jpeg',
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to decode image'))
    img.src = src
  })
}

export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<string> {
  const { maxDimension, quality } = { ...DEFAULTS, ...options }
  // Preserve PNG output for sources that may carry transparency (PNG, GIF,
  // WebP). Encoding those as JPEG fills transparent pixels with black —
  // visible regression in logo uploads. Only force JPEG for opaque sources
  // (or when the caller explicitly overrides `mimeType`).
  const preservesAlpha = /^image\/(png|gif|webp|avif)$/i.test(file.type)
  const mimeType = options.mimeType ?? (preservesAlpha ? 'image/png' : 'image/jpeg')
  const original = await readFileAsDataURL(file)

  // Skip non-rasters (SVG, etc.) — drawing them risks losing fidelity, and
  // they're already tiny.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return original
  }

  let img: HTMLImageElement
  try {
    img = await loadImage(original)
  } catch {
    return original
  }

  const longest = Math.max(img.width, img.height)
  const ratio = longest > maxDimension ? maxDimension / longest : 1
  const targetW = Math.max(1, Math.round(img.width * ratio))
  const targetH = Math.max(1, Math.round(img.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) return original

  ctx.drawImage(img, 0, 0, targetW, targetH)

  const out = canvas.toDataURL(mimeType, quality)
  // If for some reason compression produced a larger payload (very rare —
  // tiny images recoded as JPEG), fall back to the original.
  return out.length < original.length ? out : original
}

export async function compressImageFiles(
  files: File[] | FileList,
  options?: CompressImageOptions,
): Promise<string[]> {
  const arr = Array.from(files)
  return Promise.all(arr.map((f) => compressImageFile(f, options)))
}
