const modules = import.meta.glob('../components/examples/**/*.vue')

export function resolveExample(name: string) {
  // Find matching module by filename (case-insensitive)
  for (const [path, loader] of Object.entries(modules)) {
    const filename = path.split('/').pop()?.replace('.vue', '')
    if (filename?.toLowerCase() === name.toLowerCase()) {
      return defineAsyncComponent(loader as any)
    }
  }
  return null
}
