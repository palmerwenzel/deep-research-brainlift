"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md",
    "bg-background/80 text-muted-foreground backdrop-blur-[1px]",
    "p-1 transition-all shadow-sm",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border border-border/50",
          "hover:bg-accent/5 hover:border-accent/30",
          "dark:bg-background/30 dark:hover:bg-accent/10",
        ].join(" "),
        ghost: "bg-transparent",
        soft: [
          "bg-accent/10 border border-accent/20",
          "hover:bg-accent/15 hover:border-accent/30",
        ].join(" "),
        bordered: [
          "border border-border/50",
          "hover:border-accent/30",
        ].join(" "),
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5",
    "text-sm font-medium ring-offset-background transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
          "data-[state=active]:backdrop-blur-[1px]",
          "hover:bg-accent/5 hover:text-accent-foreground/90",
          "dark:data-[state=active]:bg-background/60",
        ].join(" "),
        ghost: [
          "data-[state=active]:bg-accent/10 data-[state=active]:text-accent",
          "hover:bg-accent/5 hover:text-accent/80",
        ].join(" "),
        soft: [
          "data-[state=active]:bg-accent/20 data-[state=active]:text-accent-foreground",
          "hover:bg-accent/10 hover:text-accent-foreground/90",
        ].join(" "),
        bordered: [
          "border border-transparent",
          "data-[state=active]:border-accent/30 data-[state=active]:bg-background data-[state=active]:text-foreground",
          "hover:bg-accent/5 hover:text-accent-foreground/90",
        ].join(" "),
        underline: [
          "rounded-none border-b-2 border-transparent px-4",
          "data-[state=active]:border-accent data-[state=active]:text-accent",
          "hover:text-accent/80",
        ].join(" "),
        pill: [
          "rounded-full",
          "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
          "hover:bg-accent/10 hover:text-accent",
        ].join(" "),
        gradient: [
          "data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground",
          "hover:bg-primary/10 hover:text-primary",
        ].join(" "),
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
