import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays page numbers and navigation controls for paginated content. Helps users navigate through large sets of data or content split across multiple pages.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(1)
      const totalPages = 10

      return { currentPage, totalPages }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="100" :items-per-page="10">
        <PaginationContent>
          <PaginationPrevious />
          <PaginationItem value="1" :is-active="currentPage === 1">1</PaginationItem>
          <PaginationItem value="2" :is-active="currentPage === 2">2</PaginationItem>
          <PaginationItem value="3" :is-active="currentPage === 3">3</PaginationItem>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const WithEllipsis: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(5)

      return { currentPage }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="100" :items-per-page="10">
        <PaginationContent>
          <PaginationPrevious />
          <PaginationItem value="1" :is-active="currentPage === 1">1</PaginationItem>
          <PaginationEllipsis />
          <PaginationItem value="4" :is-active="currentPage === 4">4</PaginationItem>
          <PaginationItem value="5" :is-active="currentPage === 5">5</PaginationItem>
          <PaginationItem value="6" :is-active="currentPage === 6">6</PaginationItem>
          <PaginationEllipsis />
          <PaginationItem value="10" :is-active="currentPage === 10">10</PaginationItem>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const WithFirstAndLast: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationFirst,
      PaginationItem,
      PaginationLast,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(5)

      return { currentPage }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="100" :items-per-page="10">
        <PaginationContent>
          <PaginationFirst />
          <PaginationPrevious />
          <PaginationItem value="4" :is-active="currentPage === 4">4</PaginationItem>
          <PaginationItem value="5" :is-active="currentPage === 5">5</PaginationItem>
          <PaginationItem value="6" :is-active="currentPage === 6">6</PaginationItem>
          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const SimplePagination: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(1)

      return { currentPage }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="50" :items-per-page="10">
        <PaginationContent>
          <PaginationPrevious />
          <PaginationItem value="1" :is-active="currentPage === 1">1</PaginationItem>
          <PaginationItem value="2" :is-active="currentPage === 2">2</PaginationItem>
          <PaginationItem value="3" :is-active="currentPage === 3">3</PaginationItem>
          <PaginationItem value="4" :is-active="currentPage === 4">4</PaginationItem>
          <PaginationItem value="5" :is-active="currentPage === 5">5</PaginationItem>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const LargePagination: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationFirst,
      PaginationItem,
      PaginationLast,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(15)

      return { currentPage }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="500" :items-per-page="10">
        <PaginationContent>
          <PaginationFirst />
          <PaginationPrevious />
          <PaginationItem value="1" :is-active="currentPage === 1">1</PaginationItem>
          <PaginationEllipsis />
          <PaginationItem value="14" :is-active="currentPage === 14">14</PaginationItem>
          <PaginationItem value="15" :is-active="currentPage === 15">15</PaginationItem>
          <PaginationItem value="16" :is-active="currentPage === 16">16</PaginationItem>
          <PaginationEllipsis />
          <PaginationItem value="50" :is-active="currentPage === 50">50</PaginationItem>
          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const CompactPagination: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(1)

      return { currentPage }
    },
    template: `
      <Pagination v-model:page="currentPage" :total="100" :items-per-page="10">
        <PaginationContent>
          <PaginationPrevious />
          <div class="flex items-center gap-2 text-sm">
            Page {{ currentPage }} of 10
          </div>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    `,
  }),
}

export const WithPageInfo: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(3)
      const itemsPerPage = 10
      const totalItems = 100

      return { currentPage, itemsPerPage, totalItems }
    },
    template: `
      <div class="flex flex-col gap-4">
        <Pagination v-model:page="currentPage" :total="totalItems" :items-per-page="itemsPerPage">
          <PaginationContent>
            <PaginationPrevious />
            <PaginationItem value="1" :is-active="currentPage === 1">1</PaginationItem>
            <PaginationItem value="2" :is-active="currentPage === 2">2</PaginationItem>
            <PaginationItem value="3" :is-active="currentPage === 3">3</PaginationItem>
            <PaginationEllipsis />
            <PaginationItem value="10" :is-active="currentPage === 10">10</PaginationItem>
            <PaginationNext />
          </PaginationContent>
        </Pagination>
        <div class="text-center text-sm text-muted-foreground">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} results
        </div>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationItem,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const currentPage = ref(1)
      const totalPages = 10
      const itemsPerPage = 10
      const totalItems = 100

      const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
          currentPage.value = page
        }
      }

      return { currentPage, totalPages, itemsPerPage, totalItems, goToPage }
    },
    template: `
      <div class="flex flex-col gap-6">
        <div class="rounded-lg border p-6">
          <h3 class="mb-4 text-lg font-semibold">Sample Data Table</h3>
          <div class="space-y-2">
            <div v-for="i in itemsPerPage" :key="i" class="rounded border p-3 text-sm">
              Item {{ (currentPage - 1) * itemsPerPage + i }}
            </div>
          </div>
        </div>

        <Pagination v-model:page="currentPage" :total="totalItems" :items-per-page="itemsPerPage">
          <PaginationContent>
            <PaginationPrevious @click="goToPage(currentPage - 1)" />

            <PaginationItem
              v-if="currentPage > 2"
              value="1"
              :is-active="currentPage === 1"
              @click="goToPage(1)"
            >
              1
            </PaginationItem>

            <PaginationEllipsis v-if="currentPage > 3" />

            <PaginationItem
              v-if="currentPage > 1"
              :value="currentPage - 1"
              :is-active="false"
              @click="goToPage(currentPage - 1)"
            >
              {{ currentPage - 1 }}
            </PaginationItem>

            <PaginationItem
              :value="currentPage"
              :is-active="true"
            >
              {{ currentPage }}
            </PaginationItem>

            <PaginationItem
              v-if="currentPage < totalPages"
              :value="currentPage + 1"
              :is-active="false"
              @click="goToPage(currentPage + 1)"
            >
              {{ currentPage + 1 }}
            </PaginationItem>

            <PaginationEllipsis v-if="currentPage < totalPages - 2" />

            <PaginationItem
              v-if="currentPage < totalPages - 1"
              :value="totalPages"
              :is-active="currentPage === totalPages"
              @click="goToPage(totalPages)"
            >
              {{ totalPages }}
            </PaginationItem>

            <PaginationNext @click="goToPage(currentPage + 1)" />
          </PaginationContent>
        </Pagination>

        <div class="text-center text-sm text-muted-foreground">
          Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} total items)
        </div>
      </div>
    `,
  }),
}
