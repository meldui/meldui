const sources: Record<string, string> = import.meta.glob('../components/examples/**/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as any

export function useComponentSource(name: string): string {
  for (const [path, source] of Object.entries(sources)) {
    const filename = path.split('/').pop()?.replace('.vue', '')
    if (filename?.toLowerCase() === name.toLowerCase()) {
      return source
    }
  }
  return ''
}
