import { defineComponent, h, type PropType } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Column {
  key: string
  header: string
}

const TableApi = meldApi('Table', {
  columns: z.array(z.object({ key: z.string(), header: a2.str })),
  rows: a2.dataBinding,
  caption: a2.str.optional(),
})

const MeldTable = defineComponent({
  name: 'MeldTable',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const columns = (props.p.columns as Column[] | undefined) ?? []
      // `rows` is a DataBinding; resolve it to an array defensively (the binder
      // may surface the raw `{path}` before the data subscription settles).
      let rows = props.p.rows as unknown
      if (!Array.isArray(rows)) {
        rows = props.context.dataContext.resolveDynamicValue(props.p.rows as never)
      }
      const rowList = Array.isArray(rows) ? (rows as Array<Record<string, unknown>>) : []
      const caption = props.p.caption as string | undefined
      return h(Table, { 'data-a2ui': 'Table' }, () => [
        caption ? h(TableCaption, () => caption) : null,
        h(TableHeader, () =>
          h(TableRow, () => columns.map((col) => h(TableHead, { key: col.key }, () => col.header))),
        ),
        h(TableBody, () =>
          rowList.map((row, i) =>
            h(TableRow, { key: i }, () =>
              columns.map((col) =>
                h(TableCell, { key: col.key }, () => String(row[col.key] ?? '')),
              ),
            ),
          ),
        ),
      ])
    }
  },
})

export const tableEntry = defineVueComponent(TableApi, MeldTable)
