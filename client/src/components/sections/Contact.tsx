import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { personalInfo } from "../../data/portfolio";
import { Card } from "../ui/card";
import { easing, viewportOnce } from "../../lib/animations";

export const Contact = () => {
    const contactMethods = [
        {
            id: 'email',
            icon: "fas fa-envelope",
            label: "Email",
            value: personalInfo.email,
            href: `mailto:${personalInfo.email}`,
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        {
            id: 'phone',
            icon: "fas fa-phone-alt",
            label: "Phone",
            value: personalInfo.phone,
            href: `tel:${personalInfo.phone}`,
            color: "text-accent",
            bgColor: "bg-accent/10"
        },
        {
            id: 'github',
            icon: "fab fa-github",
            label: "GitHub",
            value: "View Projects",
            href: personalInfo.github,
            color: "text-earth-gray",
            bgColor: "bg-earth-gray/10"
        },
        {
            id: 'linkedin',
            icon: "fab fa-linkedin",
            label: "LinkedIn",
            value: "Connect",
            href: personalInfo.linkedin,
            color: "text-emerald-custom",
            bgColor: "bg-emerald-custom/10"
        },
        {
            id: 'researchgate',
            icon: "fab fa-researchgate",
            label: "ResearchGate",
            value: "Publications",
            href: personalInfo.researchgate,
            color: "text-[#00ccbb]",
            bgColor: "bg-[#00ccbb]/10"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.4, ease: easing.smooth }
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeader
                    title="Get In Touch"
                    icon="fa-handshake"
                    iconColor="text-accent"
                    subtitle="Ready to collaborate on innovative geospatial solutions? Let's discuss how we can work together."
                />

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                >
                    {contactMethods.map((method) => (
                        <motion.div
                            key={method.id}
                            variants={cardVariants}
                        >
                            <a
                                href={method.href}
                                target={method.id !== 'email' && method.id !== 'phone' ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="block h-full"
                            >
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ duration: 0.3, ease: easing.smooth }}
                                >
                                    <Card className="p-6 h-full flex flex-col items-center text-center bg-card border-border/50 hover:border-primary/40 transition-all duration-500 group shimmer-effect glow-hover overflow-hidden">
                                        <motion.div
                                            className={`${method.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner`}
                                            whileHover={{ scale: 1.1, rotate: 8 }}
                                            transition={{ duration: 0.3, ease: easing.smooth }}
                                        >
                                            <i className={`${method.icon} text-2xl ${method.color}`}></i>
                                        </motion.div>
                                        <h3 className="font-bold text-foreground mb-2">{method.label}</h3>
                                        <p
                                            className="text-muted-foreground text-sm group-hover:text-primary transition-colors duration-300 w-full truncate px-2"
                                            title={method.value}
                                        >
                                            {method.value}
                                        </p>
                                    </Card>
                                </motion.div>
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Background decoration with breathing animation */}
            <motion.div
                className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
        </section>
    );
};
