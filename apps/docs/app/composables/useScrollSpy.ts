export function useScrollSpy() {
  const activeId = ref<string>('')

  if (import.meta.client) {
    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeId.value = entry.target.id
            }
          }
        },
        {
          rootMargin: '-80px 0px -80% 0px',
          threshold: 0,
        },
      )

      // Observe all headings with IDs
      const headings = document.querySelectorAll('.prose h2[id], .prose h3[id]')
      for (const heading of headings) {
        observer.observe(heading)
      }

      onUnmounted(() => {
        observer.disconnect()
      })
    })
  }

  return activeId
}
