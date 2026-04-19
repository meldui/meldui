<script setup lang="ts">
import { ref, h } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper, cellRenderers, Badge } from '@meldui/vue'

interface Order {
  id: string
  customer: string
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  items: { name: string; qty: number; price: number }[]
}

const helper = createColumnHelper<Order>()

const columns = [
  helper.expander(),
  helper.accessor('id', { title: 'Order ID', enableSorting: true }),
  helper.accessor('customer', { title: 'Customer' }),
  helper.accessor('total', {
    title: 'Total',
    cell: cellRenderers.currency({ currency: 'USD' }),
  }),
  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge({
      variants: {
        completed: { label: 'Completed', variant: 'success' },
        pending: { label: 'Pending', variant: 'warning' },
        cancelled: { label: 'Cancelled', variant: 'destructive' },
      },
    }),
  }),
]

const orders: Order[] = [
  {
    id: 'ORD-001', customer: 'John Smith', total: 259.97, status: 'completed',
    items: [
      { name: 'Wireless Mouse', qty: 2, price: 29.99 },
      { name: 'Mechanical Keyboard', qty: 1, price: 89.99 },
      { name: 'USB-C Hub', qty: 2, price: 49.99 },
    ],
  },
  {
    id: 'ORD-002', customer: 'Jane Doe', total: 149.99, status: 'pending',
    items: [
      { name: 'Monitor Stand', qty: 1, price: 149.99 },
    ],
  },
  {
    id: 'ORD-003', customer: 'Michael Johnson', total: 89.98, status: 'completed',
    items: [
      { name: 'Webcam HD', qty: 1, price: 59.99 },
      { name: 'Desk Lamp', qty: 1, price: 29.99 },
    ],
  },
  {
    id: 'ORD-004', customer: 'Sarah Williams', total: 0, status: 'cancelled',
    items: [],
  },
  {
    id: 'ORD-005', customer: 'David Brown', total: 199.97, status: 'pending',
    items: [
      { name: 'Headphones', qty: 1, price: 129.99 },
      { name: 'Mouse Pad', qty: 2, price: 19.99 },
      { name: 'Cable Organizer', qty: 1, price: 29.99 },
    ],
  },
]

const data = ref(orders)
const pageCount = ref(1)

const code = `\u003cscript setup lang="ts">
import { DataTable, createColumnHelper, cellRenderers } from '@meldui/vue'

interface Order {
  id: string
  customer: string
  total: number
  status: 'completed' | 'pending' | 'cancelled'
  items: { name: string; qty: number; price: number }[]
}

const helper = createColumnHelper\u003cOrder>()

const columns = [
  helper.expander(),
  helper.accessor('id', { title: 'Order ID' }),
  helper.accessor('customer', { title: 'Customer' }),
  helper.accessor('total', {
    title: 'Total',
    cell: cellRenderers.currency({ currency: 'USD' }),
  }),
  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge({
      variants: {
        completed: { label: 'Completed', variant: 'success' },
        pending: { label: 'Pending', variant: 'warning' },
        cancelled: { label: 'Cancelled', variant: 'destructive' },
      },
    }),
  }),
]
\u003c/script>

\u003ctemplate>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    enable-row-expansion
    :get-row-can-expand="(row) => row.original.items.length > 0"
  >
    <template #expanded-row="{ row }">
      <div class="p-4 bg-muted/30">
        <h4 class="font-medium mb-2">Order Items</h4>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-muted-foreground">
              <th class="pb-1">Item</th>
              <th class="pb-1">Qty</th>
              <th class="pb-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in row.original.items" :key="item.name">
              <td>{{ item.name }}</td>
              <td>x{{ item.qty }}</td>
              <td class="text-right">\${{ item.price.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </DataTable>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :on-server-side-change="() => {}"
        enable-row-expansion
        :get-row-can-expand="(row: any) => row.original.items.length > 0"
      >
        <template #expanded-row="{ row }">
          <div class="p-4 bg-muted/30">
            <div class="font-medium mb-2 text-sm">Order Items</div>
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-muted-foreground">
                  <th class="pb-1">Item</th>
                  <th class="pb-1">Qty</th>
                  <th class="pb-1 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in row.original.items" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>x{{ item.qty }}</td>
                  <td class="text-right">${{ item.price.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </DataTable>
    </div>
  </DemoBlock>
</template>
