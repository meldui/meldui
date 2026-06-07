import { defineComponent, h, type PropType } from 'vue'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
} from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Item {
  title: string
  description?: string
  timestamp?: string
}

const TimelineApi = meldApi('Timeline', {
  items: z.array(
    z.object({ title: a2.str, description: a2.str.optional(), timestamp: a2.str.optional() }),
  ),
})

const MeldTimeline = defineComponent({
  name: 'MeldTimeline',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const items = (props.p.items as Item[] | undefined) ?? []
      return h(Timeline, { class: 'w-full', 'data-a2ui': 'Timeline' }, () =>
        items.map((it, i) =>
          h(TimelineItem, { key: i }, () => [
            h(TimelineSeparator, () => [
              h(TimelineDot),
              i < items.length - 1 ? h(TimelineConnector) : null,
            ]),
            h(TimelineContent, () => [
              h(TimelineTitle, () => it.title),
              it.description ? h(TimelineDescription, () => it.description) : null,
              it.timestamp ? h(TimelineTime, { dateTime: it.timestamp }, () => it.timestamp) : null,
            ]),
          ]),
        ),
      )
    }
  },
})

export const timelineEntry = defineVueComponent(TimelineApi, MeldTimeline)
