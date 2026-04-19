# MeldUI Documentation Site — TODO

## Phase 1: Foundation

- [x] Initialize `apps/docs/` with Astro (empty template)
- [x] Create `package.json` with all dependencies
- [x] Configure `astro.config.ts` (Vue, MDX, sitemap, Tailwind v4, Vue dedupe)
- [x] Create `tsconfig.json`
- [x] Set up `src/styles/global.css` (Tailwind v4 + MeldUI theme + `@source` directives)
- [x] Create `src/vue-app.ts` (Vue app entrypoint for `@astrojs/vue`)
- [x] Build `src/layouts/BaseLayout.astro` (HTML shell, `<head>`, dark mode inline script, fonts)
- [x] Build `src/layouts/DocsLayout.astro` (3-column responsive grid)
- [x] Build `src/components/Header.astro` (logo, search trigger, theme toggle, GitHub link)
- [x] Build `src/components/Sidebar.astro` (left navigation container)
- [x] Build `src/components/SidebarNav.astro` (recursive nav items with active state)
- [x] Build `src/components/Footer.astro`
- [x] Create `src/data/navigation.ts` (full sidebar navigation structure)
- [x] Set up content collection schema `src/content.config.ts`
- [x] Build dynamic route `src/pages/docs/[...slug].astro`
- [x] Build `src/components/ThemeToggle.vue` (dark/light toggle, localStorage, prefers-color-scheme)
- [x] Create landing page `src/pages/index.astro`
- [x] Add `"docs:dev"` and `"docs:build"` scripts to root `package.json`
- [x] Run `pnpm install` and verify dev server starts

## Phase 2: Content Infrastructure + Getting Started

- [x] Build `src/components/ComponentPreview.vue` (Preview/Code tabs, slot for demo, code prop)
- [x] Build `src/components/CopyButton.vue` (copy to clipboard with feedback)
- [x] Build `src/components/ApiTable.astro` (renders props/events/slots tables from frontmatter)
- [x] Build `src/components/Breadcrumbs.astro`
- [x] Build `src/components/PrevNext.astro` (done in Phase 1)
- [x] Build `src/components/TableOfContents.astro` (done in Phase 1)
- [x] Create `src/content/docs/getting-started/index.mdx` (Introduction)
- [x] Create `src/content/docs/getting-started/installation.mdx`
- [x] Create `src/content/docs/getting-started/theming.mdx`
- [x] Create `src/content/docs/getting-started/dark-mode.mdx`
- [x] Create `src/content/docs/getting-started/icons.mdx`
- [x] Verify all 5 pages render correctly with layout, nav, breadcrumbs, TOC

## Phase 3: Component Pages

### 3.1 Interactive (7 components)

- [x] Button — demo + MDX + API
- [x] ButtonGroup — MDX + API
- [x] Toggle — MDX + API
- [x] ToggleGroup — MDX + API
- [x] Command — MDX + API
- [x] Carousel — MDX + API
- [x] Combobox — MDX + API

### 3.2 Form & Input (17 components)

- [x] Input — MDX + API
- [x] Select — MDX + API
- [x] Checkbox — MDX + API
- [x] RadioGroup — MDX + API
- [x] Switch — MDX + API
- [x] Textarea — MDX + API
- [x] Slider — MDX + API
- [x] NumberField — MDX + API
- [x] Label — MDX + API
- [x] Field — MDX + API
- [x] Form — MDX + API
- [x] NativeSelect — MDX + API
- [x] InputGroup — MDX + API
- [x] InputOtp — MDX + API
- [x] PinInput — MDX + API
- [x] TagsInput — MDX + API
- [x] FileUpload — MDX + API

### 3.3 Layout (9 components)

- [x] Accordion — MDX + API
- [x] Table — MDX + API
- [x] Tabs — MDX + API
- [x] Separator — MDX + API
- [x] ScrollArea — MDX + API
- [x] Resizable — MDX + API
- [x] AspectRatio — MDX + API
- [x] Collapsible — MDX + API
- [x] Sidebar — MDX + API

