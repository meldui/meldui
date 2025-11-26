import { computed, onUnmounted, type Ref, ref, watch } from 'vue'
import { isImageFile } from './utils'

/**
 * Composable for generating and managing file previews
 * Automatically creates object URLs for image files and handles cleanup
 */
export function useFilePreview(file: Ref<File> | File) {
  const fileRef = computed(() => (file instanceof File ? file : file.value))
  const previewUrl = ref<string | undefined>()

  const isImage = computed(() => isImageFile(fileRef.value))

  const generatePreview = () => {
    // Cleanup previous preview URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = undefined
    }

    // Generate new preview for images
    if (isImage.value) {
      previewUrl.value = URL.createObjectURL(fileRef.value)
    }
  }

  // Generate preview initially
  generatePreview()

  // Regenerate if file changes (for refs)
  if (!(file instanceof File)) {
    watch(file, () => {
      generatePreview()
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })

  return {
    previewUrl,
    isImage,
  }
}
