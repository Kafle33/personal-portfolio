import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { PortfolioItem } from "../../data/portfolio";
import { easing, viewportOnce } from "../../lib/animations";

interface PortfolioCardProps {
    item: PortfolioItem;
    onClick: () => void;
    index: number;
    type: 'experience' | 'project' | 'certification';
}

export const PortfolioCard = ({ item, onClick, index, type }: PortfolioCardProps) => {
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
                className="group cursor-pointer bg-card border-border/50 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full shimmer-effect glow-hover"
            >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden bg-muted/20">
                    <motion.img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: easing.smooth }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <motion.div
                            className="bg-background/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-border/50"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2, ease: easing.smooth }}
                        >
                            <i className={`fas ${icon} ${color} text-lg`}></i>
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

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {item.technologies.slice(0, 3).map((tech, i) => (
                            <motion.span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 group-hover:border-primary/30 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2, ease: easing.smooth }}
                            >
                                {tech}
                            </motion.span>
                        ))}
                        {item.technologies.length > 3 && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-muted-foreground bg-muted/50 border border-border/50">
                                +{item.technologies.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
