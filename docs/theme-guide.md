# Deep Research Agent Theme Guide

This guide establishes the visual identity and styling guidelines for the Deep Research Agent project. It articulates our "Sleek Dashboard" design concept with a desktop-first, engaging, and responsive approach. Use this document to ensure consistency in colors, typography, and visual microinteractions across the application.

---

## 1. Overview

Deep Research Agent empowers users to execute deep research, organize insights, and build a "second brain." Our visual theme is inspired by a modern, data-driven dashboard that feels both energetic and professional. This guide focuses on the aesthetics—the colors, fonts, and visual treatments—that bring this vision to life.

---

## 2. Theme File Structure

Our theme system is split across four key files, each with distinct responsibilities:

### `src/app/globals.css`
- Defines CSS variables for theme tokens (colors, spacing, etc.)
- Contains light and dark mode color schemes
- Applies base styles and Tailwind directives
- Manages global CSS resets and defaults

### `src/lib/theme.ts`
- Provides TypeScript constants for theme values
- Contains helper functions for theme operations
- Ensures type safety for theme values
- Centralizes theme logic and calculations

### `tailwind.config.ts`
- Extends Tailwind with our custom theme values
- Configures color palette and design tokens
- Sets up animation and component variants
- Manages responsive breakpoints and plugins

### `src/app/providers.tsx`
- Handles theme context and persistence
- Manages light/dark mode switching
- Ensures proper hydration
- Wraps the application with theme support

---

## 2. Design Philosophy

- **Clarity:**  
  Emphasize clean, modular designs that reduce visual noise and let complex research outputs stand out.
- **Engagement:**  
  Use dynamic gradients, subtle animations, and interactive visual cues to invite exploration.
- **Consistency:**  
  Maintain uniform visual treatments for fonts, spacing, and UI elements to build trust and familiarity.
- **Accessibility (Visual):**  
  Ensure that all color choices and visual contrasts meet WCAG guidelines for readability.

---

## 3. Color Scheme

