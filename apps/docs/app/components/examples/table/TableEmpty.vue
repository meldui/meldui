<script setup lang="ts">
import { Table, TableHeader, TableBody, TableRow, TableHead, TableEmpty } from '@meldui/vue'
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableEmpty :colspan="3">No results found.</TableEmpty>
    </TableBody>
  </Table>
</template>
