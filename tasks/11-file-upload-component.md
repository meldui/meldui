# Task 11: File Upload Component

> **Status:** Complete
> **Priority:** High
> **Depends on:** Task 03 (Vue Package Setup - Complete)

## Overview

Create a composable file upload component for `@meldui/vue` that handles file selection via drag-and-drop or file picker, with support for validation, previews, and upload progress tracking. The component follows a granular, composable architecture giving users full control over layout and behavior.

**Key Design Decisions:**

- Consumer handles actual uploads (component manages file selection/validation only)
- Granular sub-components for maximum customization
- Uses existing `Progress` component with slots for progress display
- Layout left entirely to consumer
- Auto-generates image previews using browser `URL.createObjectURL()` API

---

## Component Architecture

### Components Overview

| Component                | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `FileUpload`             | Root - manages state, validation, provides context |
| `FileUploadDropzone`     | Drag-and-drop area with visual feedback            |
| `FileUploadTrigger`      | Opens file picker dialog                           |
| `FileUploadList`         | Semantic container for items (no layout styling)   |
| `FileUploadItem`         | Individual file wrapper, provides file context     |
| `FileUploadItemPreview`  | Image preview (auto-generated) or custom fallback  |
| `FileUploadItemName`     | File name display                                  |
| `FileUploadItemSize`     | Formatted file size display                        |
| `FileUploadItemProgress` | Upload progress (wraps Progress component)         |
| `FileUploadItemDelete`   | Remove file button                                 |
| `FileUploadClear`        | Remove all files button                            |

### Component Hierarchy

```
FileUpload (root - provides context)
├── FileUploadDropzone (drag-and-drop area)
│   └── FileUploadTrigger (button to open picker)
├── FileUploadList (semantic wrapper)
│   └── FileUploadItem (per-file wrapper - provides file context)
│       ├── FileUploadItemPreview (image/icon)
│       ├── FileUploadItemName (filename)
│       ├── FileUploadItemSize (formatted size)
│       ├── FileUploadItemProgress (upload progress)
│       └── FileUploadItemDelete (remove button)
└── FileUploadClear (clear all button)
```

---

## API Specification

### FileUpload (Root Component)

**Props:**

```typescript
interface FileUploadProps {
  /** v-model binding for selected files */
  modelValue?: File[]

  /** Accepted file types (MIME types or extensions) */
  accept?: string // e.g., "image/*", ".pdf,.doc", "image/png,image/jpeg"

  /** Maximum number of files allowed */
  maxFiles?: number // Default: Infinity

  /** Maximum file size in bytes per file */
  maxSize?: number // e.g., 10 * 1024 * 1024 (10MB)

  /** Allow multiple file selection */
  multiple?: boolean // Default: true

  /** Disable file upload interactions */
  disabled?: boolean // Default: false

  /** Name attribute for form integration */
  name?: string

  /** Custom CSS class */
  class?: string
}
```

**Emits:**

```typescript
interface FileUploadEmits {
  /** Files array updated */
  'update:modelValue': [files: File[]]

  /** File successfully added (passes validation) */
  'file-accept': [file: File]

  /** File rejected (failed validation) */
  'file-reject': [file: File, errors: FileError[]]
}
```

**Error Types:**

```typescript
interface FileError {
  code: 'file-too-large' | 'file-invalid-type' | 'too-many-files' | 'custom'
  message: string
}
```

**Context Provided (via provide/inject):**

```typescript
interface FileUploadContext {
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
}
```

---

### FileUploadDropzone

**Props:**

```typescript
interface FileUploadDropzoneProps {
  class?: string
}
```

**Data Attributes (for styling):**

| Attribute         | When Present                              |
| ----------------- | ----------------------------------------- |
| `[data-dragging]` | Files are being dragged over the dropzone |
| `[data-disabled]` | Parent FileUpload is disabled             |
| `[data-accept]`   | Dragged files match accept criteria       |
| `[data-reject]`   | Dragged files don't match accept criteria |

**Slot Props:**

```typescript
interface FileUploadDropzoneSlotProps {
  isDragging: boolean
  isDisabled: boolean
  openFilePicker: () => void
}
```

---

### FileUploadTrigger

**Props:**

```typescript
interface FileUploadTriggerProps extends PrimitiveProps {
  class?: string
}
```

Supports `as` and `asChild` for custom rendering (uses Reka UI Primitive).

---

### FileUploadList

**Props:**

```typescript
interface FileUploadListProps extends PrimitiveProps {
  class?: string
}
```

Semantic wrapper only - no layout styling. Supports `as` and `asChild`.

---

### FileUploadItem

**Props:**