### Main Colors - Gradient
- **Start:** `hsl(221 84% 53%)` - Blue (#2563EB)
- **End:** `hsl(258 90% 66%)` - Purple (#8B5CF6)

*Usage:*  
- Primary gradient for key UI elements
- Background accents and interactive elements
- Hover states and focus indicators

### Accent Colors
- **Primary Accent:** `hsl(221 84% 53%)` - Blue (#2563EB)
- **Rich Violet:** `hsl(265 90% 70%)` - Bright Violet (#A05CFF)

*Usage:*  
- Primary accent for interactive elements
- Secondary accents for visual hierarchy
- Focus states and highlights

### Neutrals & Backgrounds
Light Mode:
- **Background:** `hsl(0 0% 100%)` - Pure White
- **Card/Surface:** `hsl(0 0% 100%)` - White
- **Border:** `hsl(220 13% 91%)` - Light Gray (#E5E7EB)
- **Gradient Background:** Subtle violet gradient overlay

Dark Mode:
- **Background:** `hsl(222 20% 9%)` - Dark base
- **Card/Surface:** `hsl(217 33% 17%)` - Dark Gray (#374151)
- **Border:** `hsl(217 33% 17%)` - Dark Gray
- **Gradient Background:** Subtle violet gradient overlay with reduced opacity

### Text Colors
Light Mode:
- **Foreground:** `hsl(222 47% 11%)` - Dark Gray (#1F2937)
- **Muted:** `hsl(215 16% 47%)` - Medium Gray (#64748B)
- **Muted Foreground:** `hsl(215 20% 65%)` - Light Gray (#94A3B8)

Dark Mode:
- **Foreground:** `hsl(210 40% 98%)` - Off White (#F8FAFC)
- **Muted:** Same as light mode
- **Muted Foreground:** Same as light mode

### Feedback Colors
Standard:
- **Success:** `hsl(142 76% 36%)` - Green (#22C55E)
- **Warning:** `hsl(38 92% 50%)` - Amber (#F59E0B)
- **Destructive:** `hsl(0 84% 60%)` - Red (#EF4444)
- **Info:** `hsl(217 91% 60%)` - Blue (#3B82F6)

Dark Mode Variants:
- Slightly brighter versions with increased saturation
- All feedback colors use `hsl(210 40% 98%)` (#F8FAFC) for foreground text

### Component-Specific Colors
- **Primary:** Uses main gradient blue
- **Secondary:** Light/Dark variants of primary
- **Ring:** Matches accent color
- **Border Radius:** 0.5rem (8px)

---

## 4. Typography & Visual Layout

- **Font Selection:**  
  - Use clean, sans-serif fonts (or web-safe/system fonts enhanced via Tailwind CSS) to ensure readability.
- **Hierarchy & Scale:**  
  - **Headings:** Bold and sizeable (using `#111827`) to lead content.
  - **Body Text:** Regular weight with comfortable line-height and spacing.
  - **Accent Text:** Use secondary hues (`#4B5563` or muted tones) for less prominent details.
- **Visual Spacing:**  
  - Employ grid systems and consistent spacing (via Tailwind CSS utilities) to maximize white space and allow content to breathe.

---

## 5. Icon System & Usage

Our project uses Lucide icons to maintain a consistent, professional visual language. Icons should enhance usability without creating visual clutter.

### Icon Principles

- **Consistency:**
  - Use Lucide icons exclusively for a unified look
  - Maintain consistent sizing within similar contexts
  - Standard sizes: Small (16px), Medium (20px), Large (24px)

- **Purpose & Placement:**
  - Navigation: Use icons to reinforce menu items and improve recognition
  - Actions: Pair icons with buttons to clarify their purpose
  - Status: Use icons to indicate state (success, warning, loading)
  - Empty States: Large icons (32px+) to make blank areas more engaging

- **Styling Guidelines:**
  ```tsx
  // Navigation icons
  <Icon className="h-5 w-5 text-muted-foreground" />
  
  // Primary action icons
  <Icon className="h-4 w-4 text-primary" />
  
  // Status icons
  <Icon className="h-4 w-4 text-success" />
  ```

### Common Use Cases

1. **Interactive Elements:**
   - Buttons: Icon + text for primary actions
   - Icon-only buttons: Use for common actions (close, menu, etc.)
   - Always include `sr-only` text for accessibility

2. **Navigation & Structure:**
   - Section headers: Small icons to reinforce content type
   - Menu items: Consistent icons to aid recognition
   - Breadcrumbs: Subtle separators and item icons

3. **Status & Feedback:**
   - Form validation: Success/error indicators
   - Loading states: Animated icons
   - Empty states: Large, muted icons with messages

4. **Progressive Disclosure:**
   - Expandable sections: Chevron icons
   - Dropdown menus: Small arrow indicators
   - Modal triggers: Clear action icons

### Accessibility Considerations

- Always pair icon-only buttons with screen reader text
- Use appropriate `aria-label` attributes when needed
- Ensure sufficient color contrast for icon visibility
- Avoid using icons as the sole means of conveying information

---

## 6. Visual Component Styling

- **Buttons & Controls:**  
  - Primary buttons: Amber (`#F59E0B`) with clear hover and focus effects using smooth transitions.
  - Secondary actions: Outlined or subtly shaded designs that don't detract from primary elements.
- **Cards & Panels:**  
  - Use `#FFFFFF` surfaces with gentle shadows and rounded corners for depth.
  - Headers or titles can incorporate the main gradient for a premium look.
- **Forms and Inputs:**  
  - Maintain clear labels (using primary text color) and provide visible focus states.
  - Helper text in muted colors enhances clarity without distraction.

---

## 7. Microinteractions & Animations

- **Hover and Focus States:**  
  - Utilize gentle scale transformations or shadow changes to communicate interactivity.
- **Transitions:**  
  - Apply subtle fade-ins or slide transitions (using Tailwind CSS utilities) to smooth state changes.
- **Real-Time Visual Feedback:**  
  - Incorporate animated progress indicators and status badges that utilize our feedback color palette.

---

## 8. Visual Accessibility

- **Color Contrast:**  
  - All text, icons, and interactive elements must meet or exceed WCAG minimum contrast ratios.
- **Legibility:**  
  - Ensure font sizes and line spacing support easy reading over long sessions.

---

## 9. Integration with Tech Stack for Styling

- **React & Next.js:**  
  - Implement visual components as functional, declarative JSX elements.
- **Tailwind CSS:**  
  - Use the Tailwind configuration to define shared design tokens (colors, fonts, spacing) that perpetuate a consistent visual style.
- **Shadcn & Radix UI:**  
  - Adapt pre-built components to inherit our visual tokens for a uniform appearance.

---

## 10. Summary

The Deep Research Agent theme provides a modern, data-centric, and accessible aesthetic that underscores our commitment to clarity and engagement. Follow these visual guidelines to maintain consistency and inspire creativity across the platform.

---