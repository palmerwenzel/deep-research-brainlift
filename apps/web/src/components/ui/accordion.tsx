"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: [
        "border-b border-border/50",
        "transition-all duration-200",
        "hover:bg-muted/5 dark:hover:bg-muted/10",
        "data-[state=open]:bg-muted/5 dark:data-[state=open]:bg-muted/10",
        "data-[state=open]:border-primary/20",
      ].join(" "),
      ghost: [
        "border-none",
        "transition-colors",
        "hover:bg-muted/5",
      ].join(" "),
      bordered: [
        "border border-border/50 rounded-md mb-2",
        "transition-colors",
        "hover:border-border",
        "data-[state=open]:border-primary/20",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between py-4 font-medium transition-all text-sm",
  {
    variants: {
      variant: {
        default: [
          "text-foreground/80",
          "hover:text-foreground",
          "data-[state=open]:text-primary data-[state=open]:font-semibold",
          "[&>svg]:text-muted-foreground/50 hover:[&>svg]:text-muted-foreground",
          "data-[state=open]:[&>svg]:text-primary",
        ].join(" "),
        ghost: [
          "text-foreground/70",
          "hover:text-foreground",
        ].join(" "),
        bordered: [
          "text-foreground/80 px-4",
          "hover:text-foreground",
          "data-[state=open]:text-primary data-[state=open]:bg-primary/5",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        accordionTriggerVariants({ variant }),
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-foreground/50 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const accordionContentVariants = cva(
  "overflow-hidden text-sm transition-all",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        ghost: "text-muted-foreground",
        bordered: "px-4 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      accordionContentVariants({ variant }),
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
}
