import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { skillsData } from "../../data/portfolio";
import { Card } from "../ui/card";
import { SkillRadar } from "../ui/skill-radar";
import { easing, viewportOnce } from "../../lib/animations";

export const Skills = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easing.smooth }
        }
    };

    const skillBadgeVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: easing.smooth,
                delay: i * 0.03
            }
        })
    };

    return (
        <section id="skills" className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Technical Skills"
                    icon="fa-cogs"
                    iconColor="text-primary"
                    subtitle="A comprehensive toolkit for geospatial engineering and full-stack development."
                />

                <div className="mb-16">
                    <SkillRadar />
                </div>

                <motion.div
                    className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                >
                    {skillsData.map((category) => (
                        <motion.div
                            key={category.category}
                            variants={cardVariants}
                        >
                            <Card className="h-full bg-card border-border/50 hover:border-primary/40 transition-all duration-500 group overflow-hidden shimmer-effect glow-hover">
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className={`w-12 h-12 rounded-2xl ${category.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3, ease: easing.smooth }}
                                        >
                                            <i className={`fas ${category.icon} ${category.color} text-xl`}></i>
                                        </motion.div>
                                        <h3 className="font-bold text-lg leading-tight">{category.category}</h3>
                                    </div>

                                    <motion.div
                                        className="flex flex-wrap gap-2"
                                        variants={containerVariants}
                                    >
                                        {category.skills.map((skill, i) => (
                                            <motion.span
                                                key={skill}
                                                custom={i}
                                                variants={skillBadgeVariants}
                                                whileHover={{ scale: 1.08, y: -2 }}
                                                transition={{ duration: 0.2, ease: easing.smooth }}
                                                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium border border-border/50 group-hover:border-primary/20 group-hover:text-foreground transition-colors duration-300 cursor-default"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Decorative bottom bar with smooth grow animation */}
                                <motion.div
                                    className={`h-1 ${category.color.replace('text-', 'bg-')}`}
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.5, ease: easing.smooth }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
