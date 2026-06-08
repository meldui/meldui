import type { InjectionKey } from 'vue'

/**
 * When provided as `true`, `DemoBlock` renders only the live component (no
 * Example/Code tabs, no syntax highlighting). The component catalog provides
 * this so existing demo files can be reused as chrome-free previews.
 */
export const DemoPreviewKey: InjectionKey<boolean> = Symbol('demoPreview')

/** Last path segment of a content-collection id, e.g. `components/button` -> `button`. */
export function lastSeg(id: string): string {
  const parts = id.split('/')
  return parts[parts.length - 1]
}

/** kebab/space/underscore -> PascalCase, e.g. `avatar-group` -> `AvatarGroup`. */
export function pascal(s: string): string {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}
