import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { PortfolioItem } from "../../data/portfolio";
import { easing, viewportOnce } from "../../lib/animations";

const TILE_COLS = 5;
const TILE_ROWS = 3;

/** Legend swatch colors cycled across tech "layers" */
const LEGEND_COLORS = ["bg-primary", "bg-accent", "bg-emerald-400", "bg-amber-400", "bg-sky-400"];

/** Map-tile loading reveal: a grid of tiles over the image that clears in random order */
const TileReveal = () => {
    const order = useMemo(() => {
        const indices = Array.from({ length: TILE_COLS * TILE_ROWS }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }, []);

    return (
        <div
            className="absolute inset-0 grid pointer-events-none z-[1]"
            style={{ gridTemplateColumns: `repeat(${TILE_COLS}, 1fr)`, gridTemplateRows: `repeat(${TILE_ROWS}, 1fr)` }}
            aria-hidden
        >
            {order.map((delayRank, i) => (
                <motion.div
                    key={i}
                    className="bg-muted border border-background/40"
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, ease: easing.smooth, delay: 0.15 + delayRank * 0.045 }}
                />
            ))}
        </div>
    );
};

interface PortfolioCardProps {
    item: PortfolioItem;
    onClick: () => void;
    index: number;
    type: 'experience' | 'project' | 'certification';
}

export const PortfolioCard = ({ item, onClick, index, type }: PortfolioCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let intervalId: NodeJS.Timeout;

        if (isHovered && item.images.length > 1) {
            // First transition after 1 second
            timeoutId = setTimeout(() => {
                setCurrentImageIndex(1 % item.images.length);

                // Subsequent transitions every 2 seconds
                intervalId = setInterval(() => {
                    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
                }, 2000);
            }, 1000);
        } else {
            setCurrentImageIndex(0);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [isHovered, item.images.length]);

    const icons = {
        experience: ['fa-building', 'fa-satellite-dish', 'fa-exclamation-triangle', 'fa-home'],
        project: ['fa-seedling', 'fa-map-signs', 'fa-globe', 'fa-map', 'fa-city'],
        certification: ['fa-laptop-code', 'fa-chalkboard-teacher']
    };

    const colors = {
        experience: ['text-primary', 'text-accent', 'text-emerald-custom', 'text-earth-gray'],
        project: ['text-emerald-custom', 'text-primary', 'text-accent', 'text-orange-500', 'text-blue-500'],
        certification: ['text-primary', 'text-accent']
    };

    const icon = icons[type][index % icons[type].length];
    const color = colors[type][index % colors[type].length];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: easing.smooth,
                delay: index * 0.1
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: easing.smooth }}
        >
            <Card
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group cursor-pointer bg-card border-border/50 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full shimmer-effect glow-hover"
            >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden bg-muted/20">
                    <TileReveal />
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={item.images[currentImageIndex]}
                            alt={`${item.title} - ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover absolute inset-0"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: easing.smooth }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <motion.div
                            className="bg-background/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-border/50"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2, ease: easing.smooth }}
                        >
                            <i className={`fas ${icon} ${item.id === 'precision-farming' ? 'text-emerald-500' : color} text-lg`}></i>
                        </motion.div>
                    </div>

                    <motion.div
                        className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-2 border border-white/10"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.4, ease: easing.smooth, delay: 0.3 + index * 0.1 }}
                    >
                        <i className="fas fa-images text-primary"></i>
                        <span>{item.images.length} Photos</span>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                {item.title}
                            </h3>
                            <motion.i
                                className="fas fa-arrow-right text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                initial={{ x: 0 }}
                                whileHover={{ x: 4 }}
                            />
                        </div>

                        {item.period && (
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 w-fit px-2.5 py-1 rounded-md">
                                <i className="fas fa-calendar-alt opacity-70"></i>
                                {item.period}
                            </div>
                        )}
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed text-justify">
                        {item.description}
                    </p>

                    {/* Tech stack styled as a map layer legend */}
                    <div className="mt-auto">
                        <div className="font-mono text-[8px] tracking-[0.25em] text-muted-foreground/70 uppercase mb-2">
                            Layers
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {item.technologies.slice(0, 4).map((tech, i) => (
                                <motion.span
                                    key={i}
                                    className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                                    whileHover={{ scale: 1.06 }}
                                    transition={{ duration: 0.2, ease: easing.smooth }}
                                >
                                    <span className={`w-2 h-2 rounded-[2px] ${LEGEND_COLORS[i % LEGEND_COLORS.length]} opacity-80`} />
                                    {tech}
                                </motion.span>
                            ))}
                            {item.technologies.length > 4 && (
                                <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/60">
                                    <span className="w-2 h-2 rounded-[2px] border border-dashed border-muted-foreground/50" />
                                    +{item.technologies.length - 4} layers
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
