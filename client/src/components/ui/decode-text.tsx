import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const SCRAMBLE_POOL = "0123456789°'.NESW─┼";

interface DecodeTextProps {
    text: string;
    className?: string;
    /** ms before decoding starts */
    delay?: number;
    /** ms per decode step */
    speed?: number;
}

/**
 * Renders text that "decodes" from coordinate-like scramble characters,
 * resolving left to right. Falls back to static text for reduced motion.
 */
export const DecodeText = ({ text, className, delay = 0, speed = 35 }: DecodeTextProps) => {
    const shouldReduceMotion = useReducedMotion();
    const [display, setDisplay] = useState(shouldReduceMotion ? text : "");
    const [done, setDone] = useState(!!shouldReduceMotion);
    const frame = useRef(0);

    useEffect(() => {
        if (shouldReduceMotion) {
            setDisplay(text);
            setDone(true);
            return;
        }

        let interval: ReturnType<typeof setInterval>;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                frame.current += 1;
                // Each char locks in after (index * 2 + 4) frames
                const resolved = text
                    .split("")
                    .map((char, i) => {
                        if (char === " ") return " ";
                        if (frame.current > i * 2 + 4) return char;
                        return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
                    })
                    .join("");
                setDisplay(resolved);
                if (frame.current > text.length * 2 + 4) {
                    clearInterval(interval);
                    setDisplay(text);
                    setDone(true);
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [text, delay, speed, shouldReduceMotion]);

    return (
        <span className={className} aria-label={text}>
            <span aria-hidden={!done}>{display || " "}</span>
        </span>
    );
};
