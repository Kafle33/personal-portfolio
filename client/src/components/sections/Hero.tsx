import { motion, useScroll, useTransform } from "framer-motion";
import { personalInfo } from "../../data/portfolio";
import { easing } from "../../lib/animations";

export const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: easing.smooth }
        }
    };

    return (
        <section id="hero" className="geospatial-grid min-h-screen flex items-center pt-20 relative overflow-hidden">
            {/* Animated Background Elements - Reduced on mobile for performance */}
            <motion.div style={{ opacity }} className="absolute inset-0 pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-20 left-10 text-white/15 floating-animation hidden sm:block">
                    <i className="fas fa-satellite text-2xl md:text-3xl lg:text-4xl"></i>
                </motion.div>
                <motion.div style={{ y: y2 }} className="absolute top-40 right-20 text-yellow-300/20 floating-animation hidden md:block" >
                    <i className="fas fa-broadcast-tower text-2xl lg:text-3xl" style={{ animationDelay: '0.5s' }}></i>
                </motion.div>
                <div className="absolute bottom-32 left-1/4 text-blue-300/20 floating-animation hidden lg:block" style={{ animationDelay: '1s' }}>
                    <i className="fas fa-helicopter text-xl lg:text-2xl"></i>
                </div>
                <div className="absolute top-1/3 right-1/3 text-green-300/15 floating-animation hidden lg:block" style={{ animationDelay: '1.5s' }}>
                    <i className="fas fa-plane text-2xl lg:text-3xl"></i>
                </div>
                <div className="absolute top-1/2 left-1/6 text-purple-300/20 floating-animation hidden lg:block" style={{ animationDelay: '2s' }}>
                    <i className="fas fa-brain text-xl lg:text-2xl"></i>
                </div>
            </motion.div>

            <motion.div
                style={{ scale }}
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10"
            >
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            {/* Live status indicator */}
                            {/* <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-white/80">Available for opportunities</span>
                            </motion.div> */}

                            <motion.h1
                                variants={itemVariants}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white drop-shadow-2xl"
                            >
                                {personalInfo.name}
                            </motion.h1>

                            <motion.h2
                                variants={itemVariants}
                                className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-medium text-white/90 flex items-center gap-3"
                            >
                                <i className="fas fa-satellite-dish text-yellow-300 pulse-slow"></i>
                                {personalInfo.role}
                            </motion.h2>
                        </div>

                        <motion.div variants={itemVariants} className="space-y-4 text-white/80">
                            <div className="flex items-center gap-4 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300">
                                    <i className="fas fa-map-marker-alt text-red-400 group-hover:scale-110 transition-transform"></i>
                                </div>
                                <div>
                                    <p className="font-medium text-white">{personalInfo.location}</p>
                                    <p className="text-xs font-mono opacity-60">{personalInfo.coordinates}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                                    <i className="fas fa-envelope text-blue-400 group-hover:scale-110 transition-transform"></i>
                                </div>
                                <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors duration-300 link-underline">
                                    {personalInfo.email}
                                </a>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                            <CTAButton href={personalInfo.github} icon="fab fa-github" label="GitHub" variant="white" />
                            <CTAButton href={personalInfo.linkedin} icon="fab fa-linkedin" label="LinkedIn" variant="blue" />
                            <CTAButton href={personalInfo.researchgate} icon="fab fa-researchgate" label="ResearchGate" variant="teal" />
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-8 border-t border-white/10">
                            <motion.a
                                href={personalInfo.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 text-white rounded-xl font-bold overflow-hidden flex items-center justify-center gap-3 shimmer-effect glow-hover min-h-[44px]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease: easing.smooth }}
                            >
                                <i className="fas fa-eye group-hover:scale-110 transition-transform duration-300"></i>
                                <span>View CV</span>
                            </motion.a>

                            <motion.a
                                href={personalInfo.cv}
                                download="Roshan_Kafle_CV.pdf"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold border border-white/20 hover:bg-white/20 flex items-center justify-center gap-3 group transition-all duration-300 min-h-[44px]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease: easing.smooth }}
                            >
                                <i className="fas fa-download group-hover:translate-y-0.5 transition-transform duration-300"></i>
                                <span>Download PDF</span>
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: easing.smooth, delay: 0.3 }}
                        className="hidden md:block relative mt-8 lg:mt-0"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                            <img
                                src={personalInfo.profileImg}
                                alt={personalInfo.name}
                                className="w-full h-auto transform transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
                        </div>

                        {/* Decorative elements around image */}
                        <motion.div
                            className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6, ease: easing.smooth }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 hidden sm:flex"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to explore</span>
                <motion.div
                    className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 1.8, duration: 0.5, ease: easing.smooth }}
                    style={{ transformOrigin: 'top' }}
                />
            </motion.div>
        </section>
    );
};

const CTAButton = ({ href, icon, label, variant, isInternal = false }: { href: string; icon: string; label: string; variant: 'white' | 'blue' | 'teal' | 'purple'; isInternal?: boolean }) => {
    const variants = {
        white: "bg-white text-gray-900 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
        blue: "bg-[#0077b5] text-white hover:bg-[#006396] hover:shadow-[0_0_20px_rgba(0,119,181,0.3)]",
        teal: "bg-[#00ccbb] text-white hover:bg-[#00b3a4] hover:shadow-[0_0_20px_rgba(0,204,187,0.3)]",
        purple: "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
    };

    return (
        <motion.a
            href={href}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            className={`${variants[variant]} px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: easing.smooth }}
        >
            <i className={icon}></i>
            <span>{label}</span>
        </motion.a>
    );
};
