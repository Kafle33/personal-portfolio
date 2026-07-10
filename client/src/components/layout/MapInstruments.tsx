import { useEffect, useState } from "react";

/**
 * Cartographic footer instruments: a working scale bar that recalculates with
 * viewport width, a compass rose, and a map-style attribution line.
 * The fictional scale maps the viewport to ~0.36° of longitude at Pokhara's latitude.
 */

const NICE_DISTANCES = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50];

const useScaleBar = () => {
    const [scale, setScale] = useState({ px: 120, km: 10 });

    useEffect(() => {
        const compute = () => {
            const width = window.innerWidth;
            // 0.36° lon at 28.2°N ≈ 0.36 × 111.32 × cos(28.2°) km across the viewport
            const kmAcross = 0.36 * 111.32 * Math.cos((28.2 * Math.PI) / 180);
            const kmPerPx = kmAcross / width;
            const targetKm = kmPerPx * 130;
            const km = NICE_DISTANCES.reduce((best, d) =>
                Math.abs(d - targetKm) < Math.abs(best - targetKm) ? d : best
            );
            setScale({ px: Math.round(km / kmPerPx), km });
        };
        compute();
        window.addEventListener("resize", compute);
        return () => window.removeEventListener("resize", compute);
    }, []);

    return scale;
};

export const MapInstruments = () => {
    const { px, km } = useScaleBar();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-primary-foreground/70">
            {/* Scale bar */}
            <div className="flex flex-col gap-1" aria-label={`Map scale: ${km} kilometers`}>
                <div className="flex" style={{ width: px }}>
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 border border-primary-foreground/60 ${i % 2 === 0 ? "bg-primary-foreground/70" : "bg-transparent"}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between font-mono text-[9px] tracking-wider" style={{ width: px }}>
                    <span>0</span>
                    <span>{km / 2} km</span>
                    <span>{km} km</span>
                </div>
            </div>

            {/* Compass rose */}
            <div className="flex items-center gap-2" aria-label="North arrow">
                <svg width="34" height="34" viewBox="0 0 34 34" className="opacity-80">
                    <circle cx="17" cy="17" r="15" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
                    <path d="M17 4 L20 17 L17 14.5 L14 17 Z" fill="currentColor" />
                    <path d="M17 30 L20 17 L17 19.5 L14 17 Z" fill="currentColor" opacity="0.35" />
                    <text x="17" y="3" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="monospace">N</text>
                </svg>
                <div className="font-mono text-[9px] leading-tight tracking-wider opacity-80">
                    <div>TRUE NORTH</div>
                    <div className="opacity-60">DECL. 0.4°W</div>
                </div>
            </div>

            {/* Map-style attribution */}
            <div className="font-mono text-[10px] tracking-wide opacity-80">
                © {new Date().getFullYear()} Roshan Kafle ·{" "}
                <a
                    href="https://github.com/Kafle33/personal-portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 hover:opacity-100"
                >
                    Improve this map
                </a>
            </div>
        </div>
    );
};
