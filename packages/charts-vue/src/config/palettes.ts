// Color palette system for charts
// Generates consistent, visually distinct colors for any number of series

export interface Palette {
  name: string
  hueRange: [number, number]
  saturation: number
  lightness: number
  description: string
}

/**
 * Available color palettes for charts
 */
export const PALETTES: Record<string, Palette> = {
  default: {
    name: 'Default',
    hueRange: [210, 280],
    saturation: 70,
    lightness: 50,
    description: 'Professional blues and purples, ideal for business presentations',
  },
  vibrant: {
    name: 'Vibrant',
    hueRange: [0, 360],
    saturation: 85,
    lightness: 55,
    description: 'Bold, saturated colors spanning the full spectrum for high-impact visuals',
  },
  pastel: {
    name: 'Pastel',
    hueRange: [0, 360],
    saturation: 50,
    lightness: 75,
    description: 'Soft, muted colors for elegant and subtle presentations',
  },
  monochrome: {
    name: 'Monochrome',
    hueRange: [210, 230],
    saturation: 20,
    lightness: 45,
    description: 'Shades of blue-gray for minimal, sophisticated aesthetics',
  },
  earth: {
    name: 'Earth',
    hueRange: [20, 60],
    saturation: 60,
    lightness: 45,
    description: 'Natural warm tones including browns, greens, and oranges',
  },
  ocean: {
    name: 'Ocean',
    hueRange: [180, 220],
    saturation: 70,
    lightness: 50,
    description: 'Cool blues and teals inspired by water and sky',
  },
  sunset: {
    name: 'Sunset',
    hueRange: [340, 40],
    saturation: 75,
    lightness: 55,
    description: 'Warm reds, oranges, and purples reminiscent of twilight',
  },
  corporate: {
    name: 'Corporate',
    hueRange: [200, 250],
    saturation: 50,
    lightness: 45,
    description: 'Conservative business colors for professional reports',
  },
  neon: {
    name: 'Neon',
    hueRange: [0, 360],
    saturation: 100,
    lightness: 60,
    description: 'Bright, modern colors for tech and creative applications',
  },
  accessible: {
    name: 'Accessible',
    hueRange: [0, 360],
    saturation: 75,
    lightness: 45,
    description: 'High contrast, colorblind-safe palette for maximum accessibility',
  },
}

/**
 * Maximum recommended number of series in a chart
 * Beyond this, colors become difficult to distinguish
 */
export const MAX_RECOMMENDED_SERIES = 12

/**
 * Generates a consistent set of colors using HSL interpolation
 *
 * @param paletteName - Name of the palette to use
 * @param count - Number of colors to generate
 * @param isDarkMode - Whether to adjust colors for dark mode
 * @returns Array of hex color strings
 *
 * @example
 * ```ts
 * // Generate 5 vibrant colors
 * const colors = generateColors('vibrant', 5)
 * // Returns: ['#e63946', '#f77f00', '#06d6a0', '#118ab2', '#073b4c']
 *
 * // Generate colors optimized for dark mode
 * const darkColors = generateColors('vibrant', 5, true)
 * ```
 */
export function generateColors(
  paletteName: string,
  count: number,
  isDarkMode: boolean = false,
): string[] {
  const palette = PALETTES[paletteName]

  if (!palette) {
    console.warn(`Unknown palette "${paletteName}", falling back to "default"`)
    return generateColors('default', count, isDarkMode)
  }

  if (count <= 0) {
    return []
  }

  // Adjust colors for dark mode
  const { saturation, lightness } = adjustForDarkMode(palette, isDarkMode)

  if (count === 1) {
    // For single color, use the middle of the hue range
    const midHue = (palette.hueRange[0] + palette.hueRange[1]) / 2
    return [hslToHex(midHue, saturation, lightness)]
  }

  const colors: string[] = []
  const [startHue, endHue] = palette.hueRange

  // Handle hue wrapping (e.g., sunset palette: 340 to 40 wraps around 360)
  const hueSpan = endHue > startHue ? endHue - startHue : 360 - startHue + endHue

  for (let i = 0; i < count; i++) {
    // Distribute hues evenly across the range
    const step = hueSpan / count
    let hue = startHue + step * i

    // Wrap hue if it exceeds 360
    if (hue >= 360) {
      hue = hue - 360
    }

    // Special handling for accessible palette - use predefined safe colors
    if (paletteName === 'accessible') {
      hue = getAccessibleHue(i)
    }

    const hex = hslToHex(hue, saturation, lightness)
    colors.push(hex)
  }

  return colors
}

/**
 * Adjusts saturation and lightness for dark mode
 * Different palette types need different adjustments for optimal appearance
 */
function adjustForDarkMode(
  palette: Palette,
  isDarkMode: boolean,
): { saturation: number; lightness: number } {
  if (!isDarkMode) {
    return { saturation: palette.saturation, lightness: palette.lightness }
  }

  // High saturation palettes (vibrant, neon) - reduce saturation, increase lightness
  // Too harsh/bright on dark backgrounds otherwise
  if (palette.saturation >= 85) {
    return {
      saturation: palette.saturation - 15,
      lightness: Math.min(palette.lightness + 15, 70),
    }
  }

  // Already light palettes (pastel) - minimal adjustment
  // These are already soft and work well in dark mode
  if (palette.lightness >= 70) {
    return {
      saturation: palette.saturation,
      lightness: Math.min(palette.lightness + 5, 75),
    }
  }

  // Monochrome/low saturation - moderate lightening
  // Need contrast boost on dark backgrounds
  if (palette.saturation <= 30) {
    return {
      saturation: palette.saturation,
      lightness: Math.min(palette.lightness + 20, 65),
    }
  }

  // Standard adjustment for medium saturation palettes (earth, ocean, sunset, corporate)
  return {
    saturation: palette.saturation,
    lightness: Math.min(palette.lightness + 12, 65),
  }
}

/**
 * Get colorblind-safe hues for accessible palette
 * Uses colors that are distinguishable for most types of color blindness
 */
function getAccessibleHue(index: number): number {
  // Predefined accessible hues that work well for colorblind users
  const accessibleHues = [
    210, // Blue
    30, // Orange
    150, // Green
    300, // Purple
    60, // Yellow
    180, // Cyan
    330, // Pink
    120, // Lime
    240, // Indigo
    0, // Red
    90, // Yellow-Green
    270, // Violet
  ]

  return accessibleHues[index % accessibleHues.length]
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  // Normalize values
  h = h % 360
  s = s / 100
  l = l / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  // Convert to 0-255 range and then to hex
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
