import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PortfolioItem } from "../../data/portfolio";

interface ProjectMapProps {
    items: PortfolioItem[];
    onItemClick: (item: PortfolioItem) => void;
}

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Projects plotted as live map features. Free vector tiles (OpenFreeMap),
 * no API token — deploys statically. Scroll zoom stays off so the page
 * scroll is never hijacked; pan/click/keyboard still work.
 */
const ProjectMap = ({ items, onItemClick }: ProjectMapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const popupRef = useRef<maplibregl.Popup | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
    const [activeId, setActiveId] = useState<string | null>(null);

    const located = items.filter((p) => p.location);

    useEffect(() => {
        if (!containerRef.current) return;

        let disposed = false;
        const map = new maplibregl.Map({
            container: containerRef.current,
            style: MAP_STYLE,
            center: [84.5, 27.5],
            zoom: 5.4,
            scrollZoom: false,
            attributionControl: { compact: true },
        });
        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        map.on("load", () => {
            if (disposed) return;
            setStatus("ready");

            // Fit to the Nepal cluster (Australia reachable via the chips)
            const nepalPoints = located.filter((p) => p.location!.lng < 120);
            if (nepalPoints.length > 1) {
                const bounds = new maplibregl.LngLatBounds();
                nepalPoints.forEach((p) => bounds.extend([p.location!.lng, p.location!.lat]));
                map.fitBounds(bounds, { padding: 70, duration: 0, maxZoom: 8 });
            }
        });

        map.on("error", (e) => {
            // Style/tile fetch failure (offline, blocked CDN) — hide the panel gracefully
            if (!map.isStyleLoaded() && status === "loading") {
                console.warn("Project map unavailable:", e.error?.message);
                setStatus("failed");
            }
        });

        located.forEach((item) => {
            const el = document.createElement("div");
            el.className = "project-map-marker";
            el.innerHTML = `<span class="project-map-marker-dot"></span><span class="project-map-marker-ring"></span>`;
            el.setAttribute("role", "button");
            el.setAttribute("aria-label", `${item.title} — ${item.location!.place}`);
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                focusItem(item);
            });
            new maplibregl.Marker({ element: el, anchor: "center" })
                .setLngLat([item.location!.lng, item.location!.lat])
                .addTo(map);
        });

        return () => {
            disposed = true;
            popupRef.current?.remove();
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const focusItem = (item: PortfolioItem) => {
        const map = mapRef.current;
        if (!map || !item.location) return;
        setActiveId(item.id);

        const target = { center: [item.location.lng, item.location.lat] as [number, number], zoom: 9 };
        if (prefersReducedMotion()) {
            map.jumpTo(target);
        } else {
            map.flyTo({ ...target, duration: 2200, essential: false, curve: 1.6 });
        }

        popupRef.current?.remove();
        const node = document.createElement("div");
        node.className = "project-map-popup";
        node.innerHTML = `
            <div class="project-map-popup-title">${item.title}</div>
            <div class="project-map-popup-place">📍 ${item.location.place}</div>
            <button type="button" class="project-map-popup-btn">Open project →</button>
        `;
        node.querySelector("button")!.addEventListener("click", () => onItemClick(item));

        popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: false, maxWidth: "260px" })
            .setLngLat([item.location.lng, item.location.lat])
            .setDOMContent(node)
            .addTo(map);
    };

    if (status === "failed") return null;

    return (
        <div className="mb-14">
            <div className="flex items-center gap-2 mb-4 font-mono text-[10px] tracking-[0.25em] text-primary/60 uppercase">
                <i className="fas fa-map-marked-alt" aria-hidden />
                <span>Deployment extent · click a waypoint to fly</span>
            </div>

            {/* Fly-to chips */}
            <div className="flex flex-wrap gap-2 mb-4">
                {located.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => focusItem(item)}
                        className={`px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wide border transition-all duration-300 ${activeId === item.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border/60 hover:border-primary/50 hover:text-primary"
                            }`}
                    >
                        {item.title.split(" (")[0]}
                    </button>
                ))}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
                <div
                    ref={containerRef}
                    className="h-[380px] sm:h-[440px] w-full bg-muted/20"
                    aria-label="Interactive map of project locations"
                />
                {status === "loading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm font-mono text-xs tracking-[0.25em] text-primary/70 uppercase pointer-events-none">
                        Fetching tiles…
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectMap;
