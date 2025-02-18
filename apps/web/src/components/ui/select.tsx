"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const selectTriggerVariants = cva(
  [
    "flex w-full items-center justify-between rounded-md border",
    "bg-background px-3 py-2 text-sm ring-offset-background",
    "placeholder:text-muted-foreground [&>span]:line-clamp-1",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50 bg-background/80 backdrop-blur-[1px]",
          "hover:border-accent/30 hover:bg-accent/5",
          "focus-visible:border-accent/50 focus-visible:bg-accent/5",
          "dark:bg-background/30 dark:hover:bg-accent/10",
          "[&>svg]:text-muted-foreground/50 hover:[&>svg]:text-accent/70",
          "shadow-sm",
        ].join(" "),
        primary: [
          "border-primary/20",
          "hover:border-primary/40",
          "focus-visible:border-primary",
        ].join(" "),
        accent: [
          "border-accent/20",
          "hover:border-accent/40",
          "focus-visible:border-accent",
        ].join(" "),
        ghost: [
          "border-transparent bg-transparent",
          "hover:bg-muted/5",
          "focus-visible:bg-muted/10",
        ].join(" "),
        soft: [
          "border-muted/30 bg-muted/10",
          "hover:bg-muted/15 hover:border-muted/40",
          "focus-visible:bg-muted/20",
        ].join(" "),
      },
      size: {
        default: "h-10",
        sm: "h-9 text-xs",
        lg: "h-11 text-base",
      },
      isError: {
        true: [
          "border-destructive/50 text-destructive",
          "placeholder:text-destructive/60",
          "focus-visible:ring-destructive/30",
        ].join(" "),
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isError: false,
    },
  }
)

const selectContentVariants = cva(
  [
    "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border",
    "bg-popover/95 text-popover-foreground shadow-md backdrop-blur-[2px]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50 bg-background/95",
          "dark:bg-background/80",
          "shadow-sm dark:shadow-accent/5",
        ].join(" "),
        primary: "border-primary/20",
        accent: "border-accent/20",
        ghost: "border-transparent",
        soft: "border-muted/30 bg-muted/10",
      },
      position: {
        popper: [
          "data-[side=bottom]:translate-y-1",
          "data-[side=left]:-translate-x-1",
          "data-[side=right]:translate-x-1",
          "data-[side=top]:-translate-y-1",
        ].join(" "),
        "item-aligned": "",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "popper",
    },
  }
)

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, size, isError, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, isError }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

export interface SelectContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, 'position'>,
    VariantProps<typeof selectContentVariants> {
  position?: 'popper' | 'item-aligned';
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, variant, position = "popper", children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(selectContentVariants({ variant, position }), className)}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      [
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "transition-colors",
        "focus:bg-accent/10 focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      ].join(" "),
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
