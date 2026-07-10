import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, personalInfo } from "../../data/portfolio";

interface NavbarProps {
    activeSection: string;
    scrollToSection: (id: string) => void;
}

/** Slippy-map zoom levels: the page reads as one long zoom from space to street */
const ZOOM_LEVELS: Record<string, string> = {
    hero: "z0",
    about: "z4",
    skills: "z8",
    experience: "z10",
    projects: "z12",
    certifications: "z14",
    contact: "z18",
};

export const Navbar = ({ activeSection, scrollToSection }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((currentScroll / scrollHeight) * 100);
        };

        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    return (
        <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border geospatial-grid">
            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-primary z-50"
                style={{ width: `${scrollProgress}%` }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold text-primary flex items-center gap-2 cursor-pointer"
                        onClick={() => scrollToSection("hero")}
                    >
                        <i className="fas fa-globe-americas text-accent floating-animation"></i>
                        <span>{personalInfo.name}</span>
                    </motion.div>

                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`transition-all duration-300 hover:scale-105 relative py-1 ${activeSection === item.id
                                        ? "font-semibold text-primary"
                                        : "text-muted-foreground hover:text-primary"
                                    }`}
                            >
                                {item.label}
                                <span
                                    className={`ml-1 font-mono text-[8px] align-super transition-opacity duration-300 ${activeSection === item.id ? "opacity-70 text-primary" : "opacity-0"}`}
                                    aria-hidden
                                >
                                    {ZOOM_LEVELS[item.id]}
                                </span>
                                {activeSection === item.id && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                        <button
                            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
                            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-mono text-[10px]"
                            aria-label="Open command palette"
                        >
                            <span>⌘K</span>
                        </button>
                        <a
                            href={personalInfo.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-sm border border-primary/20 hover:border-primary shadow-sm"
                        >
                            CV
                        </a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-muted-foreground hover:text-primary transition-colors p-2"
                            aria-label="Toggle Menu"
                        >
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden py-4 border-t border-border overflow-hidden"
                        >
                            <div className="flex flex-col space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            scrollToSection(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`text-left py-3 px-4 rounded-lg transition-all duration-300 ${activeSection === item.id
                                                ? "bg-primary/10 font-semibold text-primary"
                                                : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <a
                                    href={personalInfo.cv}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mx-4 mt-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-center font-medium shadow-lg"
                                >
                                    View CV
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
