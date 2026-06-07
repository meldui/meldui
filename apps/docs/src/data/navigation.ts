export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
  label?: string
}

export const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/getting-started' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Theming', href: '/docs/getting-started/theming' },
      { title: 'Dark Mode', href: '/docs/getting-started/dark-mode' },
      { title: 'Icons', href: '/docs/getting-started/icons' },
    ],
  },
  {
    title: 'Components',
    label: '62',
    items: [
      {
        title: 'Interactive',
        items: [
          { title: 'Button', href: '/docs/components/button' },
          { title: 'Button Group', href: '/docs/components/button-group' },
          { title: 'Toggle', href: '/docs/components/toggle' },
          { title: 'Toggle Group', href: '/docs/components/toggle-group' },
          { title: 'Command', href: '/docs/components/command' },
          { title: 'Carousel', href: '/docs/components/carousel' },
          { title: 'Combobox', href: '/docs/components/combobox' },
        ],
      },
      {
        title: 'Form & Input',
        items: [
          { title: 'Input', href: '/docs/components/input' },
          { title: 'Textarea', href: '/docs/components/textarea' },
          { title: 'Select', href: '/docs/components/select' },
          { title: 'Checkbox', href: '/docs/components/checkbox' },
          { title: 'Radio Group', href: '/docs/components/radio-group' },
          { title: 'Switch', href: '/docs/components/switch' },
          { title: 'Slider', href: '/docs/components/slider' },
          { title: 'Number Field', href: '/docs/components/number-field' },
          { title: 'Label', href: '/docs/components/label' },
          { title: 'Field', href: '/docs/components/field' },
          { title: 'Form', href: '/docs/components/form' },
          { title: 'Native Select', href: '/docs/components/native-select' },
          { title: 'Input Group', href: '/docs/components/input-group' },
          { title: 'Input OTP', href: '/docs/components/input-otp' },
          { title: 'Pin Input', href: '/docs/components/pin-input' },
          { title: 'Tags Input', href: '/docs/components/tags-input' },
          { title: 'File Upload', href: '/docs/components/file-upload' },
        ],
      },
      {
        title: 'Layout',
        items: [
          { title: 'Accordion', href: '/docs/components/accordion' },
          { title: 'Table', href: '/docs/components/table' },
          { title: 'Tabs', href: '/docs/components/tabs' },
          { title: 'Separator', href: '/docs/components/separator' },
          { title: 'Scroll Area', href: '/docs/components/scroll-area' },
          { title: 'Resizable', href: '/docs/components/resizable' },
          { title: 'Aspect Ratio', href: '/docs/components/aspect-ratio' },
          { title: 'Collapsible', href: '/docs/components/collapsible' },
          { title: 'Sidebar', href: '/docs/components/sidebar' },
        ],
      },
      {
        title: 'Navigation',
        items: [
          { title: 'Breadcrumb', href: '/docs/components/breadcrumb' },
          { title: 'Dropdown Menu', href: '/docs/components/dropdown-menu' },
          { title: 'Context Menu', href: '/docs/components/context-menu' },
          { title: 'Menubar', href: '/docs/components/menubar' },
          { title: 'Navigation Menu', href: '/docs/components/navigation-menu' },
          { title: 'Pagination', href: '/docs/components/pagination' },
          { title: 'Data Pagination', href: '/docs/components/data-pagination' },
        ],
      },
      {
        title: 'Overlay',
        items: [
          { title: 'Dialog', href: '/docs/components/dialog' },
          { title: 'Alert Dialog', href: '/docs/components/alert-dialog' },
          { title: 'Sheet', href: '/docs/components/sheet' },
          { title: 'Drawer', href: '/docs/components/drawer' },
          { title: 'Popover', href: '/docs/components/popover' },
          { title: 'Tooltip', href: '/docs/components/tooltip' },
          { title: 'Hover Card', href: '/docs/components/hover-card' },
        ],
      },
      {
        title: 'Data Display',
        items: [
          { title: 'Card', href: '/docs/components/card' },
          { title: 'Avatar', href: '/docs/components/avatar' },
          { title: 'Badge', href: '/docs/components/badge' },
          { title: 'Calendar', href: '/docs/components/calendar' },
          { title: 'Range Calendar', href: '/docs/components/range-calendar' },
          { title: 'Kbd', href: '/docs/components/kbd' },
        ],
      },
      {
        title: 'Feedback',
        items: [
          { title: 'Alert', href: '/docs/components/alert' },
          { title: 'Progress', href: '/docs/components/progress' },
          { title: 'Circular Progress', href: '/docs/components/circular-progress' },
          { title: 'Skeleton', href: '/docs/components/skeleton' },
          { title: 'Spinner', href: '/docs/components/spinner' },
          { title: 'Dot', href: '/docs/components/dot' },
          { title: 'Empty', href: '/docs/components/empty' },
          { title: 'Stepper', href: '/docs/components/stepper' },
          { title: 'Sonner', href: '/docs/components/sonner' },
        ],
      },
    ],
  },
  {
    title: 'Data Table',
    items: [
      { title: 'Overview', href: '/docs/data-table' },
      { title: 'Basic Usage', href: '/docs/data-table/basic' },
      { title: 'Columns & Cells', href: '/docs/data-table/columns' },
      { title: 'Filtering', href: '/docs/data-table/filtering' },
      { title: 'Selection & Actions', href: '/docs/data-table/selection' },
      { title: 'Column Pinning', href: '/docs/data-table/pinning' },
      { title: 'Row Expansion', href: '/docs/data-table/expansion' },
      { title: 'Server-Side', href: '/docs/data-table/server-side' },
      { title: 'useDataTableController', href: '/docs/data-table/use-data-table-controller' },
      { title: 'Recipes', href: '/docs/data-table/recipes' },
    ],
  },
  {
    title: 'Document Viewer',
    items: [
      { title: 'Overview', href: '/docs/document-viewer' },
      { title: 'Getting Started', href: '/docs/document-viewer/getting-started' },
      { title: 'Features', href: '/docs/document-viewer/features' },
      { title: 'Programmatic API', href: '/docs/document-viewer/programmatic-api' },
      { title: 'Annotations', href: '/docs/document-viewer/annotations' },
      { title: 'Customization', href: '/docs/document-viewer/customization' },
      { title: 'Theming', href: '/docs/document-viewer/theming' },
      { title: 'Bundle & Perf', href: '/docs/document-viewer/bundle-and-perf' },
      { title: 'Troubleshooting', href: '/docs/document-viewer/troubleshooting' },
      { title: 'Migration', href: '/docs/document-viewer/migration' },
      { title: 'Use Cases', href: '/docs/document-viewer/use-cases' },
      { title: 'Plugin Reference', href: '/docs/document-viewer/plugins' },
    ],
  },
  {
    title: 'Composites',
    label: '8',
    items: [
      { title: 'Date Range Picker', href: '/docs/composites/date-range-picker' },
      { title: 'Filters', href: '/docs/composites/filters' },
      { title: 'Multi Select', href: '/docs/composites/multi-select' },
      { title: 'Mention', href: '/docs/composites/mention' },
      { title: 'Timeline', href: '/docs/composites/timeline' },
      { title: 'Avatar Group', href: '/docs/composites/avatar-group' },
      { title: 'Clipboard Copy', href: '/docs/composites/clipboard-copy' },
      { title: 'Relative Time', href: '/docs/composites/relative-time' },
    ],
  },
  {
    title: 'Charts',
    label: '9',
    items: [
      { title: 'Overview', href: '/docs/charts' },
      { title: 'Installation', href: '/docs/charts/installation' },
      { title: 'Line Chart', href: '/docs/charts/line-chart' },
      { title: 'Bar Chart', href: '/docs/charts/bar-chart' },
      { title: 'Area Chart', href: '/docs/charts/area-chart' },
      { title: 'Pie Chart', href: '/docs/charts/pie-chart' },
      { title: 'Donut Chart', href: '/docs/charts/donut-chart' },
      { title: 'Scatter Chart', href: '/docs/charts/scatter-chart' },
      { title: 'Radar Chart', href: '/docs/charts/radar-chart' },
      { title: 'Heatmap Chart', href: '/docs/charts/heatmap-chart' },
      { title: 'Mixed Chart', href: '/docs/charts/mixed-chart' },
      { title: 'Theme Customization', href: '/docs/charts/theme-customization' },
      { title: 'Events', href: '/docs/charts/events' },
    ],
  },
  {
    title: 'A2UI Catalog',
    items: [
      { title: 'Overview', href: '/docs/a2ui' },
      { title: 'Catalog Reference', href: '/docs/a2ui/reference' },
      { title: 'Theming', href: '/docs/a2ui/theming' },
      { title: 'Playground', href: '/docs/a2ui/playground' },
      { title: 'Gallery', href: '/docs/a2ui/gallery' },
      {
        title: 'Components',
        items: [
          { title: 'Text', href: '/docs/a2ui/components/text' },
          { title: 'Markdown', href: '/docs/a2ui/components/markdown' },
          { title: 'Column', href: '/docs/a2ui/components/column' },
          { title: 'Card', href: '/docs/a2ui/components/card' },
          { title: 'Button', href: '/docs/a2ui/components/button' },
          { title: 'TextField', href: '/docs/a2ui/components/text-field' },
          { title: 'Alert', href: '/docs/a2ui/components/alert' },
          { title: 'Avatar', href: '/docs/a2ui/components/avatar' },
          { title: 'Avatar Group', href: '/docs/a2ui/components/avatar-group' },
          { title: 'Badge', href: '/docs/a2ui/components/badge' },
          { title: 'Button Group', href: '/docs/a2ui/components/button-group' },
          { title: 'Accordion', href: '/docs/a2ui/components/accordion' },
          { title: 'Carousel', href: '/docs/a2ui/components/carousel' },
          { title: 'Chart', href: '/docs/a2ui/components/chart' },
          { title: 'CheckBox', href: '/docs/a2ui/components/check-box' },
          { title: 'Choice Picker', href: '/docs/a2ui/components/choice-picker' },
          { title: 'Combobox', href: '/docs/a2ui/components/combobox' },
          { title: 'Date Time Input', href: '/docs/a2ui/components/date-time-input' },
          { title: 'Divider', href: '/docs/a2ui/components/divider' },
          { title: 'Icon', href: '/docs/a2ui/components/icon' },
          { title: 'Image', href: '/docs/a2ui/components/image' },
          { title: 'Kbd', href: '/docs/a2ui/components/kbd' },
          { title: 'List', href: '/docs/a2ui/components/list' },
          { title: 'Modal', href: '/docs/a2ui/components/modal' },
          { title: 'Multi Select', href: '/docs/a2ui/components/multi-select' },
          { title: 'Row', href: '/docs/a2ui/components/row' },
          { title: 'Scroll Area', href: '/docs/a2ui/components/scroll-area' },
          { title: 'Separator', href: '/docs/a2ui/components/separator' },
          { title: 'Sidebar', href: '/docs/a2ui/components/sidebar' },
          { title: 'Slider', href: '/docs/a2ui/components/slider' },
          { title: 'Stepper', href: '/docs/a2ui/components/stepper' },
          { title: 'Table', href: '/docs/a2ui/components/table' },
          { title: 'Tabs', href: '/docs/a2ui/components/tabs' },
          { title: 'Timeline', href: '/docs/a2ui/components/timeline' },
          { title: 'Toggle Group', href: '/docs/a2ui/components/toggle-group' },
        ],
      },
    ],
  },
  {
    title: 'Examples',
    items: [{ title: 'Common Patterns', href: '/docs/examples' }],
  },
]

/**
 * Flatten navigation into a list of page items for prev/next navigation
 */
export function flattenNav(items: NavItem[]): { title: string; href: string }[] {
  const result: { title: string; href: string }[] = []
  for (const item of items) {
    if (item.href) {
      result.push({ title: item.title, href: item.href })
    }
    if (item.items) {
      result.push(...flattenNav(item.items))
    }
  }
  return result
}