### 3.4 Navigation (6 components)

- [x] Breadcrumb — MDX + API
- [x] DropdownMenu — MDX + API
- [x] ContextMenu — MDX + API
- [x] Menubar — MDX + API
- [x] NavigationMenu — MDX + API
- [x] Pagination — MDX + API

### 3.5 Overlay (7 components)

- [x] Dialog — MDX + API
- [x] AlertDialog — MDX + API
- [x] Sheet — MDX + API
- [x] Drawer — MDX + API
- [x] Popover — MDX + API
- [x] Tooltip — MDX + API
- [x] HoverCard — MDX + API

### 3.6 Data Display (6 components)

- [x] Card — MDX + API
- [x] Avatar — MDX + API
- [x] Badge — MDX + API
- [x] Calendar — MDX + API
- [x] RangeCalendar — MDX + API
- [x] Kbd — MDX + API

### 3.7 Feedback (10 components)

- [x] Alert — MDX + API
- [x] Progress — MDX + API
- [x] CircularProgress — MDX + API
- [x] Skeleton — MDX + API
- [x] Spinner — MDX + API
- [x] Dot — MDX + API
- [x] Empty — MDX + API
- [x] Stepper — MDX + API
- [x] Sonner — MDX + API
- [x] Item — MDX + API

## Phase 4: Composites

- [x] DataTable — dedicated section with 8 pages (Overview, Basic, Columns, Filtering, Selection, Pinning, Expansion, Server-Side)
- [x] DataTable — basic usage demo
- [x] DataTable — columns & cell renderers demo (badge, currency, date)
- [x] DataTable — filtering demo (text, select, boolean)
- [x] DataTable — selection & bulk actions demo
- [x] DataTable — column pinning demo
- [x] DataTable — row expansion demo (master-detail)
- [x] DataTable — server-side docs (params, response format, slots, keyboard nav)
- [x] DateRangePicker — demos (range + single mode) + MDX + API
- [x] MultiSelect — demos (flat + grouped/creatable) + MDX + API
- [x] Mention — demo (styled input with suggestions) + MDX + API
- [x] Timeline — demo (vertical with activeIndex) + MDX + API
- [x] AvatarGroup — demo (max overflow) + MDX + API
- [x] ClipboardCopy — demo (button + custom scoped slot) + MDX + API
- [x] RelativeTime — demo (auto-updating) + MDX + API

## Phase 5: Charts

- [x] Charts overview page (chart type selection guide)
- [x] Charts installation page
- [x] MeldLineChart — 2 demos (smooth + stepline) + config table
- [x] MeldBarChart — 2 demos (grouped + stacked horizontal) + config table
- [x] MeldAreaChart — 1 demo (stacked smooth) + config table
- [x] MeldPieChart — 1 demo (browser market share) + config table
- [x] MeldDonutChart — 1 demo (revenue by region) + config table
- [x] MeldScatterChart — 1 demo (spend vs revenue) + config table
- [x] MeldRadarChart — 1 demo (skill comparison) + config table
- [x] MeldHeatmapChart — 1 demo (weekly activity) + config table
- [x] MeldMixedChart — 1 demo (bar + line) + config table
- [x] Charts theme customization page (palettes, dark mode, CSS variables)
- [x] Charts events & interactivity page (click, hover, legendSelect, dataZoom, brushSelect)

## Phase 6: Search & LLM Optimization

- [x] Add Pagefind to build pipeline (95 pages indexed, 2012 words)
- [x] Build `src/components/SearchDialog.vue` (Cmd+K, uses MeldUI Dialog)
- [x] Wire search trigger in Header + DocsLayout
- [x] Write `scripts/generate-llms.ts`
- [x] Generate `llms.txt` (summary index — 95 pages)
- [x] Generate `llms-full.txt` (full API docs — 130KB)
- [x] Add `generate-llms` to build pipeline (runs before astro build)
- [x] Verify `sitemap.xml` generation (done in Phase 1)
- [x] Add `public/robots.txt` (done in Phase 1)
- [x] Add Open Graph meta tags to BaseLayout (done in Phase 1)

