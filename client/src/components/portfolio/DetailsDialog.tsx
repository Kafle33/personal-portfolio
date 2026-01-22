import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { PortfolioItem } from "../../data/portfolio";

interface DetailsDialogProps {
    item: PortfolioItem | null;
    onClose: () => void;
}

export const DetailsDialog = ({ item, onClose }: DetailsDialogProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [enterDirection, setEnterDirection] = useState<'prev' | 'next'>('prev');

    useEffect(() => {
        if (item) {
            setCurrentImageIndex(0);
            setEnterDirection('prev');
        }
    }, [item]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!item || item.images.length <= 1) return;

            if (e.key === "ArrowRight") {
                setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
                setEnterDirection('next');
            } else if (e.key === "ArrowLeft") {
                setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
                setEnterDirection('prev');
            } else if (e.key === "Enter") {
                if (enterDirection === 'next') {
                    setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));
                } else {
                    setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [item, enterDirection]);

    if (!item) return null;

    return (
        <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-6xl h-[90vh] md:h-[85vh] p-0 gap-0 bg-card border-border overflow-hidden flex flex-col md:grid md:grid-cols-2">

                {/* Left Column: Images */}
                <div className="relative h-[40vh] md:h-full bg-black/20 flex flex-col justify-center p-4 md:p-8 order-1 border-b md:border-b-0 md:border-r border-border/50">
                    <div className="relative w-full h-full flex flex-col justify-center group">
                        {/* Main Image */}
                        <div className="relative flex-1 min-h-0 flex items-center justify-center w-full">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={item.images[currentImageIndex]}
                                    alt={`${item.title} - Image ${currentImageIndex + 1}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="w-full h-full object-contain max-h-full drop-shadow-2xl"
                                />
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            {item.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            setCurrentImageIndex((prev) =>
                                                prev === 0 ? item.images.length - 1 : prev - 1
                                            );
                                            setEnterDirection('prev');
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground text-foreground p-4 rounded-full transition-all duration-300 shadow-xl border border-border/50 group-hover:opacity-100 opacity-0 translate-x-[-10px] group-hover:translate-x-0"
                                        aria-label="Previous Image"
                                    >
                                        <i className="fas fa-chevron-left text-lg"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentImageIndex((prev) =>
                                                prev === item.images.length - 1 ? 0 : prev + 1
                                            );
                                            setEnterDirection('next');
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground text-foreground p-4 rounded-full transition-all duration-300 shadow-xl border border-border/50 group-hover:opacity-100 opacity-0 translate-x-[10px] group-hover:translate-x-0"
                                        aria-label="Next Image"
                                    >
                                        <i className="fas fa-chevron-right text-lg"></i>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {item.images.length > 1 && (
                            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide justify-center shrink-0">
                                {item.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 relative ${idx === currentImageIndex
                                            ? 'border-primary ring-4 ring-primary/20 scale-110 shadow-lg'
                                            : 'border-transparent hover:border-primary/50 opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Image Counter */}
                        {item.images.length > 1 && (
                            <div className="absolute top-0 right-0 bg-black/70 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-white border border-white/10 shadow-2xl">
                                <i className="fas fa-images mr-2 text-primary"></i>
                                {currentImageIndex + 1} / {item.images.length}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col h-full overflow-y-auto p-6 sm:p-8 md:p-12 order-2 bg-card relative">
                    {/* Mobile Close Button - Sticky at top */}
                    <button
                        onClick={onClose}
                        className="sticky top-0 right-0 ml-auto mb-4 sm:mb-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-md border-2 border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg active:scale-95"
                        aria-label="Close dialog"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>

                    <DialogHeader className="p-0 mb-8 text-left">
                        <div className="flex items-center gap-4 mb-4">
                            {item.period && (
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                    {item.period}
                                </span>
                            )}
                        </div>
                        <DialogTitle className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                            {item.link ? (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors hover:underline decoration-primary/30"
                                >
                                    {item.title}
                                </a>
                            ) : item.title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-10">
                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <i className="fas fa-align-left text-primary text-sm"></i>
                                </div>
                                Overview
                            </h3>
                            <DialogDescription className="text-foreground/80 text-lg leading-relaxed text-justify">
                                {item.description}
                            </DialogDescription>
                        </div>

                        {/* Detailed Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <i className="fas fa-list-ul text-accent text-sm"></i>
                                </div>
                                Key Highlights
                            </h3>
                            <div className="space-y-5">
                                {item.details.map((detail, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 group/item"
                                    >
                                        <div className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        <p className="text-muted-foreground leading-relaxed text-justify text-base">
                                            {detail}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Technologies Used */}
                        <div className="bg-muted/30 p-8 rounded-3xl border border-border/50 shadow-inner">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-custom/10 flex items-center justify-center">
                                    <i className="fas fa-tools text-emerald-custom text-sm"></i>
                                </div>
                                Technologies
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {item.technologies.map((tech, index) => {
                                    const colors = [
                                        'bg-primary/10 text-primary border-primary/20',
                                        'bg-accent/10 text-accent border-accent/20',
                                        'bg-emerald-custom/10 text-emerald-custom border-emerald-custom/20',
                                        'bg-purple-600/10 text-purple-600 border-purple-600/20',
                                        'bg-earth-gray/10 text-earth-gray border-earth-gray/20'
                                    ];
                                    return (
                                        <span
                                            key={index}
                                            className={`${colors[index % colors.length]} px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all hover:scale-110 hover:shadow-lg cursor-default`}
                                        >
                                            {tech}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
