/**
 * Deep merge utility for combining objects
 * Special handling:
 * - Most arrays are replaced entirely (e.g., yAxis for dual-axis charts)
 * - Series array items are merged element-by-element (for markPoint, markLine, etc.)
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]

    // Special handling for 'series' array - merge each element
    if (key === 'series' && Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      // Merge each series item
      output[key] = (targetValue as Record<string, unknown>[]).map((targetItem, index) => {
        const sourceItem = (sourceValue as Record<string, unknown>[])[index]
        if (sourceItem) {
          // Deep merge this series item
          return deepMerge(targetItem, sourceItem)
        }
        return targetItem
      }) as T[Extract<keyof T, string>]
    }
    // Replace other arrays entirely instead of merging
    else if (Array.isArray(sourceValue)) {
      output[key] = sourceValue as T[Extract<keyof T, string>]
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      key in target &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      ) as T[Extract<keyof T, string>]
    } else {
      output[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }

  return output
}
