import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { skillsData } from "../../data/portfolio";
import { Card } from "../ui/card";

export const Skills = () => {
    return (
        <section id="skills" className="py-24 bg-muted/30 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Technical Skills"
                    icon="fa-cogs"
                    iconColor="text-primary"
                    subtitle="A comprehensive toolkit for geospatial engineering and full-stack development."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {skillsData.map((category, idx) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full bg-card border-border/50 hover:border-primary/50 transition-all duration-500 group overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${category.color.replace('text-', 'bg-')}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                            <i className={`fas ${category.icon} ${category.color} text-xl`}></i>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight">{category.category}</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium border border-border/50 group-hover:border-primary/20 group-hover:text-foreground transition-colors"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Decorative bottom bar */}
                                <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${category.color.replace('text-', 'bg-')}`} />
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
