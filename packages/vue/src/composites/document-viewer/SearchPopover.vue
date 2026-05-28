<script setup lang="ts">
/**
 * SearchPopover — the search popover content slotted into ViewerToolbar.
 *
 * Layout mirrors doqo's find-bar:
 *   - Row 1: query input with the result counter inside it + a close button.
 *   - Row 2: prev/next navigation on the left; match-case (Aa) and whole-word
 *     toggles on the right, both as icon buttons.
 *
 * Buttons use the MeldUI Tooltip (bottom-aligned, since the popover sits below
 * the toolbar) rather than the native `title` attribute, matching the rest of
 * the toolbar.
 */
import { computed, onMounted, ref, watch } from "vue";
import {
    IconAbc,
    IconChevronDown,
    IconChevronUp,
    IconLetterCase,
    IconX,
} from "@meldui/tabler-vue";
import { Button } from "../../components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";

interface Props {
    total?: number;
    activeResultIndex?: number;
    matchCase?: boolean;
    wholeWord?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    total: 0,
    activeResultIndex: -1,
    matchCase: false,
    wholeWord: false,
});

const emit = defineEmits<{
    (e: "search", keyword: string): void;
    (e: "next-match"): void;
    (e: "previous-match"): void;
    (e: "set-match-case", enabled: boolean): void;
    (e: "set-whole-word", enabled: boolean): void;
    (e: "close"): void;
}>();

const inputEl = ref<HTMLInputElement | null>(null);
const query = ref("");

// Result counter shown inside the input — mirrors doqo's "N of M" / "No results".
const resultsText = computed(() => {
    if (!query.value) return "";
    if (props.total === 0) return "No results";
    return `${Math.max(0, props.activeResultIndex) + 1} of ${props.total}`;
});

onMounted(() => {
    inputEl.value?.focus();
});

watch(query, (q) => emit("search", q));

function handleEnter(e: KeyboardEvent) {
    if (e.shiftKey) emit("previous-match");
    else emit("next-match");
    e.preventDefault();
}

function handleEscape() {
    emit("close");
}
</script>

<template>
    <TooltipProvider :delay-duration="200">
        <div class="search-popover flex flex-col gap-2">
            <!-- Row 1: query input (with result counter inside) + close -->
            <div class="flex items-center gap-1">
                <div class="relative flex-1">
                    <input
                        ref="inputEl"
                        v-model="query"
                        type="text"
                        placeholder="Find in document"
                        aria-label="Find in document"
                        :class="
                            cn(
                                'h-8 w-full rounded-md border border-input bg-background pl-2 pr-16 text-sm',
                                'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            )
                        "
                        @keydown.enter="handleEnter"
                        @keydown.escape="handleEscape"
                    />
                    <span
                        v-if="resultsText"
                        class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs tabular-nums text-muted-foreground"
                    >
                        {{ resultsText }}
                    </span>
                </div>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Close search"
                            @click="emit('close')"
                        >
                            <IconX :size="16" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Close</TooltipContent>
                </Tooltip>
            </div>

            <!-- Row 2: prev/next navigation + match-case / whole-word options -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                :disabled="total === 0"
                                aria-label="Previous match"
                                @click="emit('previous-match')"
                            >
                                <IconChevronUp :size="16" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Previous match</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                :disabled="total === 0"
                                aria-label="Next match"
                                @click="emit('next-match')"
                            >
                                <IconChevronDown :size="16" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Next match</TooltipContent>
                    </Tooltip>
                </div>
                <div class="flex items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                :variant="matchCase ? 'secondary' : 'ghost'"
                                size="icon-sm"
                                :aria-pressed="matchCase"
                                aria-label="Match case"
                                @click="emit('set-match-case', !matchCase)"
                            >
                                <IconLetterCase :size="16" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Match case</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                :variant="wholeWord ? 'secondary' : 'ghost'"
                                size="icon-sm"
                                :aria-pressed="wholeWord"
                                aria-label="Whole word"
                                @click="emit('set-whole-word', !wholeWord)"
                            >
                                <IconAbc :size="16" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Whole word</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    </TooltipProvider>
</template>
