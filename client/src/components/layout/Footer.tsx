import { motion } from "framer-motion";
import { personalInfo } from "../../data/portfolio";
import { easing, viewportOnce } from "../../lib/animations";
import { MapInstruments } from "./MapInstruments";

export const Footer = () => {
    const socials = [
        { href: personalInfo.github, icon: "fab fa-github", label: "GitHub" },
        { href: personalInfo.linkedin, icon: "fab fa-linkedin", label: "LinkedIn" },
        { href: personalInfo.researchgate, icon: "fab fa-researchgate", label: "ResearchGate" },
        { href: `mailto:${personalInfo.email}`, icon: "fas fa-envelope", label: "Email" }
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
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: easing.smooth }
        }
    };

    return (
        <footer className="bg-primary text-primary-foreground py-16 geospatial-grid relative overflow-hidden">
            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
            >
                <div className="text-center">
                    <motion.h3
                        variants={itemVariants}
                        className="text-2xl font-bold mb-4 flex items-center justify-center gap-3"
                    >
                        <motion.i
                            className="fas fa-globe-americas text-accent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        />
                        {personalInfo.name}
                    </motion.h3>

                    <motion.div
                        variants={itemVariants}
                        className="text-primary-foreground/80 mb-8 max-w-md mx-auto flex flex-col gap-1"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <i className="fas fa-satellite-dish text-yellow-300"></i>
                            <span>{personalInfo.role[0]}</span>
                        </div>
                        <div className="text-sm opacity-70">
                            {personalInfo.role[1]}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex justify-center space-x-4 sm:space-x-8 mb-10"
                    >
                        {socials.map((social, index) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-foreground/60 hover:text-white transition-colors duration-300 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label={social.label}
                                whileHover={{ scale: 1.25, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2, ease: easing.smooth }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={viewportOnce}
                                custom={index}
                            >
                                <i className={`${social.icon} text-xl sm:text-2xl`}></i>
                            </motion.a>
                        ))}
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="border-t border-primary-foreground/20"
                    >
                        <MapInstruments />
                        <p className="text-primary-foreground/60 text-xs flex items-center justify-center gap-2 text-center px-4 mt-6">
                            <i className="fas fa-map-pin text-accent"></i>
                            <span>{personalInfo.location} · All rights reserved</span>
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <motion.div
                    className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>
        </footer>
    );
};
