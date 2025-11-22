<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import { IconChecks, IconCopy } from "@meldui/tabler-vue";
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import type { ButtonVariants } from "@/components/ui/button";
import ClipboardCopy from "./ClipboardCopy.vue";
import type { ClipboardCopyProps } from "./ClipboardCopy.vue";
import CopyIdle from "./CopyIdle.vue";
import CopySuccess from "./CopySuccess.vue";

interface ButtonProps extends PrimitiveProps {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
}

export interface ClipboardCopyButtonProps
    extends Omit<ClipboardCopyProps, "asChild" | "as">,
        Pick<ButtonProps, "variant" | "size"> {
    /**
     * Custom label for idle state
     * @default 'Copy'
     */
    label?: string;
    /**
     * Custom label for success state
     * @default 'Copied!'
     */
    copiedLabel?: string;
    /**
     * Show icons
     * @default true
     */
    showIcon?: boolean;
}

const props = withDefaults(defineProps<ClipboardCopyButtonProps>(), {
    variant: "outline",
    size: "default",
    copiedDuration: 2000,
    label: "Copy",
    copiedLabel: "Copied!",
    showIcon: true,
});

const emit = defineEmits<{
    success: [];
    error: [error: Error];
}>();
</script>

<template>
    <ClipboardCopy
        as-child
        :text="props.text"
        :copied-duration="props.copiedDuration"
        @success="emit('success')"
        @error="emit('error', $event)"
    >
        <Button
            :variant="props.variant"
            :size="props.size"
            :class="props.class"
        >
            <CopyIdle>
                <IconCopy
                    v-if="props.showIcon"
                    :size="16"
                    :class="{ 'mr-2': props.label }"
                />
                {{ props.label }}
            </CopyIdle>
            <CopySuccess>
                <IconChecks
                    v-if="props.showIcon"
                    :size="16"
                    :class="{ 'mr-2': props.copiedLabel }"
                />
                {{ props.copiedLabel }}
            </CopySuccess>
        </Button>
    </ClipboardCopy>
</template>
