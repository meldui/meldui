export function useSearch() {
  const open = useState('search-open', () => false)
  const router = useRouter()

  const { data: pages } = useAsyncData('search-pages', () =>
    queryCollection('docs').select('title', 'description', 'path').all(),
  )

  // Group pages by top-level section
  const grouped = computed(() => {
    const groups: Record<string, NonNullable<typeof pages.value>> = {}
    if (!pages.value) return groups
    for (const page of pages.value) {
      const parts = page.path.split('/').filter(Boolean)
      const section = parts[0] ?? 'Other'
      const label = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      if (!groups[label]) groups[label] = []
      groups[label].push(page)
    }
    return groups
  })

  function select(path: string) {
    open.value = false
    router.push(path)
  }

  return { open, grouped, select }
}