## Phase 7: Polish

- [x] Create examples/common patterns page (form validation, dashboard layout, data table, chart dashboard)
- [x] Link to Task Manager example app
- [x] Search dialog on landing page
- [x] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility audit (keyboard navigation, screen reader)
- [ ] Performance check (Lighthouse score)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Final review of all pages for consistency

## Phase 8: Sub-component API Documentation

Enrich sub-component tables with full props, events, and slots data via frontmatter `subComponents[]`.

### 8.1 Overlay (7 components)

- [x] Dialog — DialogContent (showCloseButton), DialogScrollContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogOverlay, DialogTrigger
- [x] AlertDialog — AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger
- [x] Sheet — SheetContent (side), SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, SheetTrigger
- [x] Drawer — DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerOverlay, DrawerTrigger
- [x] Popover — PopoverContent (align, side, sideOffset), PopoverTrigger, PopoverAnchor
- [x] Tooltip — TooltipProvider (delayDuration, skipDelayDuration), TooltipContent (side, sideOffset), TooltipTrigger
- [x] HoverCard — HoverCardContent (side, sideOffset, align), HoverCardTrigger

### 8.2 Navigation (4 components)

- [ ] DropdownMenu — DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
- [ ] ContextMenu — same structure as DropdownMenu
- [ ] Menubar — MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent
- [ ] Breadcrumb — BreadcrumbList, BreadcrumbItem, BreadcrumbLink (href, asChild), BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis

### 8.3 Layout (4 components)

- [ ] Accordion — AccordionItem (value, disabled), AccordionTrigger (icon slot), AccordionContent
- [ ] Tabs — TabsList, TabsTrigger (value, disabled), TabsContent (value)
- [ ] Resizable — ResizablePanel (defaultSize, minSize, maxSize, collapsible), ResizableHandle (withHandle)
- [ ] Sidebar — full sub-component props (SidebarProvider, SidebarMenuButton variant/size/tooltip, etc.)

### 8.4 Form (4 components)

- [ ] Select — SelectTrigger (size), SelectContent (position), SelectItem (value, disabled), SelectValue (placeholder), SelectGroup, SelectLabel, SelectSeparator
- [ ] Field — FieldLabel, FieldContent, FieldDescription, FieldError (errors), FieldGroup, FieldSet, FieldLegend (variant), FieldTitle, FieldSeparator
- [ ] Form — FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
- [ ] FileUpload — FileUploadDropzone (slot props), FileUploadTrigger, FileUploadList, FileUploadItem (file, progress, status, error), FileUploadItemName, FileUploadItemSize (precision), FileUploadItemPreview, FileUploadItemProgress (variant), FileUploadItemDelete, FileUploadClear

### 8.5 Data Display (3 components)

- [ ] Card — CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction
- [ ] Calendar — CalendarHeader, CalendarHeading, CalendarGrid, CalendarCell, CalendarCellTrigger, CalendarPrevButton, CalendarNextButton
- [ ] Stepper — StepperItem (step), StepperTrigger, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator

### 8.6 Interactive (3 components)

- [ ] Command — CommandDialog (title, description), CommandInput, CommandList, CommandGroup (heading), CommandItem (value, disabled), CommandEmpty, CommandSeparator, CommandShortcut
- [ ] Carousel — CarouselContent, CarouselItem, CarouselPrevious (variant, size), CarouselNext (variant, size)
- [ ] Combobox — ComboboxAnchor, ComboboxInput (displayValue, placeholder), ComboboxTrigger, ComboboxList (position, align, sideOffset), ComboboxItem (value, disabled), ComboboxItemIndicator, ComboboxGroup (heading), ComboboxEmpty, ComboboxSeparator, ComboboxCancel
