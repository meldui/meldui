/**
 * Deep merge utility for combining objects
 * Special handling:
 * - Most arrays are replaced entirely (e.g., yAxis for dual-axis charts)
 * - Series array items are merged element-by-element (for markPoint, markLine, etc.)
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    // Special handling for 'series' array - merge each element
    if (key === 'series' && Array.isArray(source[key]) && Array.isArray(target[key])) {
      const targetSeries = target[key] as any[]
      const sourceSeries = source[key] as any[]

      // Merge each series item
      output[key] = targetSeries.map((targetItem, index) => {
        if (index < sourceSeries.length && sourceSeries[index]) {
          // Deep merge this series item
          return deepMerge(targetItem, sourceSeries[index])
        }
        return targetItem
      }) as any
    }
    // Replace other arrays entirely instead of merging
    else if (Array.isArray(source[key])) {
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
