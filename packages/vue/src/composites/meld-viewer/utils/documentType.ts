/**
 * Document type detection — derives a {@link DocumentType} from a {@link DocumentSource}
 * and optional MIME type override.
 *
 * Detection priority:
 *   1. Explicit `mimeType` argument (most reliable — server-provided)
 *   2. `File.type` when `source` is a File
 *   3. URL extension
 *   4. Known image-hosting domains
 *   5. Fallback to `'unknown'`
 */
import type { DocumentSource, DocumentType } from '../types'

const IMAGE_HOSTING_DOMAINS = [
  'picsum.photos',
  'unsplash.com',
  'images.unsplash.com',
  'i.imgur.com',
  'imgur.com',
  'placeholder.com',
  'placekitten.com',
  'placehold.co',
  'via.placeholder.com',
]

function getExtension(name: string): string {
  const cleanName = name.split('?')[0].split('#')[0]
  const parts = cleanName.toLowerCase().split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

function mimeToType(mime: string): DocumentType | null {
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('image/')) return 'image'
  if (mime === 'text/plain') return 'text'
  if (mime === 'text/markdown' || mime === 'text/x-markdown') return 'markdown'
  return null
}

/**
 * Detect document type from source + optional MIME type override.
 *
 * @example
 * detectDocumentType('https://example.com/doc.pdf')          // → 'pdf'
 * detectDocumentType('/file.png')                            // → 'image'
 * detectDocumentType(file, 'text/markdown')                  // → 'markdown'
 */
export function detectDocumentType(source: DocumentSource, mimeType?: string): DocumentType {
  if (mimeType) {
    const fromMime = mimeToType(mimeType)
    if (fromMime) return fromMime
  }

  // File source
  if (typeof File !== 'undefined' && source instanceof File) {
    if (source.type) {
      const fromFileMime = mimeToType(source.type)
      if (fromFileMime) return fromFileMime
    }
    const ext = getExtension(source.name)
    return extToType(ext) ?? 'unknown'
  }

  // Blob source (no name) — treat as unknown unless mimeType was supplied
  if (typeof Blob !== 'undefined' && source instanceof Blob && !(source instanceof File)) {
    if (source.type) {
      const fromBlobMime = mimeToType(source.type)
      if (fromBlobMime) return fromBlobMime
    }
    return 'unknown'
  }

  // ArrayBuffer — caller must supply mimeType
  if (typeof source === 'object' && source !== null && 'byteLength' in source) {
    return 'unknown'
  }

  // URL string
  if (typeof source === 'string') {
    let filename = ''
    let hostname = ''
    try {
      const url = new URL(
        source,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      )
      filename = url.pathname.split('/').pop() ?? ''
      hostname = url.hostname.toLowerCase()
    } catch {
      filename = source.split('/').pop() ?? ''
    }
    const ext = getExtension(filename)
    const fromExt = extToType(ext)
    if (fromExt) return fromExt
    if (hostname && IMAGE_HOSTING_DOMAINS.some((d) => hostname.includes(d))) return 'image'
    return 'unknown'
  }

  return 'unknown'
}

function extToType(ext: string): DocumentType | null {
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'].includes(ext))
    return 'image'
  if (ext === 'txt') return 'text'
  if (['md', 'markdown'].includes(ext)) return 'markdown'
  return null
}

/** Returns true if the given document type can render PDF-only features (annotations, outline, etc.). */
export function isPdfType(type: DocumentType): boolean {
  return type === 'pdf'
}

/**
 * Resolves a {@link DocumentSource} to a URL string suitable for `<img>` / `<a href>`.
 * For File / Blob, creates an object URL — caller is responsible for revoking via
 * the returned `revoke` callback.
 */
export function sourceToUrl(source: DocumentSource): { url: string; revoke: () => void } {
  if (typeof source === 'string') {
    return { url: source, revoke: () => {} }
  }
  if (typeof Blob !== 'undefined' && source instanceof Blob) {
    const url = URL.createObjectURL(source)
    return { url, revoke: () => URL.revokeObjectURL(url) }
  }
  // ArrayBuffer — wrap in a Blob
  const blob = new Blob([source as ArrayBuffer])
  const url = URL.createObjectURL(blob)
  return { url, revoke: () => URL.revokeObjectURL(url) }
}
