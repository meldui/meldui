import { defineComponent, h, type PropType } from 'vue'
import { AvatarGroup } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface ChildRef {
  id: string
  basePath: string
}

const AvatarGroupApi = meldApi('AvatarGroup', {
  children: a2.childList,
  max: a2.num.optional(),
})

const MeldAvatarGroup = defineComponent({
  name: 'MeldAvatarGroup',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const raw = (props.p.children as Array<string | ChildRef> | undefined) ?? []
      const children: ChildRef[] = raw.map((c) => (typeof c === 'string' ? { id: c, basePath } : c))
      return h(
        AvatarGroup,
        { max: props.p.max as number | undefined, 'data-a2ui': 'AvatarGroup' },
        () =>
          children.map((c) =>
            h(DeferredChild, {
              key: `${c.id}@${c.basePath}`,
              surface,
              id: c.id,
              basePath: c.basePath,
            }),
          ),
      )
    }
  },
})

export const avatarGroupEntry = defineVueComponent(AvatarGroupApi, MeldAvatarGroup)
