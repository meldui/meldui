<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper, cellRenderers } from '@meldui/vue'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  created_at: string
}

const helper = createColumnHelper<Product>()

const columns = [
  helper.accessor('name', { title: 'Product', enableSorting: true }),
  helper.accessor('price', {
    title: 'Price',
    cell: cellRenderers.currency({ currency: 'USD' }),
  }),
  helper.accessor('stock', {
    title: 'Stock',
    cell: cellRenderers.number({ useGrouping: true }),
  }),
  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge({
      variants: {
        in_stock: { label: 'In Stock', variant: 'success' },
        low_stock: { label: 'Low Stock', variant: 'warning' },
        out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
      },
    }),
  }),
  helper.accessor('created_at', {
    title: 'Added',
    cell: cellRenderers.date({ format: 'medium' }),
  }),
]

const products: Product[] = [
  { id: '1', name: 'Wireless Mouse', price: 29.99, stock: 150, status: 'in_stock', created_at: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Mechanical Keyboard', price: 89.99, stock: 12, status: 'low_stock', created_at: '2024-02-20T14:00:00Z' },
  { id: '3', name: 'USB-C Hub', price: 49.99, stock: 0, status: 'out_of_stock', created_at: '2024-03-10T09:15:00Z' },
  { id: '4', name: 'Monitor Stand', price: 34.99, stock: 75, status: 'in_stock', created_at: '2024-04-05T11:45:00Z' },
  { id: '5', name: 'Webcam HD', price: 59.99, stock: 8, status: 'low_stock', created_at: '2024-05-12T16:20:00Z' },
]

const data = ref(products)
const pageCount = ref(1)

const code = `\u003cscript setup>
import { DataTable, createColumnHelper, cellRenderers } from '@meldui/vue'

const helper = createColumnHelper\u003cProduct>()

const columns = [
  helper.accessor('name', { title: 'Product', enableSorting: true }),
  helper.accessor('price', {
    title: 'Price',
    cell: cellRenderers.currency({ currency: 'USD' }),
  }),
  helper.accessor('stock', {
    title: 'Stock',
    cell: cellRenderers.number({ useGrouping: true }),
  }),
  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge({
      variants: {
        in_stock: { label: 'In Stock', variant: 'success' },
        low_stock: { label: 'Low Stock', variant: 'warning' },
        out_of_stock: { label: 'Out of Stock', variant: 'destructive' },
      },
    }),
  }),
  helper.accessor('created_at', {
    title: 'Added',
    cell: cellRenderers.date({ format: 'medium' }),
  }),
]
\u003c/script>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :on-server-side-change="() => {}"
      />
    </div>
  </DemoBlock>
</template>
