import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";

export const About = () => {
    const highlights = [
        { icon: "fa-globe", text: "WebGIS Development", color: "bg-primary/10 text-primary" },
        { icon: "fa-satellite-dish", text: "Earth Observation", color: "bg-accent/10 text-accent" },
        { icon: "fa-brain", text: "AI/ML Integration", color: "bg-emerald-custom/10 text-emerald-custom" },
        { icon: "fa-helicopter", text: "Drone Surveying", color: "bg-purple-500/10 text-purple-400" },
    ];

    return (
        <section id="about" className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="About Me"
                    icon="fa-user-astronaut"
                    iconColor="text-accent"
                />

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="relative p-8 rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm">

                            <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
                                <p className="text-justify">
                                    <span className="text-primary font-bold text-2xl mr-1">C</span>ertified Geomatics Engineer and Backend/WebGIS Developer at NAXA where I build tools for AI-based Earth Observation, spatial data processing, and decision-support systems. Experienced in GeoAI, combining drone and Sentinel data and have worked with international projects like GeoNadir.
                                </p>
                                <p className="text-justify">
                                    Focused on applying AI with EO technologies to monitor land and environmental change, with a focus on sustainable solutions for the Global South. I architect production-ready backends using Django, FastAPI, and Docker, deploying on AWS infrastructure with PostGIS spatial databases and GeoServer tile services.
                                </p>
                                <p className="text-justify italic text-muted-foreground">
                                    Outside of work, I enjoy hiking, meeting new people, sharing ideas, and collaborating across cultures.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center pt-4">
                            {highlights.map((item, index) => (
                                <motion.div
                                    key={item.text}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${item.color} px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 border border-current/10 hover:scale-105 transition-transform cursor-default shadow-sm`}
                                >
                                    <i className={`fas ${item.icon}`}></i>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative background grid */}
            <div className="absolute top-0 right-0 w-1/3 h-full geospatial-grid opacity-20 pointer-events-none" />
        </section>
    );
};
