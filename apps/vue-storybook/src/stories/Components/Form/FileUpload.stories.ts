import {
  IconArrowUp,
  IconFile,
  IconFileTypePdf,
  IconPaperclip,
  IconPhoto,
  IconUpload,
  IconX,
} from '@meldui/tabler-vue'
import type { FileError } from '@meldui/vue'
import {
  Button,
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadItemSize,
  FileUploadTrigger,
  ScrollArea,
  ScrollBar,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof FileUpload> = {
  title: 'Components/Form/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types or extensions)',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes per file',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable file upload interactions',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A composable file upload component that supports drag-and-drop, file picker, validation, image previews, and upload progress tracking.

## Features
- Drag and drop file upload
- Click to browse files
- File type validation (accept prop)
- File size validation (maxSize prop)
- Multiple file limit (maxFiles prop)
- Auto-generated image previews
- Upload progress display
- Fully composable architecture

## Components
- \`FileUpload\` - Root component managing state
- \`FileUploadDropzone\` - Drag-and-drop area
- \`FileUploadTrigger\` - Button to open file picker
- \`FileUploadList\` - Semantic container for items
- \`FileUploadItem\` - Individual file wrapper
- \`FileUploadItemPreview\` - Image preview or icon
- \`FileUploadItemName\` - File name display
- \`FileUploadItemSize\` - Formatted file size
- \`FileUploadItemProgress\` - Upload progress bar
- \`FileUploadItemDelete\` - Remove file button
- \`FileUploadClear\` - Remove all files button
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <FileUpload v-model="files" class="w-full max-w-md">
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5"
        >
          <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm text-muted-foreground mb-3">
            Drag & drop files here, or click to browse
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm">Browse Files</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <FileUploadItem
            v-for="file in files"
            :key="file.name"
            :file="file"
            class="flex items-center gap-3 p-3 border border-border rounded-lg"
          >
            <FileUploadItemPreview class="w-10 h-10 rounded bg-muted flex items-center justify-center">
              <IconFile class="text-muted-foreground" :size="20" />
            </FileUploadItemPreview>

            <div class="flex-1 min-w-0">
              <FileUploadItemName class="block truncate text-sm font-medium" />
              <FileUploadItemSize class="text-xs text-muted-foreground" />
            </div>

            <FileUploadItemDelete as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <IconX :size="16" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </div>
      </FileUpload>
    `,
  }),
}

