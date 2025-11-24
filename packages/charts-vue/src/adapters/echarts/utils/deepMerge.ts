/**
 * Deep merge utility for combining objects
 * Arrays are replaced entirely, not merged
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    // Replace arrays entirely instead of merging
    if (Array.isArray(source[key])) {
      output[key] = source[key] as any
    } else if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      key in target &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key] as any)
    } else {
      output[key] = source[key] as any
    }
  }

  return output
}
