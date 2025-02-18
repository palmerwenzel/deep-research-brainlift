/**
 * theme.ts
 * -----------
 * Theme constants and helper functions for the Deep Research Agent project.
 * Implements styling based on theme guidelines.
 */

export const themeConfig = {
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  spacing: {
    xs: '0.5rem',     // 8px
    sm: '0.75rem',    // 12px
    base: '1rem',     // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  transitions: {
    base: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  feedback: {
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--destructive)',
    info: 'var(--info)',
  } as const,
} as const;

// Helper function to generate gradient background style
export function getGradientStyle(direction: 'to-right' | 'to-bottom' = 'to-right') {
  return `linear-gradient(${direction}, hsl(var(--gradient-start)), hsl(var(--gradient-end)))`;
}

// Helper function to get feedback color based on status
export function getFeedbackColor(status: keyof typeof themeConfig.feedback) {
  return `hsl(${themeConfig.feedback[status]})`;
}

// Helper function to get consistent transition style
export function getTransitionStyle(properties: string[], type: keyof typeof themeConfig.transitions = 'base') {
  return properties.map(prop => `${prop} ${themeConfig.transitions[type]}`).join(', ');
}

// Helper function to get shadow with optional color overlay
export function getShadowStyle(size: keyof typeof themeConfig.shadows, colorOverlay?: string) {
  const baseShadow = themeConfig.shadows[size];
  return colorOverlay 
    ? `${baseShadow}, 0 0 0 1px ${colorOverlay}`
    : baseShadow;
}

// Helper function to get component background with optional hover state
export function getBackgroundStyle(isHovered = false) {
  return {
    backgroundColor: `hsl(var(--${isHovered ? 'accent' : 'background'}))`,
    transition: getTransitionStyle(['background-color']),
  };
}

// Helper to check if a color meets WCAG contrast requirements
export function meetsContrastRequirements(foreground: string, background: string) {
  // This is a placeholder for actual contrast calculation
  // In a real implementation, we'd use a color contrast library
  console.warn('Contrast check not implemented for:', foreground, background);
  return true;
} 