export const ImageUpload: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconPhoto,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <FileUpload v-model="files" accept="image/*" class="w-full max-w-md">
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[reject]:border-destructive data-[reject]:bg-destructive/5"
        >
          <IconPhoto class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm font-medium mb-1">Upload Images</p>
          <p class="text-xs text-muted-foreground mb-3">
            PNG, JPG, GIF up to 10MB
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm">Select Images</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <div v-if="files.length > 0" class="mt-4 grid grid-cols-3 gap-3">
          <FileUploadItem
            v-for="file in files"
            :key="file.name"
            :file="file"
            class="relative group"
          >
            <FileUploadItemPreview class="w-full aspect-square rounded-lg object-cover bg-muted">
              <div class="w-full h-full flex items-center justify-center">
                <IconPhoto class="text-muted-foreground" :size="24" />
              </div>
            </FileUploadItemPreview>

            <FileUploadItemDelete as-child>
              <Button
                variant="destructive"
                size="icon"
                class="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX :size="12" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </div>
      </FileUpload>
    `,
  }),
}

export const WithProgress: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemProgress,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      const uploadProgress = ref<Map<File, number>>(new Map())
      const uploadStatus = ref<Map<File, 'pending' | 'uploading' | 'complete' | 'error'>>(new Map())

      const simulateUpload = async (file: File) => {
        uploadStatus.value.set(file, 'uploading')

        for (let progress = 0; progress <= 100; progress += 10) {
          uploadProgress.value.set(file, progress)
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        uploadStatus.value.set(file, 'complete')
      }

      const handleFileAccept = (file: File) => {
        uploadProgress.value.set(file, 0)
        uploadStatus.value.set(file, 'pending')
        simulateUpload(file)
      }

      return { files, uploadProgress, uploadStatus, handleFileAccept }
    },
    template: `
      <FileUpload
        v-model="files"
        class="w-full max-w-md"
        @file-accept="handleFileAccept"
      >
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5"
        >
          <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm text-muted-foreground mb-3">
            Drop files to upload (progress simulation)
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm">Browse Files</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <FileUploadItem
            v-for="file in files"
            :key="file.name"
            :file="file"
            :progress="uploadProgress.get(file)"
            :status="uploadStatus.get(file) ?? 'pending'"
            class="flex items-center gap-3 p-3 border border-border rounded-lg"
          >
            <FileUploadItemPreview class="w-10 h-10 rounded bg-muted flex items-center justify-center">
              <IconFile class="text-muted-foreground" :size="20" />
            </FileUploadItemPreview>

            <div class="flex-1 min-w-0">
              <FileUploadItemName class="block truncate text-sm font-medium" />
              <div class="flex items-center gap-2 mt-1">
                <FileUploadItemSize class="text-xs text-muted-foreground" />
                <span
                  v-if="uploadStatus.get(file) === 'complete'"
                  class="text-xs text-green-600"
                >
                  Complete
                </span>
              </div>
              <FileUploadItemProgress
                class="mt-2"
                :variant="uploadStatus.get(file) === 'complete' ? 'success' : 'default'"
              />
            </div>

            <FileUploadItemDelete as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <IconX :size="16" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </div>
      </FileUpload>
    `,
  }),
}

export const WithValidation: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      FileUploadClear,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      const errors = ref<Array<{ fileName: string; messages: string[] }>>([])

      const handleReject = (file: File, fileErrors: FileError[]) => {
        errors.value.push({
          fileName: file.name,
          messages: fileErrors.map((e) => e.message),
        })

        // Clear error after 5 seconds
        setTimeout(() => {
          errors.value = errors.value.filter((e) => e.fileName !== file.name)
        }, 5000)
      }

      return { files, errors, handleReject }
    },
    template: `
      <div class="w-full max-w-md">
        <FileUpload
          v-model="files"
          accept="image/*,.pdf"
          :max-size="2 * 1024 * 1024"
          :max-files="3"
          @file-reject="handleReject"
        >
          <FileUploadDropzone
            class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[reject]:border-destructive data-[reject]:bg-destructive/5"
          >
            <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
            <p class="text-sm font-medium mb-1">Upload Files</p>
            <p class="text-xs text-muted-foreground mb-3">
              Images or PDFs only, max 2MB, up to 3 files
            </p>
            <FileUploadTrigger as-child>
              <Button variant="outline" size="sm">Browse Files</Button>
            </FileUploadTrigger>
          </FileUploadDropzone>

          <div v-if="files.length > 0" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-muted-foreground">{{ files.length }} / 3 files</span>
              <FileUploadClear as-child>
                <Button variant="ghost" size="sm">Clear All</Button>
              </FileUploadClear>
            </div>

            <div class="space-y-2">
              <FileUploadItem
                v-for="file in files"
                :key="file.name"
                :file="file"
                class="flex items-center gap-3 p-3 border border-border rounded-lg"
              >
                <FileUploadItemPreview class="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <IconFile class="text-muted-foreground" :size="20" />
                </FileUploadItemPreview>

                <div class="flex-1 min-w-0">
                  <FileUploadItemName class="block truncate text-sm font-medium" />
                  <FileUploadItemSize class="text-xs text-muted-foreground" />
                </div>

                <FileUploadItemDelete as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <IconX :size="16" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            </div>
          </div>
        </FileUpload>

        <!-- Error messages -->
        <div v-if="errors.length > 0" class="mt-4 space-y-2">
          <div
            v-for="error in errors"
            :key="error.fileName"
            class="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm"
          >
            <p class="font-medium">{{ error.fileName }}</p>
            <ul class="list-disc list-inside mt-1 text-xs">
              <li v-for="message in error.messages" :key="message">{{ message }}</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  }),
}

