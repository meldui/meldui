import {
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconBrandMastercard,
  IconBrandVisa,
  IconBuildingBank,
  IconCalendar,
  IconCamera,
  IconChartPie,
  IconCheck,
  IconCoins,
  IconCreditCard,
  IconCurrencyDollar,
  IconDownload,
  IconEdit,
  IconFileExport,
  IconHash,
  IconHome,
  IconLock,
  IconLogout,
  IconMail,
  IconMoon,
  IconNotification,
  IconPhone,
  IconReceipt,
  IconRefresh,
  IconSettings,
  IconShield,
  IconSun,
  IconTag,
  IconTrash,
  IconTrendingUp,
  IconUser,
  IconWallet,
} from '@meldui/tabler-vue'
import type { BulkActionOption, DataTableFilterField } from '@meldui/vue'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DataTable,
  DataTableColumnHeader,
  DataTableSelectHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Progress,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TanStackTable,
} from '@tanstack/vue-table'
import { type Component, computed, h, ref } from 'vue'

const meta: Meta = {
  title: 'Examples/Personal Finance Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

function formatCurrencyValue(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatPercentValue(value: number) {
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%'
}

function formatDateValue(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ============================================================================
// Transaction Types and Mock Data for DataTable
// ============================================================================

interface Transaction {
  id: string
  date: string
  type: 'Buy' | 'Sell' | 'Dividend' | 'Transfer' | 'Fee'
  symbol: string
  name: string
  shares: number
  price: number
  total: number
  fees: number
  notes: string
  is_taxable: boolean
  account: string
}

interface TransactionTableState {
  sorting: SortingState
  filters: ColumnFiltersState
  pagination: PaginationState
}

interface TransactionServerResponse {
  data: Transaction[]
  meta: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// Stock symbols and names for generating data
const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble Co.' },
]

const TRANSACTION_TYPES: Transaction['type'][] = ['Buy', 'Sell', 'Dividend', 'Transfer', 'Fee']
const ACCOUNTS = ['Brokerage', 'Retirement (401k)', 'IRA', 'Savings']

function generateMockTransactions(count: number = 75): Transaction[] {
  const transactions: Transaction[] = []
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2025-11-25')

  for (let i = 0; i < count; i++) {
    const stock = STOCKS[i % STOCKS.length]
    const type = TRANSACTION_TYPES[i % 5 === 4 ? 4 : i % 5 === 3 ? 3 : i % 3]
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
    )

    let shares = 0
    let price = 0
    let total = 0
    let fees = 0

    if (type === 'Buy' || type === 'Sell') {
      shares = Math.floor(Math.random() * 100) + 1
      price = Math.round((Math.random() * 400 + 50) * 100) / 100
      fees = Math.round(Math.random() * 10 * 100) / 100
      total = Math.round(shares * price * 100) / 100
    } else if (type === 'Dividend') {
      shares = Math.floor(Math.random() * 500) + 100
      price = Math.round(Math.random() * 2 * 100) / 100
      total = Math.round(shares * price * 100) / 100
    } else if (type === 'Transfer') {
      total = Math.round((Math.random() * 10000 + 1000) * 100) / 100
    } else if (type === 'Fee') {
      fees = Math.round((Math.random() * 50 + 5) * 100) / 100
      total = fees
    }

    transactions.push({
      id: `txn-${i + 1}`,
      date: randomDate.toISOString().split('T')[0],
      type,
      symbol: type === 'Transfer' || type === 'Fee' ? '-' : stock.symbol,
      name: type === 'Transfer' ? 'Account Transfer' : type === 'Fee' ? 'Platform Fee' : stock.name,
      shares,
      price,
      total,
      fees,
      notes: i % 5 === 0 ? 'Quarterly rebalancing' : '',
      is_taxable: type !== 'Transfer' && i % 3 !== 0,
      account: ACCOUNTS[i % ACCOUNTS.length],
    })
  }

  // Sort by date descending
  return transactions.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const MOCK_TRANSACTIONS = generateMockTransactions(75)

// Server-side simulation for transactions
function simulateTransactionServerSide(
  data: Transaction[],
  tableState: TransactionTableState,
): TransactionServerResponse {
  let filteredData = [...data]

  // Apply filters
  tableState.filters.forEach((filter) => {
    const { id, value } = filter
    if (value === undefined || value === null || value === '') return

    switch (id) {
      case 'symbol':
        // Search is a plain string
        if (typeof value === 'string') {
          filteredData = filteredData.filter(
            (txn) =>
              txn.symbol.toLowerCase().includes(value.toLowerCase()) ||
              txn.name.toLowerCase().includes(value.toLowerCase()),
          )
        }
        break

      case 'type':
        // Multiselect returns string[]
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((txn) => value.includes(txn.type))
        } else if (typeof value === 'string') {
          filteredData = filteredData.filter((txn) => txn.type === value)
        }
        break

      case 'account':
        // Multiselect returns string[]
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((txn) => value.includes(txn.account))
        }
        break

      case 'shares':
        // Number filter returns array of numbers
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((txn) => value.includes(txn.shares))
        } else if (typeof value === 'number') {
          filteredData = filteredData.filter((txn) => txn.shares === value)
        }
        break

      case 'total':
        // Range filter returns array of tuples [[min, max], ...]
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((txn) =>
            value.some((range: [number, number]) => {
              const [min, max] = range
              return txn.total >= min && txn.total <= max
            }),
          )
        }
        break

      case 'is_taxable':
        // Boolean filter returns boolean
        if (typeof value === 'boolean') {
          filteredData = filteredData.filter((txn) => txn.is_taxable === value)
        }
        break

      case 'date':
        // Date filter returns array of DateValue objects { year, month, day }
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((txn) => {
            const txnDate = new Date(txn.date)
            return value.some((dateVal: { year: number; month: number; day: number }) => {
              const filterDate = new Date(dateVal.year, dateVal.month - 1, dateVal.day)
              return txnDate.toDateString() === filterDate.toDateString()
            })
          })
        }
        break
    }
  })

  // Apply sorting
  if (tableState.sorting.length > 0) {
    const { id, desc } = tableState.sorting[0]
    filteredData.sort((a, b) => {
      const aVal = a[id as keyof Transaction]
      const bVal = b[id as keyof Transaction]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else {
        comparison = aVal < bVal ? -1 : 1
      }
      return desc ? -comparison : comparison
    })
  }

  // Apply pagination
  const { pageIndex, pageSize } = tableState.pagination
  const start = pageIndex * pageSize
  const paginatedData = filteredData.slice(start, start + pageSize)

  return {
    data: paginatedData,
    meta: {
      current_page: pageIndex + 1,
      per_page: pageSize,
      total: filteredData.length,
      total_pages: Math.ceil(filteredData.length / pageSize),
    },
  }
}

