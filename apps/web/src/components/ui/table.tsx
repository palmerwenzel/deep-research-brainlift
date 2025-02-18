import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableVariants = cva(
  [
    "w-full caption-bottom text-sm",
    "animate-in fade-in-50 bg-background/50 backdrop-blur-[1px]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "rounded-lg border border-border/50",
          "shadow-sm dark:shadow-accent/5",
          "[&_thead]:bg-muted/30 [&_tfoot]:bg-muted/30",
          "dark:[&_thead]:bg-muted/10 dark:[&_tfoot]:bg-muted/10",
        ].join(" "),
        bordered: [
          "[&_th]:border [&_td]:border",
          "[&_th]:border-border/50 [&_td]:border-border/50",
        ].join(" "),
      },
      isStriped: {
        true: "[&_tr:nth-child(even)]:bg-muted/50",
        false: "",
      },
      isHoverable: {
        true: "[&_tr:hover]:bg-muted/60 [&_tr]:transition-colors",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isStriped: false,
      isHoverable: true,
    },
  }
)

const tableRowVariants = cva("border-b transition-colors", {
  variants: {
    variant: {
      default: [
        "border-border/30",
        "hover:bg-accent/5 dark:hover:bg-accent/10",
        "data-[state=selected]:bg-accent/10 dark:data-[state=selected]:bg-accent/15",
      ].join(" "),
      destructive: [
        "border-destructive/20",
        "hover:bg-destructive/10",
        "data-[state=selected]:bg-destructive/20",
      ].join(" "),
      success: [
        "border-success/20",
        "hover:bg-success/10",
        "data-[state=selected]:bg-success/20",
      ].join(" "),
      warning: [
        "border-warning/20",
        "hover:bg-warning/10",
        "data-[state=selected]:bg-warning/20",
      ].join(" "),
      ghost: [
        "border-transparent",
        "hover:bg-muted/50",
        "data-[state=selected]:bg-muted",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, isStriped, isHoverable, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(tableVariants({ variant, isStriped, isHoverable }), className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b [&_tr]:border-border/50 bg-muted/50",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border/50 bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      "transition-colors",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      "transition-colors",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  tableRowVariants,
}