export const SingleFile: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <FileUpload v-model="files" :multiple="false" class="w-full max-w-md">
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5"
        >
          <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm text-muted-foreground mb-3">
            Upload a single file
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm">Select File</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <FileUploadItem
          v-if="files.length > 0"
          :file="files[0]"
          class="flex items-center gap-3 p-3 mt-4 border border-border rounded-lg"
        >
          <FileUploadItemPreview class="w-10 h-10 rounded bg-muted flex items-center justify-center">
            <IconFile class="text-muted-foreground" :size="20" />
          </FileUploadItemPreview>

          <div class="flex-1 min-w-0">
            <FileUploadItemName class="block truncate text-sm font-medium" />
            <FileUploadItemSize class="text-xs text-muted-foreground" />
          </div>

          <FileUploadItemDelete as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <IconX :size="16" />
            </Button>
          </FileUploadItemDelete>
        </FileUploadItem>
      </FileUpload>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      Button,
      IconUpload,
    },
    template: `
      <FileUpload disabled class="w-full max-w-md">
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center opacity-50 cursor-not-allowed"
        >
          <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm text-muted-foreground mb-3">
            File upload is disabled
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm" disabled>Browse Files</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      </FileUpload>
    `,
  }),
}

export const CustomDropzoneStyle: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      return { files }
    },
    template: `
      <FileUpload v-model="files" class="w-full max-w-md">
        <FileUploadDropzone
          v-slot="{ isDragging }"
          class="relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200"
          :class="[
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-border hover:border-primary/50'
          ]"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 transition-opacity"
            :class="{ 'opacity-100': isDragging }"
          />
          <div class="relative">
            <div
              class="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-200"
              :class="{ 'scale-110': isDragging }"
            >
              <IconUpload class="text-primary" :size="28" />
            </div>
            <p class="text-base font-medium mb-1">
              {{ isDragging ? 'Drop files here' : 'Upload your files' }}
            </p>
            <p class="text-sm text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            <FileUploadTrigger as-child>
              <Button>Choose Files</Button>
            </FileUploadTrigger>
          </div>
        </FileUploadDropzone>

        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <FileUploadItem
            v-for="file in files"
            :key="file.name"
            :file="file"
            class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <FileUploadItemPreview class="w-10 h-10 rounded bg-background flex items-center justify-center">
              <IconFile class="text-muted-foreground" :size="20" />
            </FileUploadItemPreview>

            <div class="flex-1 min-w-0">
              <FileUploadItemName class="block truncate text-sm font-medium" />
              <FileUploadItemSize class="text-xs text-muted-foreground" />
            </div>

            <FileUploadItemDelete as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <IconX :size="16" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </div>
      </FileUpload>
    `,
  }),
}

export const DocumentUpload: Story = {
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconFileTypePdf,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])

      const getFileIcon = (file: File) => {
        if (file.type === 'application/pdf') return IconFileTypePdf
        return IconFile
      }

      return { files, getFileIcon }
    },
    template: `
      <FileUpload
        v-model="files"
        accept=".pdf,.doc,.docx,.txt"
        class="w-full max-w-md"
      >
        <FileUploadDropzone
          class="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5"
        >
          <IconUpload class="mx-auto mb-3 text-muted-foreground" :size="32" />
          <p class="text-sm font-medium mb-1">Upload Documents</p>
          <p class="text-xs text-muted-foreground mb-3">
            PDF, DOC, DOCX, TXT files
          </p>
          <FileUploadTrigger as-child>
            <Button variant="outline" size="sm">Browse Documents</Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <FileUploadItem
            v-for="file in files"
            :key="file.name"
            :file="file"
            class="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <FileUploadItemPreview class="w-10 h-10 rounded bg-muted flex items-center justify-center">
              <component :is="getFileIcon(file)" class="text-muted-foreground" :size="20" />
            </FileUploadItemPreview>

            <div class="flex-1 min-w-0">
              <FileUploadItemName class="block truncate text-sm font-medium" />
              <FileUploadItemSize class="text-xs text-muted-foreground" />
            </div>

            <FileUploadItemDelete as-child>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <IconX :size="16" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </div>
      </FileUpload>
    `,
  }),
}

