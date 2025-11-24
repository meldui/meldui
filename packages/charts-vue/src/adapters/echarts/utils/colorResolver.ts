import { generateColors, PALETTES } from '../../../config/palettes'
import type { PaletteName } from '../../../types'

/**
 * Resolves colors based on palette or custom colors
 */
export function resolveColors(
  colors: string | string[] | undefined,
  seriesCount: number,
  isDarkMode: boolean,
): string[] {
  if (Array.isArray(colors)) {
    // Custom color array provided
    return colors
  }

  if (typeof colors === 'string' && colors !== 'auto' && colors in PALETTES) {
    // Palette name provided - generate colors for the number of series
    // Automatically adjust for dark mode
    return generateColors(colors as PaletteName, seriesCount, isDarkMode)
  }

  // 'auto' or undefined - use default 'corporate' palette
  return generateColors('corporate', seriesCount, isDarkMode)
}
