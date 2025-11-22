import { ref } from 'vue'

export interface UseCopyToClipboardOptions {
  /**
   * Duration in milliseconds to keep the copied state
   * @default 2000
   */
  copiedDuration?: number
  /**
   * Callback when copy succeeds
   */
  onSuccess?: () => void
  /**
   * Callback when copy fails
   */
  onError?: (error: Error) => void
}

export interface UseCopyToClipboardReturn {
  /**
   * Whether the text was recently copied
   */
  isCopied: Readonly<ReturnType<typeof ref<boolean>>>
  /**
   * Whether there was an error during copy
   */
  isError: Readonly<ReturnType<typeof ref<boolean>>>
  /**
   * The error that occurred, if any
   */
  error: Readonly<ReturnType<typeof ref<Error | null>>>
  /**
   * Function to copy text to clipboard
   */
  copy: (text: string) => Promise<void>
}

/**
 * Composable for copying text to clipboard
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { copiedDuration = 2000, onSuccess, onError } = options

  const isCopied = ref(false)
  const isError = ref(false)
  const error = ref<Error | null>(null)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const copy = async (text: string): Promise<void> => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Reset states
    isCopied.value = false
    isError.value = false
    error.value = null

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback to execCommand for older browsers or insecure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        textArea.remove()

        if (!successful) {
          throw new Error('Copy command was unsuccessful')
        }
      }

      // Success
      isCopied.value = true
      onSuccess?.()

      // Reset after duration
      timeoutId = setTimeout(() => {
        isCopied.value = false
        timeoutId = null
      }, copiedDuration)
    } catch (err) {
      // Error occurred
      const copyError = err instanceof Error ? err : new Error('Failed to copy to clipboard')
      error.value = copyError
      isError.value = true
      onError?.(copyError)
    }
  }

  return {
    isCopied,
    isError,
    error,
    copy,
  }
}
