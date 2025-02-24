import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: [
          "bg-primary/20 text-foreground border border-border/80",
          "hover:bg-primary/30 hover:border-primary/30 hover:text-primary hover:shadow-sm",
          "active:bg-primary/40 active:border-primary/40",
          "dark:bg-background/80 dark:text-foreground dark:hover:bg-primary/10",
          "transition-all duration-200",
        ].join(" "),
        primary: [
          "bg-primary text-primary-foreground shadow-sm",
          "hover:bg-primary/90",
          "active:bg-primary/80",
        ].join(" "),
        soft: [
          "bg-accent/15 text-accent-foreground/90 border border-accent/30",
          "hover:bg-accent/25 hover:border-accent/40 hover:text-accent-foreground",
          "active:bg-accent/30",
        ].join(" "),
        gradient: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-sm",
        "gradient-animated": "bg-gradient-primary animate-gradient-shift text-primary-foreground hover:opacity-90 shadow-sm",
        "hover-gradient": [
          "text-foreground bg-background",
          "after:absolute after:inset-0 after:rounded-md after:bg-gradient-primary after:opacity-0 after:transition-opacity after:duration-300",
          "hover:text-primary-foreground hover:after:opacity-100",
          "isolate after:-z-10"
        ].join(" "),
        ghost: [
          "text-accent/80",
          "hover:bg-accent/10 hover:text-accent",
          "active:bg-accent/15",
        ].join(" "),
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        "outline-primary": [
          "bg-background text-primary border border-primary",
          "hover:bg-primary/5 hover:text-primary hover:border-primary",
          "active:bg-primary/10",
        ].join(" "),
        "outline-accent": [
          "bg-background text-accent border border-accent",
          "hover:bg-accent/5 hover:text-accent hover:border-accent",
          "active:bg-accent/10",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      isSelected: {
        true: "",
        false: "",
      }
    },
    compoundVariants: [
      // Default selected state
      {
        variant: "default",
        isSelected: true,
        className: [
          "bg-primary text-primary-foreground border-primary shadow-sm",
          "hover:bg-primary/90 hover:text-primary-foreground hover:border-primary",
        ].join(" "),
      },
      // Primary selected state
      {
        variant: "primary",
        isSelected: true,
        className: [
          "ring-2 ring-primary/20",
          "hover:bg-primary/90 hover:text-primary-foreground",
        ].join(" "),
      },
      // Soft selected state
      {
        variant: "soft",
        isSelected: true,
        className: [
          "bg-accent/20 border-accent text-accent-foreground",
          "hover:bg-accent/30 hover:text-accent-foreground hover:border-accent",
        ].join(" "),
      },
      // Gradient selected state
      {
        variant: "gradient",
        isSelected: true,
        className: "ring-2 ring-primary/20 hover:text-primary-foreground",
      },
      // Gradient animated selected state
      {
        variant: "gradient-animated",
        isSelected: true,
        className: "ring-2 ring-primary/20 hover:text-primary-foreground",
      },
      // Hover gradient selected state
      {
        variant: "hover-gradient",
        isSelected: true,
        className: [
          "after:opacity-100 text-primary-foreground ring-2 ring-primary/20",
          "hover:text-primary-foreground",
        ].join(" "),
      },
      // Ghost selected state
      {
        variant: "ghost",
        isSelected: true,
        className: [
          "bg-accent/10 text-accent-foreground",
          "hover:bg-accent/20 hover:text-accent-foreground",
        ].join(" "),
      },
      // Destructive selected state
      {
        variant: "destructive",
        isSelected: true,
        className: [
          "ring-2 ring-destructive/20",
          "hover:bg-destructive/90 hover:text-destructive-foreground",
        ].join(" "),
      },
      // Outline primary selected state
      {
        variant: "outline-primary",
        isSelected: true,
        className: [
          "bg-primary/10 text-primary border border-primary",
          "hover:bg-primary/15",
        ].join(" "),
      },
      // Outline accent selected state
      {
        variant: "outline-accent",
        isSelected: true,
        className: [
          "bg-accent/10 text-accent border border-accent",
          "hover:bg-accent/15",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      isSelected: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isSelected?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isSelected, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, isSelected, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
