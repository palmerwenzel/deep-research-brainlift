import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    "relative w-full rounded-lg border p-4",
    "[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    "transition-all",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-background/80 text-foreground border-border/50 backdrop-blur-[1px]",
          "hover:border-accent/30 hover:bg-accent/5",
          "dark:bg-background/30 dark:border-border/40",
          "dark:hover:bg-accent/10 dark:hover:border-accent/30",
          "shadow-sm hover:shadow",
        ].join(" "),
        primary: [
          "bg-primary/10 text-primary border-primary/20",
          "hover:bg-primary/15 hover:border-primary/30",
        ].join(" "),
        success: [
          "bg-success/10 text-success border-success/20",
          "hover:bg-success/15 hover:border-success/30",
          "[&>svg]:text-success",
        ].join(" "),
        warning: [
          "bg-warning/10 text-warning border-warning/20",
          "hover:bg-warning/15 hover:border-warning/30",
          "[&>svg]:text-warning",
        ].join(" "),
        destructive: [
          "bg-destructive/10 text-destructive border-destructive/20",
          "hover:bg-destructive/15 hover:border-destructive/30",
          "[&>svg]:text-destructive",
        ].join(" "),
        info: [
          "bg-info/10 text-info border-info/20",
          "hover:bg-info/15 hover:border-info/30",
          "[&>svg]:text-info",
        ].join(" "),
        soft: [
          "bg-accent/10 text-accent-foreground border-accent/20",
          "hover:bg-accent/15 hover:border-accent/30",
        ].join(" "),
        gradient: [
          "bg-gradient-primary/10 text-primary-foreground border-primary/20",
          "hover:bg-gradient-primary/15 hover:border-primary/30",
          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-5 after:transition-opacity",
          "hover:after:opacity-10",
          "isolate after:-z-10",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
