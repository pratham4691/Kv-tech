export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
])

export const STORAGE_BUCKETS = {
  news: 'public-media/news',
  events: 'public-media/events',
  network: 'public-media/network',
  awareness: 'public-media/awareness',
  media: 'public-media/media',
} as const

export function sanitizeFileName(filename: string) {
  const lastSegment = filename.split(/[\\/]/).pop() ?? filename
  const safe = lastSegment.replace(/[^a-zA-Z0-9._-]+/g, '-')
  return safe || 'upload-file'
}

export function validateImageUpload(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  const mime = file.type.toLowerCase()

  if (!ALLOWED_IMAGE_TYPES.has(mime)) {
    return {
      ok: false,
      error: 'Only JPG, PNG, WebP, and AVIF images are allowed.',
    } as const
  }

  if (!['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension)) {
    return {
      ok: false,
      error: 'Unsupported file extension for the uploaded image.',
    } as const
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: 'Image size must be 5 MB or less.',
    } as const
  }

  return {
    ok: true,
    extension,
    mime,
    sanitizedName: sanitizeFileName(file.name),
  } as const
}

export function buildStoragePath(bucket: keyof typeof STORAGE_BUCKETS, fileName: string) {
  return `${STORAGE_BUCKETS[bucket]}/${fileName}`
}

export function getPublicStorageUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!baseUrl) {
    return `/media/${path}`
  }

  return `${baseUrl.replace(/\/$/, '')}/storage/v1/object/public/${path}`
}
