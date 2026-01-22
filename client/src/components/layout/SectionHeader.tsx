import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    icon: string;
    iconColor?: string;
    subtitle?: string;
}

export const SectionHeader = ({ title, icon, iconColor = "text-primary", subtitle }: SectionHeaderProps) => {
    return (
        <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                    <i className={`fas ${icon} ${iconColor}`}></i>
                    {title}
                </h2>
                <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-4 shadow-sm"></div>
                {subtitle && (
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </motion.div>
        </div>
    );
};
