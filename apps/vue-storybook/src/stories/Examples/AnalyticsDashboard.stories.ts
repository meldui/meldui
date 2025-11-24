import type { MeldChartConfig } from '@meldui/charts-vue'
import {
  MeldAreaChart,
  MeldBarChart,
  MeldDonutChart,
  MeldLineChart,
  MeldMixedChart,
  MeldPieChart,
  MeldRadarChart,
} from '@meldui/charts-vue'
import {
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconBrandGoogle,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconClick,
  IconClock,
  IconDashboard,
  IconDownload,
  IconEye,
  IconFile,
  IconFilter,
  IconLogout,
  IconRefresh,
  IconSettings,
  IconTarget,
  IconTrendingDown,
  IconTrendingUp,
  IconUser,
  IconUsers,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Examples/Analytics Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

export const FullDashboard: Story = {
  render: () => ({
    components: {
      MeldAreaChart,
      MeldBarChart,
      MeldDonutChart,
      MeldLineChart,
      MeldMixedChart,
      MeldPieChart,
      MeldRadarChart,
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
      IconBrandGoogle,
      IconChartBar,
      IconChartLine,
      IconChartPie,
      IconClick,
      IconClock,
      IconDashboard,
      IconDownload,
      IconEye,
      IconFile,
      IconFilter,
      IconLogout,
      IconRefresh,
      IconSettings,
      IconTarget,
      IconTrendingDown,
      IconTrendingUp,
      IconUser,
      IconUsers,
      Input,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
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
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
    },
    setup() {
      const activePage = ref('overview')
      const selectedPeriod = ref('7d')
      const isRefreshing = ref(false)

      // Settings state
      const emailNotifications = ref(true)
      const weeklyReports = ref(true)
      const dataRetention = ref('90d')

      // KPI Metrics
      const metrics = {
        totalUsers: 45231,
        totalUsersChange: 12.5,
        pageViews: 892340,
        pageViewsChange: 8.3,
        avgSessionDuration: '4m 32s',
        avgSessionDurationChange: -3.2,
        bounceRate: 42.3,
        bounceRateChange: -5.1,
      }

      // Traffic Overview - Line Chart
      const trafficOverviewConfig: MeldChartConfig = {
        series: [
          {
            name: 'Page Views',
            data: [12400, 13200, 14100, 13800, 15200, 16800, 18200],
          },
          {
            name: 'Unique Visitors',
            data: [8200, 8900, 9400, 9100, 10200, 11300, 12100],
          },
          {
            name: 'New Users',
            data: [3200, 3500, 3800, 3600, 4100, 4600, 5000],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'top',
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
      }

      // User Sessions - Area Chart
      const userSessionsConfig: MeldChartConfig = {
        series: [
          {
            name: 'Active Sessions',
            data: [2400, 2800, 3200, 3100, 3500, 4200, 4800],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stroke: {
          curve: 'smooth',
        },
        colors: 'ocean',
        legend: {
          show: false,
        },
      }

      // Top Pages - Bar Chart
      const topPagesConfig: MeldChartConfig = {
        series: [
          {
            name: 'Page Views',
            data: [45230, 38420, 32100, 28950, 24680],
          },
        ],
        xAxis: {
          categories: ['/home', '/products', '/about', '/blog', '/contact'],
        },
        legend: {
          show: false,
        },
        horizontal: false,
      }

      // Traffic Sources - Donut Chart
      const trafficSourcesConfig: MeldChartConfig = {
        series: [
          { name: 'Organic Search', data: 42 },
          { name: 'Direct', data: 28 },
          { name: 'Social Media', data: 18 },
          { name: 'Referral', data: 12 },
        ],
        colors: 'default',
        legend: {
          position: 'bottom',
        },
      }

      // Device Distribution - Pie Chart
      const deviceDistributionConfig: MeldChartConfig = {
        series: [
          { name: 'Desktop', data: 52 },
          { name: 'Mobile', data: 38 },
          { name: 'Tablet', data: 10 },
        ],
        colors: 'ocean',
        legend: {
          position: 'bottom',
        },
      }

      // Conversion Funnel - Bar Chart (horizontal)
      const conversionFunnelConfig: MeldChartConfig = {
        series: [
          {
            name: 'Users',
            data: [100000, 85000, 62000, 45000, 28000],
          },
        ],
        xAxis: {
          categories: ['Landed', 'Viewed Product', 'Added to Cart', 'Checkout', 'Completed'],
        },
        horizontal: true,
        colors: 'sunset',
        legend: {
          show: false,
        },
      }

      // Performance Metrics - Mixed Chart
      const performanceMetricsConfig: MeldChartConfig = {
        series: [
          {
            name: 'Page Load Time',
            data: [2.4, 2.2, 2.5, 2.3, 2.1, 1.9, 1.8],
            type: 'line',
          },
          {
            name: 'API Response Time',
            data: [450, 420, 480, 440, 410, 380, 360],
            type: 'bar',
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'top',
        },
      }

      // User Engagement - Radar Chart
      const userEngagementConfig: MeldChartConfig = {
        series: [
          {
            name: 'This Week',
            data: [85, 72, 68, 90, 78, 82],
          },
          {
            name: 'Last Week',
            data: [78, 68, 65, 85, 72, 75],
          },
        ],
        xAxis: {
          categories: [
            'Page Views',
            'Time on Site',
            'Pages/Session',
            'Engagement',
            'Conversions',
            'Retention',
          ],
        },
        legend: {
          position: 'bottom',
        },
      }

      // Hourly Activity - Area Chart
      const hourlyActivityConfig: MeldChartConfig = {
        series: [
          {
            name: 'Active Users',
            data: [
              450, 380, 320, 290, 310, 420, 680, 920, 1200, 1450, 1520, 1480, 1620, 1580, 1650,
              1720, 1890, 2100, 2250, 2180, 1920, 1650, 1280, 890,
            ],
          },
        ],
        xAxis: {
          categories: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
          ],
        },
        stroke: {
          curve: 'smooth',
        },
        colors: 'forest',
        legend: {
          show: false,
        },
      }

      // Top Content
      const topContent = [
        {
          page: '/blog/getting-started',
          views: 45230,
          avgTime: '4m 23s',
          bounceRate: 28.5,
          conversions: 892,
        },
        {
          page: '/products/premium-plan',
          views: 38420,
          avgTime: '6m 12s',
          bounceRate: 22.3,
          conversions: 1245,
        },
        {
          page: '/pricing',
          views: 32100,
          avgTime: '3m 45s',
          bounceRate: 35.8,
          conversions: 682,
        },
        {
          page: '/features/analytics',
          views: 28950,
          avgTime: '5m 18s',
          bounceRate: 31.2,
          conversions: 534,
        },
        {
          page: '/documentation',
          views: 24680,
          avgTime: '7m 32s',
          bounceRate: 18.9,
          conversions: 423,
        },
      ]

      // Top Referrers
      const topReferrers = [
        { source: 'google.com', visits: 125340, percentage: 42.5 },
        { source: 'facebook.com', visits: 45820, percentage: 15.6 },
        { source: 'twitter.com', visits: 32450, percentage: 11.0 },
        { source: 'linkedin.com', visits: 28920, percentage: 9.8 },
        { source: 'reddit.com', visits: 18650, percentage: 6.3 },
      ]

      const refreshData = () => {
        isRefreshing.value = true
        setTimeout(() => {
          isRefreshing.value = false
        }, 1500)
      }

      const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num)
      }

      const formatPercent = (value: number) => {
        const sign = value > 0 ? '+' : ''
        return `${sign}${value.toFixed(1)}%`
      }

      return {
        activePage,
        selectedPeriod,
        isRefreshing,
        emailNotifications,
        weeklyReports,
        dataRetention,
        metrics,
        trafficOverviewConfig,
        userSessionsConfig,
        topPagesConfig,
        trafficSourcesConfig,
        deviceDistributionConfig,
        conversionFunnelConfig,
        performanceMetricsConfig,
        userEngagementConfig,
        hourlyActivityConfig,
        topContent,
        topReferrers,
        refreshData,
        formatNumber,
        formatPercent,
      }
    },
    template: `
      <SidebarProvider default-open>
        <!-- Sidebar Navigation -->
        <Sidebar collapsible="icon">
          <SidebarHeader class="border-b px-4 py-3">
            <div class="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shrink-0">
                A
              </div>
              <div class="flex flex-col group-data-[collapsible=icon]:hidden">
                <span class="text-sm font-semibold">Analytics Pro</span>
                <span class="text-xs text-muted-foreground">Business Intelligence</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'overview'"
                      @click="activePage = 'overview'"
                      tooltip="Overview"
                    >
                      <IconDashboard :size="16" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'realtime'"
                      @click="activePage = 'realtime'"
                      tooltip="Real-time"
                    >
                      <IconChartLine :size="16" />
                      <span>Real-time</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'audience'"
                      @click="activePage = 'audience'"
                      tooltip="Audience"
                    >
                      <IconUsers :size="16" />
                      <span>Audience</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'acquisition'"
                      @click="activePage = 'acquisition'"
                      tooltip="Acquisition"
                    >
                      <IconTarget :size="16" />
                      <span>Acquisition</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'behavior'"
                      @click="activePage = 'behavior'"
                      tooltip="Behavior"
                    >
                      <IconClick :size="16" />
                      <span>Behavior</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Reports</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      :is-active="activePage === 'reports'"
                      @click="activePage = 'reports'"
                      tooltip="Reports"
                    >
                      <IconFile :size="16" />
                      <span>Reports</span>
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
                <AvatarFallback class="bg-primary text-primary-foreground text-xs">AM</AvatarFallback>
              </Avatar>
              <div class="flex flex-col flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <span class="text-sm font-medium truncate">Analytics Manager</span>
                <span class="text-xs text-muted-foreground truncate">admin@company.com</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <!-- Main Content Area -->
        <SidebarInset>
          <div class="min-h-screen bg-muted/30">
        <!-- Header -->
        <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="container flex h-16 items-center justify-between px-6">
            <div class="flex items-center gap-4">
              <SidebarTrigger />
              <Separator orientation="vertical" class="h-6" />
              <div>
                <h1 class="text-xl font-bold">
                  {{ activePage === 'overview' ? 'Overview' : '' }}
                  {{ activePage === 'realtime' ? 'Real-time Analytics' : '' }}
                  {{ activePage === 'audience' ? 'Audience' : '' }}
                  {{ activePage === 'acquisition' ? 'Acquisition' : '' }}
                  {{ activePage === 'behavior' ? 'Behavior' : '' }}
                  {{ activePage === 'reports' ? 'Reports' : '' }}
                  {{ activePage === 'settings' ? 'Settings' : '' }}
                </h1>
                <p class="text-xs text-muted-foreground">
                  {{ activePage === 'overview' ? 'Comprehensive analytics dashboard' : '' }}
                  {{ activePage === 'realtime' ? 'Monitor live user activity' : '' }}
                  {{ activePage === 'audience' ? 'Understand your visitors' : '' }}
                  {{ activePage === 'acquisition' ? 'Track traffic sources' : '' }}
                  {{ activePage === 'behavior' ? 'Analyze user behavior' : '' }}
                  {{ activePage === 'reports' ? 'Generate custom reports' : '' }}
                  {{ activePage === 'settings' ? 'Configure analytics settings' : '' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Select v-model="selectedPeriod">
                <SelectTrigger class="w-[140px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" @click="refreshData" :disabled="isRefreshing">
                <IconRefresh :size="16" :class="{ 'animate-spin': isRefreshing }" />
              </Button>

              <Button variant="outline" size="sm">
                <IconFilter :size="16" class="mr-2" />
                Filters
              </Button>

              <Button size="sm">
                <IconDownload :size="16" class="mr-2" />
                Export
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
                      <AvatarFallback class="bg-primary text-primary-foreground text-xs">AM</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="activePage = 'settings'">
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
          </div>
        </header>

        <!-- Main Content -->
        <main v-if="activePage === 'overview'" class="container px-6 py-6 space-y-6">
          <!-- KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Users -->
            <Card>
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardDescription class="text-sm font-medium">Total Users</CardDescription>
                  <div class="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <IconUsers :size="18" class="text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold">{{ formatNumber(metrics.totalUsers) }}</div>
                <div class="flex items-center gap-1 mt-2">
                  <IconTrendingUp v-if="metrics.totalUsersChange > 0" :size="16" class="text-success" />
                  <IconTrendingDown v-else :size="16" class="text-destructive" />
                  <span
                    :class="metrics.totalUsersChange > 0 ? 'text-success' : 'text-destructive'"
                    class="text-sm font-medium"
                  >
                    {{ formatPercent(metrics.totalUsersChange) }}
                  </span>
                  <span class="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <!-- Page Views -->
            <Card>
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardDescription class="text-sm font-medium">Page Views</CardDescription>
                  <div class="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <IconEye :size="18" class="text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold">{{ formatNumber(metrics.pageViews) }}</div>
                <div class="flex items-center gap-1 mt-2">
                  <IconTrendingUp v-if="metrics.pageViewsChange > 0" :size="16" class="text-success" />
                  <IconTrendingDown v-else :size="16" class="text-destructive" />
                  <span
                    :class="metrics.pageViewsChange > 0 ? 'text-success' : 'text-destructive'"
                    class="text-sm font-medium"
                  >
                    {{ formatPercent(metrics.pageViewsChange) }}
                  </span>
                  <span class="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <!-- Avg Session Duration -->
            <Card>
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardDescription class="text-sm font-medium">Avg Session</CardDescription>
                  <div class="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <IconClock :size="18" class="text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold">{{ metrics.avgSessionDuration }}</div>
                <div class="flex items-center gap-1 mt-2">
                  <IconTrendingUp v-if="metrics.avgSessionDurationChange > 0" :size="16" class="text-success" />
                  <IconTrendingDown v-else :size="16" class="text-destructive" />
                  <span
                    :class="metrics.avgSessionDurationChange > 0 ? 'text-success' : 'text-destructive'"
                    class="text-sm font-medium"
                  >
                    {{ formatPercent(metrics.avgSessionDurationChange) }}
                  </span>
                  <span class="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <!-- Bounce Rate -->
            <Card>
              <CardHeader class="pb-3">
                <div class="flex items-center justify-between">
                  <CardDescription class="text-sm font-medium">Bounce Rate</CardDescription>
                  <div class="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <IconClick :size="18" class="text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold">{{ metrics.bounceRate }}%</div>
                <div class="flex items-center gap-1 mt-2">
                  <IconTrendingUp v-if="metrics.bounceRateChange > 0" :size="16" class="text-destructive" />
                  <IconTrendingDown v-else :size="16" class="text-success" />
                  <span
                    :class="metrics.bounceRateChange < 0 ? 'text-success' : 'text-destructive'"
                    class="text-sm font-medium"
                  >
                    {{ formatPercent(metrics.bounceRateChange) }}
                  </span>
                  <span class="text-sm text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Traffic Overview Chart -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="flex items-center gap-2">
                    <IconChartLine :size="20" />
                    Traffic Overview
                  </CardTitle>
                  <CardDescription>Page views, visitors, and new users over time</CardDescription>
                </div>
                <Badge variant="outline">Last 7 days</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MeldLineChart :config="trafficOverviewConfig" :height="400" />
            </CardContent>
          </Card>

          <!-- Tabs Section -->
          <Tabs default-value="audience" class="space-y-4">
            <TabsList class="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <!-- Audience Tab -->
            <TabsContent value="audience" class="space-y-4">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <!-- User Sessions -->
                <Card class="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Real-time user sessions throughout the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeldAreaChart :config="userSessionsConfig" :height="300" />
                  </CardContent>
                </Card>

                <!-- Device Distribution -->
                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                      <IconChartPie :size="18" />
                      Device Types
                    </CardTitle>
                    <CardDescription>User distribution by device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeldPieChart :config="deviceDistributionConfig" :height="300" />
                  </CardContent>
                </Card>
              </div>

              <!-- Hourly Activity -->
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Activity Pattern</CardTitle>
                  <CardDescription>User activity distribution across 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <MeldAreaChart :config="hourlyActivityConfig" :height="300" />
                </CardContent>
              </Card>

              <!-- User Engagement Radar -->
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Metrics</CardTitle>
                  <CardDescription>Compare engagement across different dimensions</CardDescription>
                </CardHeader>
                <CardContent>
                  <MeldRadarChart :config="userEngagementConfig" :height="400" />
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Behavior Tab -->
            <TabsContent value="behavior" class="space-y-4">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Top Pages -->
                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                      <IconChartBar :size="18" />
                      Top Pages
                    </CardTitle>
                    <CardDescription>Most visited pages on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeldBarChart :config="topPagesConfig" :height="350" />
                  </CardContent>
                </Card>

                <!-- Conversion Funnel -->
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>User journey from landing to conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeldBarChart :config="conversionFunnelConfig" :height="350" />
                  </CardContent>
                </Card>
              </div>

              <!-- Top Content Table -->
              <Card>
                <CardHeader>
                  <CardTitle>Top Content Performance</CardTitle>
                  <CardDescription>Detailed metrics for your best-performing pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead class="text-right">Views</TableHead>
                        <TableHead class="text-right">Avg Time</TableHead>
                        <TableHead class="text-right">Bounce Rate</TableHead>
                        <TableHead class="text-right">Conversions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="item in topContent" :key="item.page">
                        <TableCell class="font-medium">{{ item.page }}</TableCell>
                        <TableCell class="text-right">{{ formatNumber(item.views) }}</TableCell>
                        <TableCell class="text-right">{{ item.avgTime }}</TableCell>
                        <TableCell class="text-right">
                          <Badge
                            :variant="item.bounceRate < 30 ? 'default' : item.bounceRate < 40 ? 'secondary' : 'destructive'"
                          >
                            {{ item.bounceRate }}%
                          </Badge>
                        </TableCell>
                        <TableCell class="text-right font-semibold">{{ formatNumber(item.conversions) }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Acquisition Tab -->
            <TabsContent value="acquisition" class="space-y-4">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Traffic Sources -->
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors are coming from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeldDonutChart :config="trafficSourcesConfig" :height="350" />
                  </CardContent>
                </Card>

                <!-- Top Referrers Table -->
                <Card>
                  <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                    <CardDescription>Websites driving traffic to you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="space-y-4">
                      <div v-for="referrer in topReferrers" :key="referrer.source" class="space-y-2">
                        <div class="flex items-center justify-between text-sm">
                          <span class="font-medium">{{ referrer.source }}</span>
                          <div class="flex items-center gap-2">
                            <span class="text-muted-foreground">{{ formatNumber(referrer.visits) }}</span>
                            <Badge variant="secondary">{{ referrer.percentage }}%</Badge>
                          </div>
                        </div>
                        <div class="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            class="h-full bg-primary transition-all"
                            :style="{ width: referrer.percentage + '%' }"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <!-- Performance Tab -->
            <TabsContent value="performance" class="space-y-4">
              <!-- Performance Metrics -->
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Page load time and API response time trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <MeldMixedChart :config="performanceMetricsConfig" :height="400" />
                </CardContent>
              </Card>

              <!-- Performance Summary Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader class="pb-3">
                    <CardDescription>Avg Load Time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="text-3xl font-bold">1.85s</div>
                    <div class="flex items-center gap-1 mt-2">
                      <IconArrowDown :size="16" class="text-success" />
                      <span class="text-sm text-success font-medium">12.3% faster</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader class="pb-3">
                    <CardDescription>Avg API Response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="text-3xl font-bold">360ms</div>
                    <div class="flex items-center gap-1 mt-2">
                      <IconArrowDown :size="16" class="text-success" />
                      <span class="text-sm text-success font-medium">18.2% faster</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader class="pb-3">
                    <CardDescription>Uptime</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="text-3xl font-bold">99.97%</div>
                    <div class="flex items-center gap-1 mt-2">
                      <IconArrowUp :size="16" class="text-success" />
                      <span class="text-sm text-success font-medium">Above target</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <!-- Real-time Page -->
        <main v-if="activePage === 'realtime'" class="container px-6 py-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader class="pb-3">
                <CardDescription>Active Users Now</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-4xl font-bold text-success">1,247</div>
                <p class="text-sm text-muted-foreground mt-2">Real-time visitors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="pb-3">
                <CardDescription>Pages/Sec</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-4xl font-bold">3.8</div>
                <p class="text-sm text-muted-foreground mt-2">Page views per second</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="pb-3">
                <CardDescription>Avg Load Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-4xl font-bold">1.2s</div>
                <p class="text-sm text-muted-foreground mt-2">Average response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="pb-3">
                <CardDescription>Active Sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-4xl font-bold">892</div>
                <p class="text-sm text-muted-foreground mt-2">Current active sessions</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live Activity</CardTitle>
              <CardDescription>User activity in the last 60 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <MeldAreaChart :config="hourlyActivityConfig" :height="400" />
            </CardContent>
          </Card>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Active Pages</CardTitle>
                <CardDescription>Most visited pages right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div v-for="(item, index) in topContent.slice(0, 5)" :key="item.page" class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <Badge variant="outline">{{ index + 1 }}</Badge>
                      <span class="text-sm font-medium">{{ item.page }}</span>
                    </div>
                    <Badge>{{ Math.floor(item.views / 100) }} active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Current visitors by device</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldPieChart :config="deviceDistributionConfig" :height="300" />
              </CardContent>
            </Card>
          </div>
        </main>

        <!-- Reports Page -->
        <main v-if="activePage === 'reports'" class="container px-6 py-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold">Scheduled Reports</h2>
              <p class="text-muted-foreground">Manage your automated analytics reports</p>
            </div>
            <Button>
              <IconFile :size="16" class="mr-2" />
              Create Report
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center justify-between">
                  <span>Weekly Summary</span>
                  <Badge variant="default">Active</Badge>
                </CardTitle>
                <CardDescription>Every Monday at 9:00 AM</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Recipients:</span>
                    <span class="font-medium">5 users</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Last Sent:</span>
                    <span class="font-medium">2 days ago</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Format:</span>
                    <span class="font-medium">PDF</span>
                  </div>
                </div>
                <Separator />
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" class="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" class="flex-1">Send Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center justify-between">
                  <span>Monthly Analytics</span>
                  <Badge variant="default">Active</Badge>
                </CardTitle>
                <CardDescription>First day of each month</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Recipients:</span>
                    <span class="font-medium">12 users</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Last Sent:</span>
                    <span class="font-medium">10 days ago</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Format:</span>
                    <span class="font-medium">Excel</span>
                  </div>
                </div>
                <Separator />
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" class="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" class="flex-1">Send Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle class="flex items-center justify-between">
                  <span>Traffic Report</span>
                  <Badge variant="secondary">Paused</Badge>
                </CardTitle>
                <CardDescription>Daily at 6:00 PM</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Recipients:</span>
                    <span class="font-medium">3 users</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Last Sent:</span>
                    <span class="font-medium">Never</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Format:</span>
                    <span class="font-medium">PDF</span>
                  </div>
                </div>
                <Separator />
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" class="flex-1">Edit</Button>
                  <Button variant="outline" size="sm" class="flex-1">Activate</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell class="font-medium">Weekly Summary</TableCell>
                    <TableCell>Nov 18, 2025</TableCell>
                    <TableCell>Nov 11-17, 2025</TableCell>
                    <TableCell><Badge variant="outline">PDF</Badge></TableCell>
                    <TableCell class="text-right">
                      <Button variant="ghost" size="sm">
                        <IconDownload :size="16" class="mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="font-medium">Monthly Analytics</TableCell>
                    <TableCell>Nov 1, 2025</TableCell>
                    <TableCell>October 2025</TableCell>
                    <TableCell><Badge variant="outline">Excel</Badge></TableCell>
                    <TableCell class="text-right">
                      <Button variant="ghost" size="sm">
                        <IconDownload :size="16" class="mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="font-medium">Q3 Performance</TableCell>
                    <TableCell>Oct 1, 2025</TableCell>
                    <TableCell>Jul-Sep 2025</TableCell>
                    <TableCell><Badge variant="outline">PDF</Badge></TableCell>
                    <TableCell class="text-right">
                      <Button variant="ghost" size="sm">
                        <IconDownload :size="16" class="mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>

        <!-- Settings Page -->
        <main v-if="activePage === 'settings'" class="container px-6 py-6">
          <div class="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 class="text-2xl font-bold">Settings</h2>
              <p class="text-muted-foreground">Configure your analytics preferences</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive analytics updates</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label for="email-notif">Email Notifications</Label>
                    <p class="text-sm text-muted-foreground">Receive analytics updates via email</p>
                  </div>
                  <Switch id="email-notif" v-model:checked="emailNotifications" />
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label for="weekly-reports">Weekly Reports</Label>
                    <p class="text-sm text-muted-foreground">Get a summary every Monday</p>
                  </div>
                  <Switch id="weekly-reports" v-model:checked="weeklyReports" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>Manage data collection and retention</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <Label for="retention">Data Retention Period</Label>
                  <Select v-model="dataRetention">
                    <SelectTrigger id="retention">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                      <SelectItem value="180d">180 days</SelectItem>
                      <SelectItem value="365d">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-sm text-muted-foreground">
                    Analytics data will be automatically deleted after this period
                  </p>
                </div>
                <Separator />
                <div class="space-y-2">
                  <Label>Cookie Consent</Label>
                  <p class="text-sm text-muted-foreground mb-3">
                    Manage cookie consent banner and tracking preferences
                  </p>
                  <Button variant="outline">
                    Configure Consent
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with third-party services</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <IconBrandGoogle :size="20" />
                    </div>
                    <div>
                      <p class="font-medium">Google Analytics</p>
                      <p class="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <IconChartBar :size="20" />
                    </div>
                    <div>
                      <p class="font-medium">Data Warehouse</p>
                      <p class="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <!-- Audience Page (simplified) -->
        <main v-if="activePage === 'audience'" class="container px-6 py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Comprehensive user behavior metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <MeldRadarChart :config="userEngagementConfig" :height="400" />
            </CardContent>
          </Card>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Daily active user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldAreaChart :config="userSessionsConfig" :height="300" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Users by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldPieChart :config="deviceDistributionConfig" :height="300" />
              </CardContent>
            </Card>
          </div>
        </main>

        <!-- Acquisition Page (simplified) -->
        <main v-if="activePage === 'acquisition'" class="container px-6 py-6 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldDonutChart :config="trafficSourcesConfig" :height="350" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Leading traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div v-for="referrer in topReferrers" :key="referrer.source" class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium">{{ referrer.source }}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">{{ formatNumber(referrer.visits) }}</span>
                        <Badge variant="secondary">{{ referrer.percentage }}%</Badge>
                      </div>
                    </div>
                    <div class="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        class="h-full bg-primary transition-all"
                        :style="{ width: referrer.percentage + '%' }"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <!-- Behavior Page (simplified) -->
        <main v-if="activePage === 'behavior'" class="container px-6 py-6 space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldBarChart :config="topPagesConfig" :height="350" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <MeldBarChart :config="conversionFunnelConfig" :height="350" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Detailed page metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead class="text-right">Views</TableHead>
                    <TableHead class="text-right">Avg Time</TableHead>
                    <TableHead class="text-right">Bounce Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in topContent" :key="item.page">
                    <TableCell class="font-medium">{{ item.page }}</TableCell>
                    <TableCell class="text-right">{{ formatNumber(item.views) }}</TableCell>
                    <TableCell class="text-right">{{ item.avgTime }}</TableCell>
                    <TableCell class="text-right">
                      <Badge
                        :variant="item.bounceRate < 30 ? 'default' : item.bounceRate < 40 ? 'secondary' : 'destructive'"
                      >
                        {{ item.bounceRate }}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}
