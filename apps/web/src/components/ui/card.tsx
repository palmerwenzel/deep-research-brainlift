import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  [
    "rounded-lg border transition-all relative",
    "bg-card text-card-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50 shadow-sm bg-card/40 backdrop-blur-[4px]",
          "hover:border-border/80 hover:bg-card/60",
          "hover:shadow-md hover:shadow-primary/5",
          "dark:bg-card/20 dark:hover:bg-card/30",
          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-[0.02] after:transition-opacity",
          "hover:after:opacity-[0.04] dark:after:opacity-[0.01] dark:hover:after:opacity-[0.02]",
          "isolate after:-z-10",
        ].join(" "),
        primary: [
          "border-primary/20 shadow-sm bg-card/40 backdrop-blur-[4px]",
          "hover:border-primary/40 hover:shadow-md hover:bg-card/60",
          "hover:shadow-primary/5",
          "dark:bg-card/20 dark:hover:bg-card/30",
          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-[0.03] after:transition-opacity",
          "hover:after:opacity-[0.06] dark:after:opacity-[0.02] dark:hover:after:opacity-[0.04]",
          "isolate after:-z-10",
        ].join(" "),
        destructive: [
          "border-destructive/20 shadow-sm bg-card/40 backdrop-blur-[4px]",
          "hover:border-destructive/40 hover:bg-card/60",
          "dark:bg-card/20 dark:hover:bg-card/30",
        ].join(" "),
        soft: [
          "border-accent/20 bg-accent/5 backdrop-blur-[4px]",
          "hover:bg-accent/10 hover:border-accent/30",
          "dark:bg-accent/[0.03] dark:hover:bg-accent/[0.06]",
        ].join(" "),
        ghost: [
          "border-transparent bg-transparent shadow-none",
          "hover:bg-muted/5",
        ].join(" "),
        gradient: [
          "border-primary/20 backdrop-blur-[4px]",
          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-5 after:transition-opacity",
          "hover:after:opacity-10 hover:border-primary/30",
          "isolate after:-z-10",
        ].join(" "),
      },
      isHoverable: {
        true: "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300",
        false: "",
      },
      isClickable: {
        true: [
          "cursor-pointer active:scale-[0.98]",
          "active:translate-y-0 active:shadow-sm",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isHoverable: false,
      isClickable: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, isHoverable, isClickable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, isHoverable, isClickable }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold tracking-tight",
      "[&.bg-gradient-primary]:leading-[1.4] [&.text-transparent]:leading-[1.4]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