export const WithChatInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Integrate into a chat input for uploading files. For demo the `Dropzone` is absolutely positioned to cover the entire viewport.',
      },
    },
  },
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      ScrollArea,
      ScrollBar,
      IconFile,
      IconPaperclip,
      IconArrowUp,
      IconX,
      IconUpload,
    },
    setup() {
      const files = ref<File[]>([])
      const message = ref('')

      const handleSend = () => {
        if (message.value.trim() || files.value.length > 0) {
          alert(`Sending message: "${message.value}" with ${files.value.length} file(s)`)
          message.value = ''
          files.value = []
        }
      }

      return { files, message, handleSend }
    },
    template: `
      <div class="relative w-full max-w-lg">
        <FileUpload v-model="files" class="w-full">
          <!-- Full-area dropzone overlay (hidden until dragging) -->
          <FileUploadDropzone
            v-slot="{ isDragging }"
            class="absolute inset-0 z-10 pointer-events-none"
            :class="{ 'pointer-events-auto': isDragging }"
          >
            <div
              v-if="isDragging"
              class="absolute inset-0 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg flex items-center justify-center"
            >
              <div class="text-center">
                <IconUpload class="mx-auto mb-2 text-primary" :size="32" />
                <p class="text-sm font-medium text-primary">Drop files here</p>
              </div>
            </div>
          </FileUploadDropzone>

          <!-- Chat input container -->
          <div class="border border-border rounded-lg bg-background">
            <!-- File attachments row -->
            <div v-if="files.length > 0" class="p-2 border-b border-border">
              <ScrollArea class="w-full">
                <div class="flex gap-2">
                  <FileUploadItem
                    v-for="file in files"
                    :key="file.name"
                    :file="file"
                    class="relative flex-shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 bg-muted rounded-lg max-w-[200px]"
                  >
                    <FileUploadItemPreview class="w-8 h-8 rounded bg-background flex items-center justify-center flex-shrink-0">
                      <IconFile class="text-muted-foreground" :size="16" />
                    </FileUploadItemPreview>

                    <div class="flex-1 min-w-0">
                      <FileUploadItemName class="block truncate text-xs font-medium" />
                      <FileUploadItemSize class="text-[10px] text-muted-foreground" />
                    </div>

                    <FileUploadItemDelete as-child>
                      <button
                        class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                      >
                        <IconX :size="14" />
                      </button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <!-- Input area -->
            <div class="p-3">
              <textarea
                v-model="message"
                placeholder="Type your message here..."
                rows="2"
                class="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                @keydown.enter.prevent="handleSend"
              />
            </div>

            <!-- Actions row -->
            <div class="flex items-center justify-end gap-2 px-3 pb-3">
              <FileUploadTrigger as-child>
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <IconPaperclip :size="18" />
                </Button>
              </FileUploadTrigger>

              <Button
                size="icon"
                class="h-8 w-8 rounded-full"
                :disabled="!message.trim() && files.length === 0"
                @click="handleSend"
              >
                <IconArrowUp :size="18" />
              </Button>
            </div>
          </div>
        </FileUpload>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates all events emitted by the FileUpload component:
- \`update:modelValue\` - Fired when files array changes (v-model)
- \`file-accept\` - Fired for each file that passes validation
- \`file-reject\` - Fired for each file that fails validation, includes error details`,
      },
    },
  },
  render: () => ({
    components: {
      FileUpload,
      FileUploadDropzone,
      FileUploadTrigger,
      FileUploadItem,
      FileUploadItemPreview,
      FileUploadItemName,
      FileUploadItemSize,
      FileUploadItemDelete,
      Button,
      IconUpload,
      IconFile,
      IconX,
    },
    setup() {
      const files = ref<File[]>([])
      const eventLog = ref<Array<{ type: string; message: string; time: string }>>([])

      const logEvent = (type: string, message: string) => {
        const time = new Date().toLocaleTimeString()
        eventLog.value.unshift({ type, message, time })
        // Keep only last 10 events
        if (eventLog.value.length > 10) {
          eventLog.value.pop()
        }
      }

      const handleModelUpdate = (newFiles: File[]) => {
        logEvent(
          'update:modelValue',
          `Files changed: ${newFiles.length} file(s) - [${newFiles.map((f) => f.name).join(', ')}]`,
        )
      }

      const handleFileAccept = (file: File) => {
        logEvent('file-accept', `"${file.name}" accepted (${(file.size / 1024).toFixed(1)} KB)`)
      }

      const handleFileReject = (file: File, errors: FileError[]) => {
        const errorMessages = errors.map((e) => e.message).join('; ')
        logEvent('file-reject', `"${file.name}" rejected: ${errorMessages}`)
      }

      const clearLog = () => {
        eventLog.value = []
      }

      return {
        files,
        eventLog,
        handleModelUpdate,
        handleFileAccept,
        handleFileReject,
        clearLog,
      }
    },
    template: `
      <div class="flex gap-6 w-full max-w-4xl">
        <!-- File Upload -->
        <div class="flex-1">
          <FileUpload
            v-model="files"
            accept="image/*,.pdf"
            :max-size="1 * 1024 * 1024"
            :max-files="3"
            @update:model-value="handleModelUpdate"
            @file-accept="handleFileAccept"
            @file-reject="handleFileReject"
          >
            <FileUploadDropzone
              class="border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors hover:border-primary/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[reject]:border-destructive data-[reject]:bg-destructive/5"
            >
              <IconUpload class="mx-auto mb-2 text-muted-foreground" :size="28" />
              <p class="text-sm font-medium mb-1">Upload Files</p>
              <p class="text-xs text-muted-foreground mb-3">
                Images or PDFs, max 1MB each, up to 3 files
              </p>
              <FileUploadTrigger as-child>
                <Button variant="outline" size="sm">Browse Files</Button>
              </FileUploadTrigger>
            </FileUploadDropzone>

            <div v-if="files.length > 0" class="mt-3 space-y-2">
              <FileUploadItem
                v-for="file in files"
                :key="file.name"
                :file="file"
                class="flex items-center gap-3 p-2 border border-border rounded-lg"
              >
                <FileUploadItemPreview class="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <IconFile class="text-muted-foreground" :size="16" />
                </FileUploadItemPreview>

                <div class="flex-1 min-w-0">
                  <FileUploadItemName class="block truncate text-sm font-medium" />
                  <FileUploadItemSize class="text-xs text-muted-foreground" />
                </div>

                <FileUploadItemDelete as-child>
                  <Button variant="ghost" size="icon" class="h-7 w-7">
                    <IconX :size="14" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            </div>
          </FileUpload>
        </div>

        <!-- Event Log -->
        <div class="flex-1 border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
            <span class="text-sm font-medium">Event Log</span>
            <Button variant="ghost" size="sm" class="h-7 text-xs" @click="clearLog">
              Clear
            </Button>
          </div>
          <div class="p-3 h-64 overflow-y-auto">
            <div v-if="eventLog.length === 0" class="text-sm text-muted-foreground text-center py-8">
              Upload or remove files to see events
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(event, index) in eventLog"
                :key="index"
                class="text-xs p-2 rounded bg-muted/50"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="px-1.5 py-0.5 rounded font-mono text-[10px]"
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': event.type === 'update:modelValue',
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': event.type === 'file-accept',
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': event.type === 'file-reject',
                    }"
                  >
                    {{ event.type }}
                  </span>
                  <span class="text-muted-foreground">{{ event.time }}</span>
                </div>
                <p class="text-muted-foreground">{{ event.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
