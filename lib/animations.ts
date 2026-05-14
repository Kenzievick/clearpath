// Animation durations
export const DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
} as const;

// Animation easings
export const EASING = {
  // Standard easing for most transitions
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Ease out for elements entering the screen
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  // Ease in for elements leaving the screen
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  // Slight spring feel for interactive elements
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// CSS transition strings for common use cases
export const TRANSITION = {
  // For hover states on buttons and cards
  interactive: `all ${DURATION.fast}ms ${EASING.standard}`,
  // For page elements fading in
  fadeIn: `opacity ${DURATION.slow}ms ${EASING.decelerate}, transform ${DURATION.slow}ms ${EASING.decelerate}`,
  // For color and background changes
  color: `color ${DURATION.normal}ms ${EASING.standard}, background-color ${DURATION.normal}ms ${EASING.standard}`,
} as const;
