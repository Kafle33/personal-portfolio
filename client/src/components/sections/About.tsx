import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { easing, viewportOnce } from "../../lib/animations";

export const About = () => {
    const highlights = [
        { icon: "fa-globe", text: "WebGIS Development", color: "bg-primary/10 text-primary" },
        { icon: "fa-satellite-dish", text: "Earth Observation", color: "bg-accent/10 text-accent" },
        { icon: "fa-brain", text: "AI/ML Integration", color: "bg-emerald-custom/10 text-emerald-custom" },
        { icon: "fa-helicopter", text: "Drone Surveying", color: "bg-purple-500/10 text-purple-400" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easing.smooth }
        }
    };

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: easing.smooth,
                delay: 0.4 + i * 0.08
            }
        })
    };

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Subtle section divider at top */}
            <div className="absolute top-0 left-0 right-0 h-24 section-fade-top pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="About Me"
                    icon="fa-user-astronaut"
                    iconColor="text-accent"
                />

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="space-y-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="relative p-8 rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm glow-hover"
                        >
                            <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
                                <motion.p variants={itemVariants} className="text-justify">
                                    <span className="text-primary font-bold text-2xl mr-1">C</span>ertified Geomatics Engineer and Backend/WebGIS Developer at NAXA where I build tools for AI-based Earth Observation, spatial data processing, and decision-support systems. Experienced in GeoAI, combining drone and Sentinel data and have worked with international projects like GeoNadir.
                                </motion.p>
                                <motion.p variants={itemVariants} className="text-justify">
                                    Focused on applying AI with EO technologies to monitor land and environmental change, with a focus on sustainable solutions for the Global South. I architect production-ready backends using Django, FastAPI, and Docker, deploying on AWS infrastructure with PostGIS spatial databases and GeoServer tile services.
                                </motion.p>
                                <motion.p variants={itemVariants} className="text-justify italic text-muted-foreground">
                                    Outside of work, I enjoy hiking, meeting new people, sharing ideas, and collaborating across cultures.
                                </motion.p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap gap-4 justify-center pt-4"
                            variants={containerVariants}
                        >
                            {highlights.map((item, index) => (
                                <motion.div
                                    key={item.text}
                                    custom={index}
                                    variants={badgeVariants}
                                    whileHover={{ scale: 1.05, y: -3 }}
                                    transition={{ duration: 0.2, ease: easing.smooth }}
                                    className={`${item.color} px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 border border-current/10 cursor-default shadow-sm`}
                                >
                                    <i className={`fas ${item.icon}`}></i>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative background grid */}
            <motion.div
                className="absolute top-0 right-0 w-1/3 h-full geospatial-grid opacity-15 pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.15 }}
                viewport={viewportOnce}
                transition={{ duration: 1, ease: easing.smooth }}
            />
        </section>
    );
};
