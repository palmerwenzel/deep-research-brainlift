import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  [
    "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
    "bg-background/80 backdrop-blur-[1px]",
    "ring-offset-background placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50",
          "hover:border-accent/30 hover:bg-accent/5",
          "focus-visible:border-accent/50 focus-visible:bg-accent/5",
          "dark:bg-background/30 dark:hover:bg-accent/10",
          "shadow-sm",
        ].join(" "),
        destructive: [
          "border-destructive/50 text-destructive",
          "placeholder:text-destructive/60",
          "focus-visible:ring-destructive/30",
        ].join(" "),
        success: [
          "border-success/50 text-success-foreground",
          "placeholder:text-success/60",
          "focus-visible:ring-success/30",
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
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base px-4 py-3",
      },
      isError: {
        true: [
          "border-destructive/50 text-destructive",
          "placeholder:text-destructive/60",
          "focus-visible:ring-destructive/30",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isError: false,
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, isError, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, isError }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
