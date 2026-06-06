import { defineComponent, h, type PropType } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const SIZE: Record<string, string> = { sm: 'size-8', md: 'size-10', lg: 'size-12' }

const AvatarApi = meldApi('Avatar', {
  src: a2.str.optional(),
  alt: a2.str.optional(),
  fallback: a2.str.optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
})

const MeldAvatar = defineComponent({
  name: 'MeldAvatar',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const src = props.p.src as string | undefined
      const alt = props.p.alt as string | undefined
      const fallback = props.p.fallback as string | undefined
      // Only override the base size when explicitly requested, so grouped avatars
      // match the AvatarGroup's built-in "+N" badge (which uses the base size).
      const sizeClass = props.p.size ? SIZE[props.p.size as string] : undefined
      return h(Avatar, { class: sizeClass, 'data-a2ui': 'Avatar' }, () => [
        src ? h(AvatarImage, { src, alt }) : null,
        h(AvatarFallback, () => fallback ?? '?'),
      ])
    }
  },
})

export const avatarEntry = defineVueComponent(AvatarApi, MeldAvatar)
