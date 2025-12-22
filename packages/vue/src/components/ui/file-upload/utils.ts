import type { FileError, FileErrorCode } from './types'

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @param precision - Number of decimal places (default: 1)
 * @returns Formatted string like "2.5 MB" or "340 KB"
 */
export function formatFileSize(bytes: number, precision = 1): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(precision))} ${units[i]}`
}

/**
 * Check if a file matches the accepted file types
 * @param file - File to validate
 * @param accept - Accept string (e.g., "image/*", ".pdf,.doc", "image/png,image/jpeg")
 * @returns true if file type is valid
 */
export function isValidFileType(file: File, accept: string | undefined): boolean {
  if (!accept) return true

  const acceptedTypes = accept.split(',').map((t) => t.trim())

  return acceptedTypes.some((type) => {
    // Handle MIME type wildcards like "image/*"
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2)
      return file.type.startsWith(`${category}/`)
    }

    // Handle extensions like ".pdf"
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }

    // Handle exact MIME types like "image/png"
    return file.type === type
  })
}

/**
 * Check if a file is an image based on MIME type
 * @param file - File to check
 * @returns true if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Create a file error object
 * @param code - Error code
 * @param file - File that caused the error
 * @param context - Additional context (e.g., maxSize, accept types)
 * @returns FileError object
 */
export function createFileError(
  code: FileErrorCode,
  file: File,
  context?: { maxSize?: number; accept?: string; maxFiles?: number },
): FileError {
  const messages: Record<FileErrorCode, string> = {
    'file-too-large': context?.maxSize
      ? `File "${file.name}" exceeds maximum size of ${formatFileSize(context.maxSize)}`
      : `File "${file.name}" is too large`,
    'file-invalid-type': context?.accept
      ? `File "${file.name}" has invalid type. Accepted: ${context.accept}`
      : `File "${file.name}" has invalid type`,
    'too-many-files': context?.maxFiles
      ? `Maximum of ${context.maxFiles} file${context.maxFiles === 1 ? '' : 's'} allowed`
      : 'Too many files selected',
  }

  return {
    code,
    message: messages[code],
  }
}

/**
 * Validate files against constraints
 * @param files - Files to validate
 * @param options - Validation options
 * @returns Object containing accepted and rejected files
 */
export function validateFiles(
  files: File[],
  options: {
    accept?: string
    maxSize?: number
    maxFiles?: number
    currentFileCount?: number
  },
): {
  accepted: File[]
  rejected: Array<{ file: File; errors: FileError[] }>
} {
  const { accept, maxSize, maxFiles, currentFileCount = 0 } = options
  const accepted: File[] = []
  const rejected: Array<{ file: File; errors: FileError[] }> = []

  let fileCountAfterAdd = currentFileCount

  for (const file of files) {
    const errors: FileError[] = []

    // Check file type
    if (!isValidFileType(file, accept)) {
      errors.push(createFileError('file-invalid-type', file, { accept }))
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      errors.push(createFileError('file-too-large', file, { maxSize }))
    }

    // Check file count
    if (maxFiles && fileCountAfterAdd >= maxFiles) {
      errors.push(createFileError('too-many-files', file, { maxFiles }))
    }

    if (errors.length > 0) {
      rejected.push({ file, errors })
    } else {
      accepted.push(file)
      fileCountAfterAdd++
    }
  }

  return { accepted, rejected }
}

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns Extension without dot, or empty string
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filename.length - 1) return ''
  return filename.slice(lastDot + 1).toLowerCase()
}