```typescript
interface FileUploadItemProps {
  /** The file this item represents */
  file: File

  /** Upload progress (0-100) */
  progress?: number

  /** Current upload status */
  status?: 'pending' | 'uploading' | 'complete' | 'error'

  /** Error message when status is 'error' */
  error?: string

  class?: string
}
```

**Data Attributes:**

| Attribute       | Value                                                     |
| --------------- | --------------------------------------------------------- |
| `[data-status]` | `"pending"` \| `"uploading"` \| `"complete"` \| `"error"` |

**Context Provided (to children):**

```typescript
interface FileUploadItemContext {
  file: File
  progress: Ref<number | undefined>
  status: Ref<'pending' | 'uploading' | 'complete' | 'error'>
  error: Ref<string | undefined>
  previewUrl: Ref<string | undefined> // Auto-generated for images
  remove: () => void
}
```

**Slot Props:**

```typescript
interface FileUploadItemSlotProps {
  file: File
  progress: number | undefined
  status: 'pending' | 'uploading' | 'complete' | 'error'
  error: string | undefined
  previewUrl: string | undefined
  remove: () => void
}
```

---

### FileUploadItemPreview

**Props:**

```typescript
interface FileUploadItemPreviewProps {
  class?: string
}
```

Automatically renders `<img>` for image files using the auto-generated preview URL. Slot content serves as fallback for non-image files.

**Slot Props:**

```typescript
interface FileUploadItemPreviewSlotProps {
  file: File
  previewUrl: string | undefined
  isImage: boolean
}
```

---

### FileUploadItemName

**Props:**

```typescript
interface FileUploadItemNameProps extends PrimitiveProps {
  class?: string
}
```

Renders the file name. Supports `as` and `asChild`.

---

### FileUploadItemSize

**Props:**

```typescript
interface FileUploadItemSizeProps extends PrimitiveProps {
  /** Number of decimal places for size formatting */
  precision?: number // Default: 1

  class?: string
}
```

Renders formatted file size (e.g., "2.5 MB", "340 KB"). Supports `as` and `asChild`.

---

### FileUploadItemProgress

**Props:**

```typescript
interface FileUploadItemProgressProps {
  /** Progress bar variant (uses existing Progress component) */
  variant?: 'default' | 'success' | 'destructive'

  class?: string
}
```

Wraps the existing `Progress` component. Only renders when progress is defined.

---

### FileUploadItemDelete

**Props:**

```typescript
interface FileUploadItemDeleteProps extends PrimitiveProps {
  class?: string
}
```

Button to remove the file. Supports `as` and `asChild`.

---

### FileUploadClear

**Props:**

```typescript
interface FileUploadClearProps extends PrimitiveProps {
  class?: string
}
```

Button to remove all files. Supports `as` and `asChild`. Only renders/enables when files exist.

---

## Implementation Tasks

### Phase 1: Core Infrastructure - COMPLETE

- [x] Create directory structure: `packages/vue/src/components/ui/file-upload/`
- [x] Create `index.ts` with exports
- [x] Create TypeScript types in `types.ts`
- [x] Create `useFilePreview.ts` composable for preview generation
- [x] Create `utils.ts` for helper functions (formatFileSize, isValidFileType, validateFiles, etc.)

### Phase 2: Root Components - COMPLETE

- [x] Implement `FileUpload.vue` (root with context provider)
- [x] Implement `FileUploadDropzone.vue` (drag-and-drop handling)
- [x] Implement `FileUploadTrigger.vue` (file picker trigger)
- [x] Implement `FileUploadList.vue` (semantic wrapper)
- [x] Implement `FileUploadClear.vue` (clear all button)

### Phase 3: Item Components - COMPLETE

- [x] Implement `FileUploadItem.vue` (per-file wrapper with context)
- [x] Implement `FileUploadItemPreview.vue` (image preview with fallback)
- [x] Implement `FileUploadItemName.vue` (file name display)
- [x] Implement `FileUploadItemSize.vue` (formatted size display)
- [x] Implement `FileUploadItemProgress.vue` (progress wrapper)
- [x] Implement `FileUploadItemDelete.vue` (delete button)

### Phase 4: Preview System - COMPLETE

- [x] Implement `useFilePreview.ts` composable
- [x] Handle `URL.createObjectURL()` for image previews
- [x] Implement cleanup with `URL.revokeObjectURL()` on unmount/removal
- [x] Detect image files via `file.type.startsWith('image/')`

### Phase 5: Validation System - COMPLETE

- [x] Implement file type validation (accept prop)
- [x] Implement file size validation (maxSize prop)
- [x] Implement file count validation (maxFiles prop)
- [x] Create error messages for each validation type
- [x] Emit `file-reject` with appropriate error codes

### Phase 6: Exports & Integration - COMPLETE

