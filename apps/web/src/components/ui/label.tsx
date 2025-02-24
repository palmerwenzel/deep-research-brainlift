"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  [
    "text-sm font-medium leading-none",
    "text-foreground/90",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "transition-colors duration-200",
    "dark:text-foreground/80",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "hover:text-primary/90 dark:hover:text-primary/80",
        primary: "text-primary/80 dark:text-primary/70",
        accent: "text-accent-foreground/90 dark:text-accent-foreground/80",
        muted: "text-muted-foreground dark:text-muted-foreground/90",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, className }))}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
