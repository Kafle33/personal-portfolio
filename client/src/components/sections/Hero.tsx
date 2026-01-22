import { motion, useScroll, useTransform } from "framer-motion";
import { personalInfo } from "../../data/portfolio";

export const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section id="hero" className="gradient-bg geospatial-grid min-h-screen flex items-center pt-20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div style={{ opacity }} className="absolute inset-0 pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-20 left-10 text-white/20 floating-animation">
                    <i className="fas fa-satellite text-4xl"></i>
                </motion.div>
                <motion.div style={{ y: y2, animationDelay: '0.5s' }} className="absolute top-40 right-20 text-yellow-300/30 floating-animation">
                    <i className="fas fa-broadcast-tower text-3xl"></i>
                </motion.div>
                <div className="absolute bottom-32 left-1/4 text-blue-300/30 floating-animation" style={{ animationDelay: '1s' }}>
                    <i className="fas fa-helicopter text-2xl"></i>
                </div>
                <div className="absolute top-1/3 right-1/3 text-green-300/20 floating-animation" style={{ animationDelay: '1.5s' }}>
                    <i className="fas fa-plane text-3xl"></i>
                </div>
                <div className="absolute top-1/2 left-1/6 text-purple-300/30 floating-animation" style={{ animationDelay: '2s' }}>
                    <i className="fas fa-brain text-2xl"></i>
                </div>
            </motion.div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            {/* <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Available for new opportunities
                            </motion.div> */}

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
                                {personalInfo.name}
                            </h1>

                            <h2 className="text-2xl lg:text-3xl font-medium text-white/90 flex items-center gap-3">
                                <i className="fas fa-satellite-dish text-yellow-300 pulse-slow"></i>
                                {personalInfo.role}
                            </h2>
                        </div>

                        <div className="space-y-4 text-white/80">
                            <div className="flex items-center gap-4 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                                    <i className="fas fa-map-marker-alt text-red-400"></i>
                                </div>
                                <div>
                                    <p className="font-medium text-white">{personalInfo.location}</p>
                                    <p className="text-xs font-mono opacity-60">{personalInfo.coordinates}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                    <i className="fas fa-envelope text-blue-400"></i>
                                </div>
                                <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors underline-offset-4 hover:underline">
                                    {personalInfo.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <CTAButton href={personalInfo.github} icon="fab fa-github" label="GitHub" variant="white" />
                            <CTAButton href={personalInfo.linkedin} icon="fab fa-linkedin" label="LinkedIn" variant="blue" />
                            <CTAButton href={personalInfo.researchgate} icon="fab fa-researchgate" label="ResearchGate" variant="teal" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                            <a
                                href={personalInfo.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <i className="fas fa-eye group-hover:scale-110 transition-transform"></i>
                                <span>View Portfolio CV</span>
                            </a>

                            <a
                                href={personalInfo.cv}
                                download="Roshan_Kafle_CV.pdf"
                                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                <i className="fas fa-download group-hover:translate-y-1 transition-transform"></i>
                                <span>Download PDF</span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                            <img
                                src={personalInfo.profileImg}
                                alt={personalInfo.name}
                                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Decorative elements around image */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
        </section>
    );
};

const CTAButton = ({ href, icon, label, variant }: { href: string; icon: string; label: string; variant: 'white' | 'blue' | 'teal' }) => {
    const variants = {
        white: "bg-white text-forest hover:bg-gray-100",
        blue: "bg-[#0077b5] text-white hover:bg-[#006396]",
        teal: "bg-[#00ccbb] text-white hover:bg-[#00b3a4]"
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${variants[variant]} px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95`}
        >
            <i className={icon}></i>
            <span>{label}</span>
        </a>
    );
};