// Column header helper
function createTransactionColumnHeader<TData, TValue>(
  column: Column<TData, TValue>,
  title: string,
  table?: TanStackTable<TData>,
) {
  return h(DataTableColumnHeader as Component, { column, table, title })
}

// Filter options
const transactionTypeOptions = [
  { label: 'Buy', value: 'Buy' },
  { label: 'Sell', value: 'Sell' },
  { label: 'Dividend', value: 'Dividend' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Fee', value: 'Fee' },
]

const accountOptions = [
  { label: 'Brokerage', value: 'Brokerage' },
  { label: 'Retirement (401k)', value: 'Retirement (401k)' },
  { label: 'IRA', value: 'IRA' },
  { label: 'Savings', value: 'Savings' },
]

export const FullApplication: Story = {
  render: () => ({
    components: {
      Avatar,
      AvatarFallback,
      Badge,
      Button,
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
      DataTable,
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
      IconArrowDown,
      IconArrowUp,
      IconBell,
      IconBrandMastercard,
      IconBrandVisa,
      IconBuildingBank,
      IconCalendar,
      IconCamera,
      IconChartPie,
      IconCheck,
      IconCoins,
      IconCreditCard,
      IconDownload,
      IconEdit,
      IconHome,
      IconLock,
      IconLogout,
      IconMail,
      IconMoon,
      IconNotification,
      IconPhone,
      IconReceipt,
      IconRefresh,
      IconSettings,
      IconShield,
      IconSun,
      IconTrendingUp,
      IconUser,
      IconWallet,
      Input,
      Label,
      Progress,
      Separator,
      Sidebar,
      SidebarContent,
      SidebarFooter,
      SidebarGroup,
      SidebarGroupContent,
      SidebarGroupLabel,
      SidebarHeader,
      SidebarInset,
      SidebarMenu,
      SidebarMenuButton,
      SidebarMenuItem,
      SidebarProvider,
      SidebarTrigger,
      Switch,
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
      Textarea,
    },
    setup() {
      const activePage = ref('dashboard')

      const portfolioValue = 487650.32
      const dayChange = 3245.67
      const dayChangePercent = 0.67
      const ytdReturn = 18.4
      const totalInvested = 412000.0

      const assetAllocation = [
        { type: 'Stocks', value: 292590, percentage: 60, color: 'bg-blue-500' },
        { type: 'Bonds', value: 97530, percentage: 20, color: 'bg-green-500' },
        { type: 'Real Estate', value: 73147.5, percentage: 15, color: 'bg-purple-500' },
        { type: 'Cash', value: 24382.82, percentage: 5, color: 'bg-gray-500' },
      ]

      const holdings = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 500,
          avgPrice: 145.32,
          currentPrice: 182.52,
          value: 91260,
          gain: 18600,
          gainPercent: 25.6,
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 300,
          avgPrice: 280.15,
          currentPrice: 378.91,
          value: 113673,
          gain: 29628,
          gainPercent: 35.26,
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          shares: 200,
          avgPrice: 125.8,
          currentPrice: 142.87,
          value: 28574,
          gain: 3414,
          gainPercent: 13.57,
        },
        {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          shares: 150,
          avgPrice: 215.45,
          currentPrice: 238.72,
          value: 35808,
          gain: 3490.5,
          gainPercent: 10.8,
        },
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          shares: 100,
          avgPrice: 142.35,
          currentPrice: 178.35,
          value: 17835,
          gain: 3600,
          gainPercent: 25.29,
        },
      ]

      const transactions = [
        {
          date: '2025-11-22',
          type: 'Buy',
          symbol: 'AAPL',
          shares: 50,
          price: 182.52,
          total: 9126.0,
        },
        {
          date: '2025-11-20',
          type: 'Sell',
          symbol: 'NVDA',
          shares: 25,
          price: 495.22,
          total: 12380.5,
        },
        {
          date: '2025-11-18',
          type: 'Dividend',
          symbol: 'MSFT',
          shares: 300,
          price: 0.75,
          total: 225.0,
        },
        {
          date: '2025-11-15',
          type: 'Buy',
          symbol: 'GOOGL',
          shares: 30,
          price: 142.87,
          total: 4286.1,
        },
        {
          date: '2025-11-12',
          type: 'Buy',
          symbol: 'TSLA',
          shares: 20,
          price: 238.72,
          total: 4774.4,
        },
        {
          date: '2025-11-10',
          type: 'Dividend',
          symbol: 'AAPL',
          shares: 500,
          price: 0.24,
          total: 120.0,
        },
        {
          date: '2025-11-08',
          type: 'Buy',
          symbol: 'MSFT',
          shares: 50,
          price: 378.91,
          total: 18945.5,
        },
      ]

      const accounts = [
        {
          name: 'Investment Account',
          type: 'Brokerage',
          balance: 365267.5,
          institution: 'Vanguard',
          accountNumber: '****3421',
        },
        {
          name: 'Retirement (401k)',
          type: 'Retirement',
          balance: 98000.0,
          institution: 'Fidelity',
          accountNumber: '****7890',
        },
        {
          name: 'Savings',
          type: 'Cash',
          balance: 24382.82,
          institution: 'Chase',
          accountNumber: '****1234',
        },
      ]

      const cards = [
        {
          id: 1,
          name: 'Chase Sapphire Reserve',
          type: 'Credit',
          brand: 'Visa',
          lastFour: '4532',
          expiryDate: '12/26',
          balance: 2145.67,
          limit: 25000,
          status: 'Active',
        },
        {
          id: 2,
          name: 'American Express Gold',
          type: 'Credit',
          brand: 'Mastercard',
          lastFour: '8765',
          expiryDate: '08/27',
          balance: 856.32,
          limit: 15000,
          status: 'Active',
        },
        {
          id: 3,
          name: 'Bank of America Cash Rewards',
          type: 'Credit',
          brand: 'Visa',
          lastFour: '2109',
          expiryDate: '03/25',
          balance: 0.0,
          limit: 10000,
          status: 'Active',
        },
      ]

      // Settings state
      const emailNotifications = ref(true)
      const pushNotifications = ref(true)
      const smsAlerts = ref(false)
      const weeklyReports = ref(true)
      const monthlyReports = ref(true)
      const darkMode = ref(false)
      const twoFactorAuth = ref(true)
      const biometricLogin = ref(true)

      // ========================================================================
      // DataTable Configuration for Transactions
      // ========================================================================

      const transactionTableRef = ref()

      // Initialize with server-side simulation
      const transactionData = ref(
        simulateTransactionServerSide(MOCK_TRANSACTIONS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const transactionPageCount = computed(() => transactionData.value.meta.total_pages)

      // Column definitions with sorting
      const transactionColumns: ColumnDef<Transaction>[] = [
        {
          id: 'select',
          header: ({ table }) => h(DataTableSelectHeader as Component, { table }),
          cell: ({ row }) =>
            h(Checkbox as Component, {
              modelValue: row.getIsSelected(),
              'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
              ariaLabel: 'Select row',
            }),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: 'date',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Date', table),
          cell: ({ row }) => {
            const date = new Date(row.getValue('date') as string)
            return h(
              'div',
              { class: 'font-medium' },
              date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            )
          },
          meta: { displayName: 'Date' },
          enableSorting: true,
        },
        {
          accessorKey: 'type',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Type', table),
          cell: ({ row }) => {
            const type = row.getValue('type') as string
            const variants: Record<string, string> = {
              Buy: 'default',
              Sell: 'destructive',
              Dividend: 'secondary',
              Transfer: 'outline',
              Fee: 'outline',
            }
            return h(Badge as Component, { variant: variants[type] || 'default' }, () => type)
          },
          meta: { displayName: 'Type' },
          enableSorting: true,
        },
        {
          accessorKey: 'symbol',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Symbol', table),
          cell: ({ row }) => h('div', { class: 'font-bold' }, row.getValue('symbol')),
          meta: { displayName: 'Symbol' },
          enableSorting: true,
        },
        {
          accessorKey: 'name',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Name', table),
          cell: ({ row }) =>
            h(
              'div',
              { class: 'text-muted-foreground max-w-[200px] truncate' },
              row.getValue('name'),
            ),
          meta: { displayName: 'Name' },
          enableSorting: true,
        },
        {
          accessorKey: 'shares',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Shares', table),
          cell: ({ row }) => {
            const shares = row.getValue('shares') as number
            return h('div', { class: 'text-right' }, shares > 0 ? shares.toString() : '-')
          },
          meta: { displayName: 'Shares' },
          enableSorting: true,
        },
        {
          accessorKey: 'price',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Price', table),
          cell: ({ row }) => {
            const price = row.getValue('price') as number
            return h(
              'div',
              { class: 'text-right' },
              price > 0
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    price,
                  )
                : '-',
            )
          },
          meta: { displayName: 'Price' },
          enableSorting: true,
        },
        {
          accessorKey: 'total',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Total', table),
          cell: ({ row }) => {
            const total = row.getValue('total') as number
            const type = row.original.type
            const isPositive = type === 'Sell' || type === 'Dividend'
            return h(
              'div',
              { class: `text-right font-medium ${isPositive ? 'text-success' : ''}` },
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total),
            )
          },
          meta: { displayName: 'Total' },
          enableSorting: true,
        },
        {
          accessorKey: 'account',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Account', table),
          cell: ({ row }) =>
            h(Badge as Component, { variant: 'outline' }, () => row.getValue('account')),
          meta: { displayName: 'Account' },
          enableSorting: true,
        },
        {
          accessorKey: 'is_taxable',
          header: ({ column, table }) => createTransactionColumnHeader(column, 'Taxable', table),
          cell: ({ row }) => {
            const taxable = row.getValue('is_taxable') as boolean
            return taxable
              ? h(Badge as Component, { variant: 'default', class: 'bg-amber-500' }, () => 'Yes')
              : h(Badge as Component, { variant: 'secondary' }, () => 'No')
          },
          meta: { displayName: 'Taxable' },
        },
      ]

      // Filter fields - demonstrating multiple filter types
      const transactionFilterFields: DataTableFilterField<Transaction>[] = [
        {
          id: 'type',
          label: 'Type',
          type: 'multiselect',
          icon: IconTag,
          options: transactionTypeOptions,
        },
        {
          id: 'account',
          label: 'Account',
          type: 'multiselect',
          icon: IconBuildingBank,
          options: accountOptions,
        },
        {
          id: 'total',
          label: 'Amount',
          type: 'range',
          icon: IconCurrencyDollar,
          range: [0, 50000] as [number, number],
          step: 500,
          unit: '$',
        },
        {
          id: 'shares',
          label: 'Shares',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter shares',
          min: 1,
          max: 1000,
        },
        {
          id: 'is_taxable',
          label: 'Taxable',
          type: 'boolean',
          icon: IconCheck,
        },
        {
          id: 'date',
          label: 'Date',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Pick a date',
        },
      ]

      // Bulk actions
      const transactionBulkActions: BulkActionOption<Transaction>[] = [
        {
          label: 'Export CSV',
          icon: IconFileExport,
          action: () => {
            const selectedRows = transactionTableRef.value?.selectedRows as
              | Transaction[]
              | undefined
            if (selectedRows && selectedRows.length > 0) {
              const headers = [
                'Date',
                'Type',
                'Symbol',
                'Name',
                'Shares',
                'Price',
                'Total',
                'Account',
              ]
              const csv = [
                headers.join(','),
                ...selectedRows.map((row) =>
                  [
                    row.date,
                    row.type,
                    row.symbol,
                    row.name,
                    row.shares,
                    row.price,
                    row.total,
                    row.account,
                  ].join(','),
                ),
              ].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
              a.click()
              URL.revokeObjectURL(url)
              alert(`Exported ${selectedRows.length} transaction(s) to CSV`)
            }
          },
        },
        {
          label: 'Export JSON',
          icon: IconDownload,
          action: () => {
            const selectedRows = transactionTableRef.value?.selectedRows as
              | Transaction[]
              | undefined
            if (selectedRows && selectedRows.length > 0) {
              const data = JSON.stringify(selectedRows, null, 2)
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `transactions-${new Date().toISOString().slice(0, 10)}.json`
              a.click()
              URL.revokeObjectURL(url)
              alert(`Exported ${selectedRows.length} transaction(s) to JSON`)
            }
          },
        },
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const selectedRows = transactionTableRef.value?.selectedRows as
              | Transaction[]
              | undefined
            if (selectedRows && selectedRows.length > 0) {
              if (
                confirm(`Are you sure you want to delete ${selectedRows.length} transaction(s)?`)
              ) {
                alert(`Deleted ${selectedRows.length} transaction(s)`)
                transactionTableRef.value?.resetSelection()
              }
            }
          },
        },
      ]

      // Handle server-side changes
      const handleTransactionChange = (state: TransactionTableState) => {
        transactionData.value = simulateTransactionServerSide(MOCK_TRANSACTIONS, state)
      }

      return {
        activePage,
        portfolioValue,
        dayChange,
        dayChangePercent,
        ytdReturn,
        totalInvested,
        assetAllocation,
        holdings,
        transactions,
        accounts,
        cards,
        emailNotifications,
        pushNotifications,
        smsAlerts,
        weeklyReports,
        monthlyReports,
        darkMode,
        twoFactorAuth,
        biometricLogin,
        formatCurrency: formatCurrencyValue,
        formatPercent: formatPercentValue,
        formatDate: formatDateValue,
        // DataTable for Transactions
        transactionTableRef,
        transactionData,
        transactionPageCount,
        transactionColumns,
        transactionFilterFields,
        transactionBulkActions,
        handleTransactionChange,
      }
    },
    template: `
      <SidebarProvider default-open>
        <!-- Sidebar Navigation -->
        <Sidebar collapsible="icon">
          <SidebarHeader class="border-b px-4 py-3">
            <div class="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shrink-0">
                W
              </div>
              <div class="flex flex-col group-data-[collapsible=icon]:hidden">
                <span class="text-sm font-semibold">WealthTracker</span>
                <span class="text-xs text-muted-foreground">Personal Finance</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'dashboard'"
                      @click="activePage = 'dashboard'"
                      tooltip="Dashboard"
                    >
                      <IconHome :size="16" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'portfolio'"
                      @click="activePage = 'portfolio'"
                      tooltip="Portfolio"
                    >
                      <IconChartPie :size="16" />
                      <span>Portfolio</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'transactions'"
                      @click="activePage = 'transactions'"
                      tooltip="Transactions"
                    >
                      <IconReceipt :size="16" />
                      <span>Transactions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Accounts</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'accounts'"
                      @click="activePage = 'accounts'"
                      tooltip="Accounts"
                    >
                      <IconBuildingBank :size="16" />
                      <span>Accounts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'cards'"
                      @click="activePage = 'cards'"
                      tooltip="Cards"
                    >
                      <IconCreditCard :size="16" />
                      <span>Cards</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'profile'"
                      @click="activePage = 'profile'"
                      tooltip="Profile"
                    >
                      <IconUser :size="16" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'settings'"
                      @click="activePage = 'settings'"
                      tooltip="Settings"
                    >
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter class="border-t p-4">
            <div class="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Avatar class="h-8 w-8 shrink-0">
                <AvatarFallback class="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
              </Avatar>
              <div class="flex flex-col flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <span class="text-sm font-medium truncate">John Doe</span>
                <span class="text-xs text-muted-foreground truncate">john@example.com</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <!-- Main Content Area -->
        <SidebarInset>
          <!-- Header -->
          <header class="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
            <div class="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" class="h-6" />
              <h1 class="text-lg font-semibold">
                {{ activePage === 'dashboard' ? 'Dashboard' : '' }}
                {{ activePage === 'portfolio' ? 'Portfolio' : '' }}
                {{ activePage === 'transactions' ? 'Transactions' : '' }}
                {{ activePage === 'accounts' ? 'Accounts' : '' }}
                {{ activePage === 'cards' ? 'Cards' : '' }}
                {{ activePage === 'profile' ? 'Profile' : '' }}
                {{ activePage === 'settings' ? 'Settings' : '' }}
              </h1>
            </div>

            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IconRefresh :size="16" class="mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="icon" class="relative">
                <IconBell :size="20" />
                <span class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon">
                    <Avatar class="h-8 w-8">
                      <AvatarFallback class="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconUser :size="16" class="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconSettings :size="16" class="mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive">
                    <IconLogout :size="16" class="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <!-- Dashboard Content -->
          <div v-if="activePage === 'dashboard'" class="flex flex-1 flex-col gap-6 p-6">
            <!-- Welcome Section -->
            <div>
              <h2 class="text-2xl font-bold">Welcome back, John</h2>
              <p class="text-muted-foreground">Here's what's happening with your finances today.</p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader class="pb-2">
                  <div class="flex items-center justify-between">
                    <CardDescription>Total Portfolio</CardDescription>
                    <div class="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <IconWallet :size="18" class="text-blue-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(portfolioValue) }}</div>
                  <div class="flex items-center gap-1 mt-2">
                    <IconTrendingUp :size="16" class="text-success" />
                    <span class="text-sm text-success font-medium">{{ formatPercent(ytdReturn) }} YTD</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <div class="flex items-center justify-between">
                    <CardDescription>Today's Change</CardDescription>
                    <div class="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <IconArrowUp :size="18" class="text-green-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold text-success">{{ formatCurrency(dayChange) }}</div>
                  <div class="flex items-center gap-1 mt-2">
                    <span class="text-sm text-success font-medium">{{ formatPercent(dayChangePercent) }}</span>
                    <span class="text-sm text-muted-foreground">since yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <div class="flex items-center justify-between">
                    <CardDescription>Total Invested</CardDescription>
                    <div class="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <IconCoins :size="18" class="text-purple-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(totalInvested) }}</div>
                  <div class="flex items-center gap-1 mt-2">
                    <span class="text-sm text-muted-foreground">Total capital</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="pb-2">
                  <div class="flex items-center justify-between">
                    <CardDescription>Total Gain</CardDescription>
                    <div class="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <IconTrendingUp :size="18" class="text-green-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold text-success">{{ formatCurrency(portfolioValue - totalInvested) }}</div>
                  <div class="flex items-center gap-1 mt-2">
                    <span class="text-sm text-success font-medium">{{ formatPercent(((portfolioValue - totalInvested) / totalInvested) * 100) }}</span>
                    <span class="text-sm text-muted-foreground">return</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Portfolio Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Asset Allocation -->
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <IconChartPie :size="20" />
                    Asset Allocation
                  </CardTitle>
                  <CardDescription>Your portfolio distribution</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div v-for="asset in assetAllocation" :key="asset.type" class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2">
                        <div :class="asset.color" class="h-3 w-3 rounded-full"></div>
                        <span class="font-medium">{{ asset.type }}</span>
                      </div>
                      <span class="text-muted-foreground">{{ asset.percentage }}%</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <Progress :model-value="asset.percentage" class="flex-1" />
                      <span class="text-sm font-medium min-w-[100px] text-right">{{ formatCurrency(asset.value) }}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Top Holdings -->
              <Card class="lg:col-span-2">
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Holdings</CardTitle>
                      <CardDescription>Your largest positions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" @click="activePage = 'portfolio'">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead class="text-right">Value</TableHead>
                        <TableHead class="text-right">Gain/Loss</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="holding in holdings.slice(0, 3)" :key="holding.symbol">
                        <TableCell class="font-medium">{{ holding.symbol }}</TableCell>
                        <TableCell class="text-muted-foreground">{{ holding.name }}</TableCell>
                        <TableCell class="text-right font-medium">{{ formatCurrency(holding.value) }}</TableCell>
                        <TableCell class="text-right">
                          <div class="flex flex-col items-end">
                            <span :class="holding.gain >= 0 ? 'text-success' : 'text-destructive'" class="font-medium text-sm">
                              {{ formatCurrency(holding.gain) }}
                            </span>
                            <div class="flex items-center gap-1">
                              <IconArrowUp v-if="holding.gain >= 0" :size="12" class="text-success" />
                              <IconArrowDown v-else :size="12" class="text-destructive" />
                              <span :class="holding.gain >= 0 ? 'text-success' : 'text-destructive'" class="text-xs">
                                {{ formatPercent(holding.gainPercent) }}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <!-- Recent Transactions -->
            <Card>
              <CardHeader>
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest activities</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" @click="activePage = 'transactions'">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead class="text-right">Shares</TableHead>
                      <TableHead class="text-right">Price</TableHead>
                      <TableHead class="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(transaction, index) in transactions.slice(0, 5)" :key="index">
                      <TableCell class="text-muted-foreground text-sm">{{ formatDate(transaction.date) }}</TableCell>
                      <TableCell>
                        <Badge
                          :variant="transaction.type === 'Buy' ? 'default' : transaction.type === 'Sell' ? 'destructive' : 'secondary'"
                        >
                          {{ transaction.type }}
                        </Badge>
                      </TableCell>
                      <TableCell class="font-medium">{{ transaction.symbol }}</TableCell>
                      <TableCell class="text-right">{{ transaction.shares }}</TableCell>
                      <TableCell class="text-right">{{ formatCurrency(transaction.price) }}</TableCell>
                      <TableCell class="text-right font-medium">{{ formatCurrency(transaction.total) }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <!-- Portfolio Page -->
          <div v-if="activePage === 'portfolio'" class="flex flex-1 flex-col gap-6 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Portfolio Holdings</h2>
                <p class="text-muted-foreground">View and manage your investments</p>
              </div>
              <Button>
                <IconDownload :size="16" class="mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Holdings</CardTitle>
                <CardDescription>Complete list of your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead class="text-right">Shares</TableHead>
                      <TableHead class="text-right">Avg Price</TableHead>
                      <TableHead class="text-right">Current Price</TableHead>
                      <TableHead class="text-right">Value</TableHead>
                      <TableHead class="text-right">Gain/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="holding in holdings" :key="holding.symbol">
                      <TableCell class="font-bold">{{ holding.symbol }}</TableCell>
                      <TableCell class="text-muted-foreground">{{ holding.name }}</TableCell>
                      <TableCell class="text-right">{{ holding.shares }}</TableCell>
                      <TableCell class="text-right">{{ formatCurrency(holding.avgPrice) }}</TableCell>
                      <TableCell class="text-right">{{ formatCurrency(holding.currentPrice) }}</TableCell>
                      <TableCell class="text-right font-medium">{{ formatCurrency(holding.value) }}</TableCell>
                      <TableCell class="text-right">
                        <div class="flex flex-col items-end">
                          <span :class="holding.gain >= 0 ? 'text-success' : 'text-destructive'" class="font-bold">
                            {{ formatCurrency(holding.gain) }}
                          </span>
                          <div class="flex items-center gap-1">
                            <IconArrowUp v-if="holding.gain >= 0" :size="12" class="text-success" />
                            <IconArrowDown v-else :size="12" class="text-destructive" />
                            <span :class="holding.gain >= 0 ? 'text-success' : 'text-destructive'" class="text-xs font-medium">
                              {{ formatPercent(holding.gainPercent) }}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <!-- Transactions Page -->
          <div v-if="activePage === 'transactions'" class="flex flex-1 flex-col gap-6 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Transaction History</h2>
                <p class="text-muted-foreground">
                  {{ transactionData.meta.total }} transactions • Filter, sort, and export your investment activities
                </p>
              </div>
            </div>

            <DataTable
              ref="transactionTableRef"
              :columns="transactionColumns"
              :data="transactionData.data"
              :page-count="transactionPageCount"
              :on-server-side-change="handleTransactionChange"
              :filter-fields="transactionFilterFields"
              :enable-row-selection="true"
              :show-selected-count="true"
              :bulk-select-options="transactionBulkActions"
              :default-per-page="10"
              :page-size-options="[10, 20, 50, 100]"
              search-column="symbol"
              search-placeholder="Search by symbol or name..."
              max-height="600px"
            />
          </div>

          <!-- Accounts Page -->
          <div v-if="activePage === 'accounts'" class="flex flex-1 flex-col gap-6 p-6">
            <div>
              <h2 class="text-2xl font-bold">Accounts</h2>
              <p class="text-muted-foreground">Manage your investment accounts</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card v-for="account in accounts" :key="account.name">
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <CardTitle class="text-lg">{{ account.name }}</CardTitle>
                    <div class="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <IconBuildingBank :size="20" />
                    </div>
                  </div>
                  <CardDescription>{{ account.institution }} • {{ account.accountNumber }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-3">
                  <Badge variant="outline">{{ account.type }}</Badge>
                  <div class="text-2xl font-bold mt-4">{{ formatCurrency(account.balance) }}</div>
                  <Button variant="outline" class="w-full mt-4" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Cards Page -->
          <div v-if="activePage === 'cards'" class="flex flex-1 flex-col gap-6 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold">Credit & Debit Cards</h2>
                <p class="text-muted-foreground">Manage your payment cards</p>
              </div>
              <Button>
                <IconCreditCard :size="16" class="mr-2" />
                Add New Card
              </Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card v-for="card in cards" :key="card.id">
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <CardTitle class="text-lg">{{ card.name }}</CardTitle>
                    <IconBrandVisa v-if="card.brand === 'Visa'" :size="32" class="text-blue-600" />
                    <IconBrandMastercard v-else :size="32" class="text-orange-600" />
                  </div>
                  <CardDescription>{{ card.type }} Card</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Card Number</span>
                      <span class="font-mono">•••• {{ card.lastFour }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">Expires</span>
                      <span class="font-mono">{{ card.expiryDate }}</span>
                    </div>
                  </div>
                  <Separator />
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-muted-foreground">Balance</span>
                      <span class="text-lg font-bold">{{ formatCurrency(card.balance) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-muted-foreground">Credit Limit</span>
                      <span class="text-sm">{{ formatCurrency(card.limit) }}</span>
                    </div>
                    <Progress :model-value="(card.balance / card.limit) * 100" class="h-2" />
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{{ ((card.balance / card.limit) * 100).toFixed(1) }}% used</span>
                      <span>{{ formatCurrency(card.limit - card.balance) }} available</span>
                    </div>
                  </div>
                  <Separator />
                  <div class="flex gap-2">
                    <Button variant="outline" size="sm" class="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" class="flex-1">
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Profile Page -->
          <div v-if="activePage === 'profile'" class="flex flex-1 flex-col gap-6 p-6">
            <div class="max-w-5xl mx-auto w-full space-y-6">
              <div>
                <h2 class="text-2xl font-bold">Profile</h2>
                <p class="text-muted-foreground">Manage your personal information</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Profile Picture Card -->
              <Card class="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col items-center gap-4">
                  <Avatar class="h-32 w-32">
                    <AvatarFallback class="bg-primary text-primary-foreground text-4xl">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" class="w-full">
                    <IconCamera :size="16" class="mr-2" />
                    Change Photo
                  </Button>
                </CardContent>
              </Card>

              <!-- Personal Information -->
              <Card class="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label for="firstName">First Name</Label>
                      <Input id="firstName" value="John" />
                    </div>
                    <div class="space-y-2">
                      <Label for="lastName">Last Name</Label>
                      <Input id="lastName" value="Doe" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="email">Email Address</Label>
                    <div class="flex gap-2">
                      <IconMail :size="20" class="text-muted-foreground mt-2" />
                      <Input id="email" type="email" value="john.doe@example.com" class="flex-1" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="phone">Phone Number</Label>
                    <div class="flex gap-2">
                      <IconPhone :size="20" class="text-muted-foreground mt-2" />
                      <Input id="phone" type="tel" value="+1 (555) 123-4567" class="flex-1" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <Label for="dob">Date of Birth</Label>
                    <div class="flex gap-2">
                      <IconCalendar :size="20" class="text-muted-foreground mt-2" />
                      <Input id="dob" type="date" value="1985-06-15" class="flex-1" />
                    </div>
                  </div>
                  <Separator />
                  <div class="flex gap-2 justify-end">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Address Information -->
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your current residential address</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <Label for="street">Street Address</Label>
                  <Input id="street" value="123 Main Street" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-2">
                    <Label for="city">City</Label>
                    <Input id="city" value="San Francisco" />
                  </div>
                  <div class="space-y-2">
                    <Label for="state">State</Label>
                    <Input id="state" value="CA" />
                  </div>
                  <div class="space-y-2">
                    <Label for="zip">ZIP Code</Label>
                    <Input id="zip" value="94102" />
                  </div>
                </div>
                <Separator />
                <div class="flex gap-2 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Address</Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          <!-- Settings Page -->
          <div v-if="activePage === 'settings'" class="flex flex-1 flex-col gap-6 p-6">
            <div class="max-w-4xl mx-auto w-full space-y-6">
              <div>
                <h2 class="text-2xl font-bold">Settings</h2>
                <p class="text-muted-foreground">Manage your application preferences</p>
              </div>

              <div class="grid grid-cols-1 gap-6">
              <!-- Notifications Settings -->
              <Card>
                <CardHeader>
                  <div class="flex items-center gap-2">
                    <IconNotification :size="20" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="email-notif">Email Notifications</Label>
                      <p class="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notif" v-model:checked="emailNotifications" />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="push-notif">Push Notifications</Label>
                      <p class="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch id="push-notif" v-model:checked="pushNotifications" />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="sms-alerts">SMS Alerts</Label>
                      <p class="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                    </div>
                    <Switch id="sms-alerts" v-model:checked="smsAlerts" />
                  </div>
                </CardContent>
              </Card>

              <!-- Reports Settings -->
              <Card>
                <CardHeader>
                  <div class="flex items-center gap-2">
                    <IconReceipt :size="20" />
                    <CardTitle>Reports</CardTitle>
                  </div>
                  <CardDescription>Configure automated report delivery</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="weekly-reports">Weekly Reports</Label>
                      <p class="text-sm text-muted-foreground">Receive a summary every Monday</p>
                    </div>
                    <Switch id="weekly-reports" v-model:checked="weeklyReports" />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="monthly-reports">Monthly Reports</Label>
                      <p class="text-sm text-muted-foreground">Detailed monthly portfolio report</p>
                    </div>
                    <Switch id="monthly-reports" v-model:checked="monthlyReports" />
                  </div>
                </CardContent>
              </Card>

              <!-- Appearance Settings -->
              <Card>
                <CardHeader>
                  <div class="flex items-center gap-2">
                    <IconSun :size="20" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5 flex items-center gap-2">
                      <IconMoon v-if="darkMode" :size="20" class="text-muted-foreground" />
                      <IconSun v-else :size="20" class="text-muted-foreground" />
                      <div>
                        <Label for="dark-mode">Dark Mode</Label>
                        <p class="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                    </div>
                    <Switch id="dark-mode" v-model:checked="darkMode" />
                  </div>
                </CardContent>
              </Card>

              <!-- Security Settings -->
              <Card>
                <CardHeader>
                  <div class="flex items-center gap-2">
                    <IconShield :size="20" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="2fa">Two-Factor Authentication</Label>
                      <p class="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch id="2fa" v-model:checked="twoFactorAuth" />
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label for="biometric">Biometric Login</Label>
                      <p class="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                    </div>
                    <Switch id="biometric" v-model:checked="biometricLogin" />
                  </div>
                  <Separator />
                  <div class="space-y-2">
                    <Label>Change Password</Label>
                    <p class="text-sm text-muted-foreground mb-3">Update your password regularly to keep your account secure</p>
                    <Button variant="outline">
                      <IconLock :size="16" class="mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}
