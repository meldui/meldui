<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@meldui/vue'

const invoices = [
  { id: 'INV001', status: 'Paid', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', amount: '$150.00' },
  { id: 'INV003', status: 'Paid', amount: '$350.00' },
]

const code = `\u003ctemplate>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="inv in invoices" :key="inv.id">
        <TableCell class="font-medium">{{ inv.id }}</TableCell>
        <TableCell>{{ inv.status }}</TableCell>
        <TableCell class="text-right">{{ inv.amount }}</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan="2">Total</TableCell>
        <TableCell class="text-right">$750.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Table class="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="inv in invoices" :key="inv.id">
          <TableCell class="font-medium">{{ inv.id }}</TableCell>
          <TableCell>{{ inv.status }}</TableCell>
          <TableCell class="text-right">{{ inv.amount }}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colspan="2">Total</TableCell>
          <TableCell class="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </DemoBlock>
</template>
