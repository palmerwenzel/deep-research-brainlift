import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "flex w-full rounded-md border border-input bg-background px-3 py-2",
    "text-base md:text-sm ring-offset-background",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50 bg-background/80 backdrop-blur-[1px]",
          "hover:border-primary/30 hover:bg-primary/[0.02]",
          "focus-visible:border-primary/50 focus-visible:bg-primary/[0.02]",
          "dark:bg-background/30 dark:hover:bg-primary/[0.02]",
          "placeholder:text-muted-foreground/70",
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, isError, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, isError, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
