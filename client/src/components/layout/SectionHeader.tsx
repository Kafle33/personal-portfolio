import { motion } from "framer-motion";
import { easing, staggerItem, viewportOnce } from "../../lib/animations";

interface SectionHeaderProps {
    title: string;
    icon: string;
    iconColor?: string;
    subtitle?: string;
}

export const SectionHeader = ({ title, icon, iconColor = "text-primary", subtitle }: SectionHeaderProps) => {
    return (
        <div className="text-center mb-16 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: easing.smooth }}
            >
                <motion.h2
                    className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.5, ease: easing.smooth }}
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-background/60 border border-border/60 backdrop-blur-sm">
                        <motion.i
                            className={`fas ${icon} ${iconColor}`}
                            initial={{ scale: 0.8, rotate: -10 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={viewportOnce}
                            transition={{ duration: 0.5, ease: easing.bounce, delay: 0.1 }}
                        />
                        <span>{title}</span>
                    </div>
                </motion.h2>

                {/* Animated underline with subtle geospatial grid feel */}
                <motion.div
                    className="h-1.5 mx-auto rounded-full mb-4 shadow-sm overflow-hidden w-24"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.6, ease: easing.smooth, delay: 0.2 }}
                    style={{ transformOrigin: "center" }}
                >
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 geospatial-grid" />
                </motion.div>

                {subtitle && (
                    <motion.p
                        className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
                        {...staggerItem}
                        viewport={viewportOnce}
                        transition={{ duration: 0.5, ease: easing.smooth, delay: 0.3 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};
