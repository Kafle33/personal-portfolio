import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface NumberTickerProps {
    value: number;
    suffix?: string;
    className?: string;
}

/** Counts up from 0 when scrolled into view. Reduced motion: renders final value. */
export const NumberTicker = ({ value, suffix = "", className }: NumberTickerProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const shouldReduceMotion = useReducedMotion();
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

    useEffect(() => {
        if (!inView) return;
        if (shouldReduceMotion) {
            if (ref.current) ref.current.textContent = value.toLocaleString() + suffix;
            return;
        }
        motionValue.set(value);
        const unsubscribe = spring.on("change", (v) => {
            if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
        });
        return unsubscribe;
    }, [inView, value, suffix, shouldReduceMotion, motionValue, spring]);

    return (
        <span ref={ref} className={className}>
            0{suffix}
        </span>
    );
};