- [x] Export all components from `packages/vue/src/components/ui/file-upload/index.ts`
- [x] Add exports to `packages/vue/src/index.ts`
- [x] Verify TypeScript types are exported correctly

### Phase 7: Storybook Documentation - COMPLETE

- [x] Create `FileUpload.stories.ts` with basic usage (Default story)
- [x] Add story: Single file upload (SingleFile)
- [x] Add story: Image upload with previews (ImageUpload)
- [x] Add story: Upload progress simulation (WithProgress)
- [x] Add story: Validation errors (WithValidation)
- [x] Add story: Custom styling example (CustomDropzoneStyle)
- [x] Add story: Document upload example (DocumentUpload)
- [x] Add story: Disabled state (Disabled)
- [x] Add story: Chat input integration (WithChatInput)

---

## File Structure

```
packages/vue/src/components/ui/file-upload/
├── index.ts                    # Exports
├── types.ts                    # TypeScript interfaces
├── FileUpload.vue              # Root component
├── FileUploadDropzone.vue      # Drag-and-drop area
├── FileUploadTrigger.vue       # File picker trigger
├── FileUploadList.vue          # Item container
├── FileUploadItem.vue          # Per-file wrapper
├── FileUploadItemPreview.vue   # Image preview
├── FileUploadItemName.vue      # File name
├── FileUploadItemSize.vue      # Formatted size
├── FileUploadItemProgress.vue  # Progress bar
├── FileUploadItemDelete.vue    # Delete button
├── FileUploadClear.vue         # Clear all button
├── useFileUpload.ts            # Main composable
├── useFilePreview.ts           # Preview generation composable
└── utils.ts                    # Helper functions
```

---

## Usage Examples

### Basic Usage

```vue
<script setup>
import { ref } from 'vue'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadItemDelete,
} from '@meldui/vue'
import { IconUpload, IconFile, IconX } from '@meldui/tabler-vue'
import { Button } from '@meldui/vue'

const files = ref<File[]>([])
</script>

<template>
  <FileUpload v-model="files" accept="image/*" :max-size="5 * 1024 * 1024">
    <FileUploadDropzone class="border-2 border-dashed rounded-lg p-8 text-center">
      <IconUpload class="mx-auto mb-2 text-muted-foreground" :size="32" />
      <p class="text-sm text-muted-foreground">Drag & drop images here</p>
      <FileUploadTrigger as-child>
        <Button variant="outline" class="mt-4">Browse Files</Button>
      </FileUploadTrigger>
    </FileUploadDropzone>

    <div class="mt-4 space-y-2">
      <FileUploadItem
        v-for="file in files"
        :key="file.name"
        :file="file"
        class="flex items-center gap-3 p-3 border rounded-lg"
      >
        <FileUploadItemPreview class="w-12 h-12 rounded object-cover">
          <IconFile class="w-12 h-12 text-muted-foreground" />
        </FileUploadItemPreview>

        <div class="flex-1 min-w-0">
          <FileUploadItemName class="truncate font-medium text-sm" />
          <FileUploadItemSize class="text-xs text-muted-foreground" />
        </div>

        <FileUploadItemDelete as-child>
          <Button variant="ghost" size="icon">
            <IconX :size="16" />
          </Button>
        </FileUploadItemDelete>
      </FileUploadItem>
    </div>
  </FileUpload>
</template>
```

### With Upload Progress

```vue
<script setup>
import { ref } from 'vue'

const files = ref<File[]>([])
const uploadProgress = ref<Map<File, number>>(new Map())
const uploadStatus = ref<Map<File, string>>(new Map())

async function handleFileAccept(file: File) {
  uploadStatus.value.set(file, 'uploading')

  // Simulate upload with progress
  for (let i = 0; i <= 100; i += 10) {
    uploadProgress.value.set(file, i)
    await new Promise(r => setTimeout(r, 200))
  }

  uploadStatus.value.set(file, 'complete')
}
</script>

<template>
  <FileUpload
    v-model="files"
    accept=".pdf,.doc,.docx"
    :max-files="5"
    @file-accept="handleFileAccept"
  >
    <FileUploadDropzone class="border-2 border-dashed rounded-lg p-8">
      <!-- Dropzone content -->
    </FileUploadDropzone>

    <FileUploadItem
      v-for="file in files"
      :key="file.name"
      :file="file"
      :progress="uploadProgress.get(file)"
      :status="uploadStatus.get(file) ?? 'pending'"
      class="flex items-center gap-3 p-3 border rounded-lg mt-2"
    >
      <FileUploadItemPreview class="w-10 h-10">
        <IconFileText />
      </FileUploadItemPreview>

      <div class="flex-1">
        <FileUploadItemName class="font-medium" />
        <FileUploadItemSize class="text-xs text-muted-foreground" />
        <FileUploadItemProgress class="mt-1" />
      </div>

      <FileUploadItemDelete as-child>
        <Button variant="ghost" size="icon">
          <IconX />
        </Button>
      </FileUploadItemDelete>
    </FileUploadItem>
  </FileUpload>
</template>
```

