import type { PrimitiveProps } from 'reka-ui'
import type { ComputedRef, HTMLAttributes, Ref } from 'vue'

// ============================================
// Error Types
// ============================================

export type FileErrorCode = 'file-too-large' | 'file-invalid-type' | 'too-many-files'

export interface FileError {
  code: FileErrorCode
  message: string
}

// ============================================
// Context Types
// ============================================

export interface FileUploadContext {
  files: Ref<File[]>
  disabled: Ref<boolean>
  accept: Ref<string | undefined>
  maxFiles: Ref<number>
  maxSize: Ref<number | undefined>
  multiple: Ref<boolean>
  addFiles: (files: FileList | File[]) => void
  removeFile: (file: File) => void
  clearFiles: () => void
  openFilePicker: () => void
  inputRef: Ref<HTMLInputElement | null>
}

export type FileUploadStatus = 'pending' | 'uploading' | 'complete' | 'error'

export interface FileUploadItemContext {
  file: File
  progress: ComputedRef<number | undefined>
  status: ComputedRef<FileUploadStatus>
  error: ComputedRef<string | undefined>
  previewUrl: Ref<string | undefined>
  isImage: ComputedRef<boolean>
  remove: () => void
}

// ============================================
// Component Props
// ============================================

export interface FileUploadProps {
  /** v-model binding for selected files */
  modelValue?: File[]
  /** Accepted file types (MIME types or extensions) */
  accept?: string
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Maximum file size in bytes per file */
  maxSize?: number
  /** Allow multiple file selection */
  multiple?: boolean
  /** Disable file upload interactions */
  disabled?: boolean
  /** Name attribute for form integration */
  name?: string
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadDropzoneProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadTriggerProps extends PrimitiveProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadListProps extends PrimitiveProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemProps {
  /** The file this item represents */
  file: File
  /** Upload progress (0-100) */
  progress?: number
  /** Current upload status */
  status?: FileUploadStatus
  /** Error message when status is 'error' */
  error?: string
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemPreviewProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemNameProps extends PrimitiveProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemSizeProps extends PrimitiveProps {
  /** Number of decimal places for size formatting */
  precision?: number
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemProgressProps {
  /** Progress bar variant */
  variant?: 'default' | 'success' | 'destructive'
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadItemDeleteProps extends PrimitiveProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

export interface FileUploadClearProps extends PrimitiveProps {
  /** Custom CSS class */
  class?: HTMLAttributes['class']
}

// ============================================
// Slot Props
// ============================================

export interface FileUploadDropzoneSlotProps {
  isDragging: boolean
  isDisabled: boolean
  openFilePicker: () => void
}

export interface FileUploadItemSlotProps {
  file: File
  progress: number | undefined
  status: FileUploadStatus
  error: string | undefined
  previewUrl: string | undefined
  isImage: boolean
  remove: () => void
}

export interface FileUploadItemPreviewSlotProps {
  file: File
  previewUrl: string | undefined
  isImage: boolean
}
