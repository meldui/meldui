<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@meldui/vue'

const code = `\u003cscript setup>
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Table>
    <TableCaption>A list of recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">INV001</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell class="text-right">$250.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Table class="w-full max-w-lg">
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell class="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell class="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell class="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </DemoBlock>
</template>
