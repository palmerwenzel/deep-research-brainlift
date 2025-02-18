# Deep Research Agent Theme Guide

This guide establishes the visual identity and styling guidelines for the Deep Research Agent project. It articulates our "Sleek Dashboard" design concept with a desktop-first, engaging, and responsive approach. Use this document to ensure consistency in colors, typography, and visual microinteractions across the application.

---

## 1. Overview

Deep Research Agent empowers users to execute deep research, organize insights, and build a "second brain." Our visual theme is inspired by a modern, data-driven dashboard that feels both energetic and professional. This guide focuses on the aesthetics—the colors, fonts, and visual treatments—that bring this vision to life.

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

### Main Gradient
- **Start:** `#2563EB` (Blue)
- **End:** `#8B5CF6` (Purple)

*Usage:*  
- Apply in headers, hero sections, and accent panels to reinforce a futuristic yet professional vibe.

### Accent Colors
- **Amber Accent:** `#F59E0B`  
  *Usage:*  
  - Use for call-to-action buttons, highlights, and key interactive elements.

### Neutrals & Backgrounds
- **Primary Background:** `#F9FAFB`
- **Surfaces/Cards:** `#FFFFFF`
- **Dividers/Borders:** `#E5E7EB`

### Text Colors
- **Primary Text:** `#111827`
- **Secondary Text:** `#4B5563`
- **Muted/Placeholder Text:** `#6B7280`

### Feedback Colors
- **Success:** `#22C55E`
- **Warning:** `#FBBF24`
- **Error:** `#EF4444`
- **Info:** `#3B82F6`

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

## 5. Visual Component Styling

- **Buttons & Controls:**  
  - Primary buttons: Amber (`#F59E0B`) with clear hover and focus effects using smooth transitions.
  - Secondary actions: Outlined or subtly shaded designs that don’t detract from primary elements.
- **Cards & Panels:**  
  - Use `#FFFFFF` surfaces with gentle shadows and rounded corners for depth.
  - Headers or titles can incorporate the main gradient for a premium look.
- **Forms and Inputs:**  
  - Maintain clear labels (using primary text color) and provide visible focus states.
  - Helper text in muted colors enhances clarity without distraction.

---

## 6. Microinteractions & Animations

- **Hover and Focus States:**  
  - Utilize gentle scale transformations or shadow changes to communicate interactivity.
- **Transitions:**  
  - Apply subtle fade-ins or slide transitions (using Tailwind CSS utilities) to smooth state changes.
- **Real-Time Visual Feedback:**  
  - Incorporate animated progress indicators and status badges that utilize our feedback color palette.

---

## 7. Visual Accessibility

- **Color Contrast:**  
  - All text, icons, and interactive elements must meet or exceed WCAG minimum contrast ratios.
- **Legibility:**  
  - Ensure font sizes and line spacing support easy reading over long sessions.

---

## 8. Integration with Tech Stack for Styling

- **React & Next.js:**  
  - Implement visual components as functional, declarative JSX elements.
- **Tailwind CSS:**  
  - Use the Tailwind configuration to define shared design tokens (colors, fonts, spacing) that perpetuate a consistent visual style.
- **Shadcn & Radix UI:**  
  - Adapt pre-built components to inherit our visual tokens for a uniform appearance.

---

## 9. Summary

The Deep Research Agent theme provides a modern, data-centric, and accessible aesthetic that underscores our commitment to clarity and engagement. Follow these visual guidelines to maintain consistency and inspire creativity across the platform.

---