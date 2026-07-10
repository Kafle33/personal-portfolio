import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface GpsStatusLineProps {
    className?: string;
    delay?: number;
}

const STATUS_TEXT = "SIGNAL ACQUIRED · 12 SATELLITES · FIX: 3D · DATUM: WGS84";

/**
 * A GPS-receiver style status line that types itself out character by character.
 */
export const GpsStatusLine = ({ className = "", delay = 1200 }: GpsStatusLineProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [chars, setChars] = useState(shouldReduceMotion ? STATUS_TEXT.length : 0);

    useEffect(() => {
        if (shouldReduceMotion) return;
        let interval: ReturnType<typeof setInterval>;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setChars((c) => {
                    if (c >= STATUS_TEXT.length) {
                        clearInterval(interval);
                        return c;
                    }
                    return c + 1;
                });
            }, 22);
        }, delay);
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [delay, shouldReduceMotion]);

    const finished = chars >= STATUS_TEXT.length;

    return (
        <p
            className={`font-mono text-[10px] sm:text-xs tracking-[0.2em] text-primary/70 select-none ${className}`}
            aria-label={STATUS_TEXT}
        >
            <span className="text-primary/40 mr-2" aria-hidden>▸</span>
            <span aria-hidden>{STATUS_TEXT.slice(0, chars)}</span>
            {!finished && !shouldReduceMotion && (
                <span className="animate-pulse text-primary" aria-hidden>▊</span>
            )}
        </p>
    );
};
