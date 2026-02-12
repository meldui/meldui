import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      shape: {
        pill: "rounded-full",
        tag: "rounded-sm",
      },
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success:
          "border-transparent bg-success text-white [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "border-transparent bg-warning text-white [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info: "border-transparent bg-info text-white [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
        neutral:
          "border-transparent bg-neutral text-white [a&]:hover:bg-neutral/90 focus-visible:ring-neutral/20 dark:focus-visible:ring-neutral/40",
      },
      outline: {
        true: "border-[1.5px]",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        outline: true,
        class:
          "border-primary bg-primary/5 text-primary [a&]:hover:bg-primary/10 focus-visible:ring-primary/20",
      },
      {
        variant: "secondary",
        outline: true,
        class:
          "border-border bg-secondary/50 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground focus-visible:ring-ring/20",
      },
      {
        variant: "destructive",
        outline: true,
        class:
          "border-destructive bg-destructive/5 text-destructive [a&]:hover:bg-destructive/10 focus-visible:ring-destructive/20",
      },
      {
        variant: "success",
        outline: true,
        class:
          "border-success bg-success/5 text-success [a&]:hover:bg-success/10 focus-visible:ring-success/20",
      },
      {
        variant: "warning",
        outline: true,
        class:
          "border-warning bg-warning/5 text-warning [a&]:hover:bg-warning/10 focus-visible:ring-warning/20",
      },
      {
        variant: "info",
        outline: true,
        class:
          "border-info bg-info/5 text-info [a&]:hover:bg-info/10 focus-visible:ring-info/20",
      },
      {
        variant: "neutral",
        outline: true,
        class:
          "border-neutral bg-neutral/5 text-neutral [a&]:hover:bg-neutral/10 focus-visible:ring-neutral/20",
      },
    ],
    defaultVariants: {
      shape: "pill",
      variant: "default",
      outline: false,
    },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
