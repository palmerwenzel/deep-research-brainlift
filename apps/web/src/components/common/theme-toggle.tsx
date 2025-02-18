/**
 * theme-toggle.tsx
 * -----------
 * A toggle component for switching between light and dark themes.
 * Uses a soft variant by default to match our design system.
 */

"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "soft"
  showLabel?: boolean
}

export function ThemeToggle({
  className,
  variant = "soft",
  showLabel = false,
  ...props
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative rounded-full",
        showLabel && "w-auto px-3 gap-2",
        className
      )}
      {...props}
    >
      <Sun
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-all",
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] transition-all",
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>
    </Button>
  )
} 