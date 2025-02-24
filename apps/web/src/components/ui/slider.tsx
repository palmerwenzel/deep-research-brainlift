"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn([
        "relative h-1.5 w-full grow overflow-hidden",
        "rounded-full",
        "bg-accent/10 dark:bg-accent/5",
        "transition-colors duration-200",
      ].join(" "))}
    >
      <SliderPrimitive.Range className={cn([
        "absolute h-full",
        "bg-gradient-primary",
        "animate-gradient-shift",
        "transition-all duration-200",
      ].join(" "))} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn([
        "block h-4 w-4",
        "rounded-full border border-accent/50",
        "bg-background shadow-sm",
        "ring-offset-background",
        "transition-colors duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:border-accent hover:bg-accent/5",
        "active:scale-95",
      ].join(" "))}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
