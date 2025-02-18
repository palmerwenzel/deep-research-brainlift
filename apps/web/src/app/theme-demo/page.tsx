/**
 * theme-demo/page.tsx
 * -----------
 * A focused demo page showcasing our button variants and states.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ThemeDemo() {
  const [selectedButtons, setSelectedButtons] = useState<Record<string, boolean>>({})

  const toggleButton = (id: string) => {
    setSelectedButtons(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Button Variants</h1>
          <p className="text-muted-foreground mt-2">Showcasing our core button styles and states</p>
        </div>

        {/* Button Showcase */}
        <div className="grid gap-8">
          {/* Core Variants */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Core Variants</h2>
            <div className="flex gap-4">
              <Button 
                variant="default"
                isSelected={selectedButtons.default}
                onClick={() => toggleButton('default')}
              >
                Default
              </Button>
              <Button 
                variant="primary"
                isSelected={selectedButtons.primary}
                onClick={() => toggleButton('primary')}
              >
                Primary
              </Button>
              <Button 
                variant="soft"
                isSelected={selectedButtons.soft}
                onClick={() => toggleButton('soft')}
              >
                Soft
              </Button>
            </div>
          </div>

          {/* Gradient */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Gradient</h2>
            <div className="flex gap-4">
              <Button 
                variant="gradient"
                isSelected={selectedButtons.gradient}
                onClick={() => toggleButton('gradient')}
              >
                Static Gradient
              </Button>
              <Button 
                variant="gradient-animated"
                isSelected={selectedButtons.gradientAnimated}
                onClick={() => toggleButton('gradientAnimated')}
              >
                Animated Gradient
              </Button>
            </div>
          </div>

          {/* Filter Group Example */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Filter Group Example</h2>
            <div className="flex gap-2">
              {['All', 'Active', 'Completed', 'Archived'].map((filter) => (
                <Button
                  key={filter}
                  variant="default"
                  isSelected={selectedButtons[`filter_${filter}`]}
                  onClick={() => {
                    // Clear other filters
                    const newState = Object.keys(selectedButtons).reduce((acc, key) => {
                      if (key.startsWith('filter_')) acc[key] = false
                      return acc
                    }, {} as Record<string, boolean>)
                    // Set new filter
                    setSelectedButtons({
                      ...selectedButtons,
                      ...newState,
                      [`filter_${filter}`]: true
                    })
                  }}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Multi-Select Example */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Multi-Select Example</h2>
            <div className="flex flex-wrap gap-2">
              {['Option 1', 'Option 2', 'Option 3'].map((option) => (
                <Button
                  key={option}
                  variant="soft"
                  isSelected={selectedButtons[`option_${option}`]}
                  onClick={() => toggleButton(`option_${option}`)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* System States */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">System States</h2>
            <div className="flex gap-4">
              <Button 
                variant="destructive"
                isSelected={selectedButtons.destructive}
                onClick={() => toggleButton('destructive')}
              >
                Destructive
              </Button>
              <Button 
                variant="hover-gradient"
                isSelected={selectedButtons.hoverGradient}
                onClick={() => toggleButton('hoverGradient')}
              >
                Hover Gradient
              </Button>
              <Button 
                variant="ghost"
                isSelected={selectedButtons.ghost}
                onClick={() => toggleButton('ghost')}
              >
                Ghost
              </Button>
            </div>
          </div>

          {/* Color Combinations */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Outlined Variants</h2>
            <div className="flex gap-4">
              <Button 
                variant="outline-primary"
                isSelected={selectedButtons.outlinePrimary}
                onClick={() => toggleButton('outlinePrimary')}
              >
                Outline Primary
              </Button>
              <Button 
                variant="outline-accent"
                isSelected={selectedButtons.outlineAccent}
                onClick={() => toggleButton('outlineAccent')}
              >
                Outline Accent
              </Button>
            </div>
          </div>

          {/* Icon Buttons */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Icon Buttons</h2>
            <div className="flex gap-4">
              <Button 
                variant="default" 
                size="icon"
                isSelected={selectedButtons.iconDefault}
                onClick={() => toggleButton('iconDefault')}
              >
                <span className="sr-only">Icon button</span>
                +
              </Button>
              <Button 
                variant="soft" 
                size="icon"
                isSelected={selectedButtons.iconSoft}
                onClick={() => toggleButton('iconSoft')}
              >
                <span className="sr-only">Soft icon</span>
                ★
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                isSelected={selectedButtons.iconGhost}
                onClick={() => toggleButton('iconGhost')}
              >
                <span className="sr-only">Ghost icon</span>
                ⋯
              </Button>
            </div>
          </div>
        </div>

        {/* Background Showcase */}
        <div className="space-y-8 mt-16">
          <div>
            <h2 className="text-2xl font-bold">Background Options</h2>
            <p className="text-muted-foreground mt-2">Exploring different background styles for dark mode</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Current */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Current Background</h3>
              <div className="h-48 rounded-lg bg-[#1F2937] p-4">
                <div className="text-sm text-white/70">HSL 222 47% 11%</div>
              </div>
            </div>

            {/* Neutral Dark */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Neutral Dark</h3>
              <div className="h-48 rounded-lg bg-[hsl(220,20%,10%)] p-4">
                <div className="text-sm text-white/70">HSL 220 20% 10%</div>
              </div>
            </div>

            {/* Blue-Purple Harmony */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Blue-Purple Harmony</h3>
              <div className="h-48 rounded-lg bg-gradient-to-b from-[hsl(221,25%,8%)] to-[hsl(258,25%,10%)] p-4">
                <div className="text-sm text-white/70">
                  From: HSL 221 25% 8%<br />
                  To: HSL 258 25% 10%
                </div>
              </div>
            </div>

            {/* Monochromatic Depth */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Monochromatic Depth</h3>
              <div className="h-48 rounded-lg bg-gradient-to-b from-[hsl(222,20%,10%)] to-[hsl(222,20%,13%)] p-4">
                <div className="text-sm text-white/70">
                  From: HSL 222 20% 10%<br />
                  To: HSL 222 20% 13%
                </div>
              </div>
            </div>

            {/* Soft Vignette */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Soft Vignette</h3>
              <div className="h-48 rounded-lg bg-[radial-gradient(circle_at_center,hsl(222,25%,13%),hsl(222,25%,9%))] p-4">
                <div className="text-sm text-white/70">
                  Center: HSL 222 25% 13%<br />
                  Edge: HSL 222 25% 9%
                </div>
              </div>
            </div>

            {/* Modern Two-Tone */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Modern Two-Tone</h3>
              <div className="h-48 rounded-lg bg-gradient-to-b from-[hsl(221,20%,11%)] from-70% to-[hsl(258,20%,12%)] p-4">
                <div className="text-sm text-white/70">
                  Primary: HSL 221 20% 11% 70%<br />
                  Accent: HSL 258 20% 12%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 