### Handling Validation Errors

```vue
<script setup>
import { ref } from 'vue'
import type { FileError } from '@meldui/vue'

const files = ref<File[]>([])
const errors = ref<Array<{ file: File; errors: FileError[] }>>([])

function handleReject(file: File, fileErrors: FileError[]) {
  errors.value.push({ file, errors: fileErrors })

  // Clear error after 5 seconds
  setTimeout(() => {
    errors.value = errors.value.filter(e => e.file !== file)
  }, 5000)
}
</script>

<template>
  <FileUpload
    v-model="files"
    accept="image/*"
    :max-size="2 * 1024 * 1024"
    :max-files="3"
    @file-reject="handleReject"
  >
    <!-- ... -->
  </FileUpload>

  <!-- Display errors -->
  <div v-if="errors.length" class="mt-4 space-y-2">
    <div
      v-for="{ file, errors: fileErrors } in errors"
      :key="file.name"
      class="p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
    >
      <strong>{{ file.name }}</strong>
      <ul class="list-disc list-inside mt-1">
        <li v-for="error in fileErrors" :key="error.code">
          {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

### Custom Dropzone Styling with Data Attributes

```vue
<template>
  <FileUpload v-model="files">
    <FileUploadDropzone
      class="
        border-2 border-dashed rounded-lg p-8 text-center
        transition-colors duration-200
        data-[dragging]:border-primary data-[dragging]:bg-primary/5
        data-[accept]:border-green-500 data-[accept]:bg-green-50
        data-[reject]:border-destructive data-[reject]:bg-destructive/5
        data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
      "
    >
      <!-- content -->
    </FileUploadDropzone>
  </FileUpload>
</template>
```

---

## Technical Implementation Notes

### Image Preview Generation

```typescript
// useFilePreview.ts
import { ref, onUnmounted, watch } from 'vue'

export function useFilePreview(file: Ref<File>) {
  const previewUrl = ref<string | undefined>()

  const isImage = computed(() => file.value.type.startsWith('image/'))

  const generatePreview = () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }

    if (isImage.value) {
      previewUrl.value = URL.createObjectURL(file.value)
    } else {
      previewUrl.value = undefined
    }
  }

  // Generate on mount
  generatePreview()

  // Cleanup on unmount
  onUnmounted(() => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })

  return { previewUrl, isImage }
}
```

### File Size Formatting

```typescript
// utils.ts
export function formatFileSize(bytes: number, precision = 1): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${units[i]}`
}
```

### File Type Validation

```typescript
// utils.ts
export function isValidFileType(file: File, accept: string): boolean {
  if (!accept) return true

  const acceptedTypes = accept.split(',').map((t) => t.trim())

  return acceptedTypes.some((type) => {
    // Handle MIME type wildcards like "image/*"
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2)
      return file.type.startsWith(category + '/')
    }

    // Handle extensions like ".pdf"
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }

    // Handle exact MIME types
    return file.type === type
  })
}
```

### Keyboard Support

- `Enter`/`Space` on Dropzone or Trigger: Opens file picker
- `Tab`: Navigate between interactive elements
- `Delete`/`Backspace` on focused item: Remove file (optional enhancement)

---

## Accessibility Considerations

- Dropzone has `role="button"` and proper `aria-label`
- Hidden file input is properly labeled
- Delete buttons have descriptive `aria-label` including file name
- Progress is announced via `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Error states are announced via `aria-live` region

---

## Success Criteria

1. **File Selection** - Users can select files via drag-and-drop or file picker
2. **Validation** - Files are validated against accept, maxSize, maxFiles constraints
3. **Error Handling** - Rejected files emit events with clear error codes/messages
4. **Image Previews** - Image files automatically show previews
5. **Memory Management** - Preview URLs are properly cleaned up
6. **Progress Tracking** - Consumer can track and display upload progress
7. **Accessibility** - Component is keyboard navigable and screen reader friendly
8. **Composability** - All sub-components can be styled and arranged freely
9. **TypeScript** - Full type safety with exported interfaces
10. **Documentation** - Comprehensive Storybook stories and examples

---

## References

- [DiceUI File Upload](https://www.diceui.com/docs/components/file-upload) - Inspiration
- [MDN: Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [MDN: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [MDN: HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Reka UI Primitive](https://reka-ui.com/docs/utilities/primitive) - For asChild support
