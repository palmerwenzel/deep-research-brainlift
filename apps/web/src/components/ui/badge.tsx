import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full px-2.5 py-0.5",
    "text-xs font-semibold transition-all",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "border border-transparent",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-background/80 text-foreground/90 border-border/50 backdrop-blur-[1px]",
          "hover:bg-accent/10 hover:border-accent/30 hover:text-accent-foreground",
          "dark:bg-background/30 dark:text-foreground/80",
          "dark:hover:bg-accent/20 dark:hover:text-accent-foreground",
          "shadow-sm",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground border-secondary/20",
          "hover:bg-secondary/90",
        ].join(" "),
        success: [
          "bg-success text-success-foreground border-success/20",
          "hover:bg-success/90",
        ].join(" "),
        warning: [
          "bg-warning text-warning-foreground border-warning/20",
          "hover:bg-warning/90",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground border-destructive/20",
          "hover:bg-destructive/90",
        ].join(" "),
        info: [
          "bg-info text-info-foreground border-info/20",
          "hover:bg-info/90",
        ].join(" "),
        outline: [
          "border-border bg-background text-foreground",
          "hover:bg-muted/50 hover:text-foreground/80",
        ].join(" "),
        "outline-primary": [
          "border-primary/50 bg-primary/5 text-primary",
          "hover:bg-primary/10 hover:border-primary/80",
        ].join(" "),
        "outline-success": [
          "border-success/50 bg-success/5 text-success",
          "hover:bg-success/10 hover:border-success/80",
        ].join(" "),
        "outline-warning": [
          "border-warning/50 bg-warning/5 text-warning",
          "hover:bg-warning/10 hover:border-warning/80",
        ].join(" "),
        "outline-destructive": [
          "border-destructive/50 bg-destructive/5 text-destructive",
          "hover:bg-destructive/10 hover:border-destructive/80",
        ].join(" "),
        "outline-info": [
          "border-info/50 bg-info/5 text-info",
          "hover:bg-info/10 hover:border-info/80",
        ].join(" "),
        soft: [
          "bg-accent/15 text-accent-foreground/90 border-accent/30",
          "hover:bg-accent/25 hover:border-accent/40",
        ].join(" "),
        gradient: [
          "bg-gradient-primary text-primary-foreground shadow-sm",
          "hover:opacity-90",
        ].join(" "),
      },
      size: {
        default: "h-6",
        sm: "h-5 px-2 text-[10px]",
        lg: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
