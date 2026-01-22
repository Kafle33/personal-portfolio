/**
 * Centralized animation configuration for consistent, soothing motion.
 * Uses natural easing curves for premium feel.
 */

// Smooth easing curves that feel natural and calm
export const easing = {
    smooth: [0.4, 0, 0.2, 1] as const,       // Default smooth
    smoothOut: [0, 0, 0.2, 1] as const,      // Decelerate
    smoothIn: [0.4, 0, 1, 1] as const,       // Accelerate
    bounce: [0.68, -0.55, 0.265, 1.55] as const, // Subtle bounce
};

// Fade in from bottom - main reveal animation
export const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: easing.smooth }
};

// Fade in from left
export const fadeInLeft = {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: easing.smooth }
};

// Fade in from right
export const fadeInRight = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: easing.smooth }
};

// Scale in for emphasis
export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: easing.smooth }
};

// Container for staggered children
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

// Child item for staggered animations
export const staggerItem = {
    initial: { opacity: 0, y: 16 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: easing.smooth }
    }
};

// Hover effects for interactive elements
export const hoverScale = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: easing.smooth }
};

// Hover lift effect for cards
export const hoverLift = {
    whileHover: { y: -6, transition: { duration: 0.3, ease: easing.smooth } },
    whileTap: { scale: 0.98 }
};

// Viewport settings for scroll animations
export const viewportOnce = {
    once: true,
    margin: "-50px",
    amount: 0.2 as const
};

// Section entrance animation
export const sectionEntrance = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: viewportOnce,
    transition: { duration: 0.8, ease: easing.smooth }
};

// Create staggered delay for array items
export const getStaggerDelay = (index: number, baseDelay: number = 0.08) => ({
    delay: index * baseDelay
});
