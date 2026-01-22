import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { PortfolioItem } from "../../data/portfolio";

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                onClick={onClick}
                className="group cursor-pointer bg-card border-border/50 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full"
            >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden bg-muted/20">
                    <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-background/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-border/50">
                            <i className={`fas ${icon} ${color} text-lg`}></i>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-2 border border-white/10">
                        <i className="fas fa-images text-primary"></i>
                        <span>{item.images.length} Photos</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                                {item.title}
                            </h3>
                            <i className="fas fa-arrow-right text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"></i>
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
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 group-hover:border-primary/30 transition-colors"
                            >
                                {tech}
                            </span>
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
