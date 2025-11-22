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
} from '@meldui/tabler-vue'
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
import { ref } from 'vue'

const meta: Meta = {
  title: 'Examples/Personal Finance Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

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
        { name: 'Investment Account', type: 'Brokerage', balance: 365267.5, institution: 'Vanguard', accountNumber: '****3421' },
        { name: 'Retirement (401k)', type: 'Retirement', balance: 98000.0, institution: 'Fidelity', accountNumber: '****7890' },
        { name: 'Savings', type: 'Cash', balance: 24382.82, institution: 'Chase', accountNumber: '****1234' },
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

      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(value)
      }

      const formatPercent = (value: number) => {
        return (value > 0 ? '+' : '') + value.toFixed(2) + '%'
      }

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
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
        formatCurrency,
        formatPercent,
        formatDate,
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
                <p class="text-muted-foreground">All your investment activities</p>
              </div>
              <Button>
                <IconDownload :size="16" class="mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete transaction history</CardDescription>
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
                    <TableRow v-for="(transaction, index) in transactions" :key="index">
                      <TableCell class="text-muted-foreground">{{ formatDate(transaction.date) }}</TableCell>
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
