import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  [
    "rounded-lg border transition-all relative",
    "bg-transparent text-card-foreground backdrop-blur-[2px]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-accent/25",
          "hover:border-accent/50",
          "hover:backdrop-blur-[3px]",
        ].join(" "),
        primary: [
          "border-primary/20",
          "hover:border-primary/30",
          "hover:backdrop-blur-[3px]",
        ].join(" "),
        destructive: [
          "border-destructive/20",
          "hover:border-destructive/30",
          "hover:backdrop-blur-[3px]",
        ].join(" "),
        soft: [
          "border-accent/10",
          "hover:border-accent/20",
          "hover:backdrop-blur-[3px]",
        ].join(" "),
        ghost: [
          "border-transparent",
          "hover:border-accent/10",
          "hover:backdrop-blur-[1px]",
        ].join(" "),
        gradient: [
          "border-accent/20",
          "hover:border-accent/30",
          "hover:backdrop-blur-[3px]",
          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-[0.02] after:transition-opacity",
          "hover:after:opacity-[0.04]",
          "isolate after:-z-10",
        ].join(" "),
      },
      isHoverable: {
        true: "hover:-translate-y-0.5 transition-transform duration-300",
        false: "",
      },
      isClickable: {
        true: [
          "cursor-pointer active:scale-[0.98]",
          "active:translate-y-0",
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
