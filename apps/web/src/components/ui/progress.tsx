"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  [
    "relative overflow-hidden rounded-full transition-all",
    "bg-secondary/50 backdrop-blur-[1px]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "[&>div]:bg-accent/80 [&>div]:backdrop-blur-[1px]",
          "hover:[&>div]:bg-accent/90",
          "bg-accent/10 dark:bg-accent/5",
          "shadow-sm",
        ].join(" "),
        success: [
          "[&>div]:bg-success",
          "hover:[&>div]:bg-success/90",
          "bg-success/10",
        ].join(" "),
        warning: [
          "[&>div]:bg-warning",
          "hover:[&>div]:bg-warning/90",
          "bg-warning/10",
        ].join(" "),
        destructive: [
          "[&>div]:bg-destructive",
          "hover:[&>div]:bg-destructive/90",
          "bg-destructive/10",
        ].join(" "),
        info: [
          "[&>div]:bg-info",
          "hover:[&>div]:bg-info/90",
          "bg-info/10",
        ].join(" "),
        gradient: [
          "[&>div]:bg-gradient-primary",
          "hover:[&>div]:opacity-90",
          "bg-primary/10",
        ].join(" "),
      },
      size: {
        default: "h-4",
        xs: "h-1",
        sm: "h-2",
        lg: "h-6",
      },
      isAnimated: {
        true: [
          "[&>div]:transition-transform duration-300",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isAnimated: true,
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, variant, size, isAnimated, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size, isAnimated }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressVariants }
