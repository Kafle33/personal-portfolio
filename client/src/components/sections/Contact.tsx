import { motion } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { personalInfo } from "../../data/portfolio";
import { Card } from "../ui/card";

export const Contact = () => {
    const contactMethods = [
        {
            id: 'email',
            icon: "fa-envelope",
            label: "Email",
            value: personalInfo.email,
            href: `mailto:${personalInfo.email}`,
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        {
            id: 'phone',
            icon: "fa-phone",
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

    return (
        <section id="contact" className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeader
                    title="Get In Touch"
                    icon="fa-handshake"
                    iconColor="text-accent"
                    subtitle="Ready to collaborate on innovative geospatial solutions? Let's discuss how we can work together."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {contactMethods.map((method, idx) => (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <a href={method.href} target={method.id !== 'email' && method.id !== 'phone' ? "_blank" : undefined} rel="noopener noreferrer">
                                <Card className="p-8 h-full flex flex-col items-center text-center bg-card border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-500 group">
                                    <div className={`${method.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                                        <i className={`${method.icon} text-2xl ${method.color}`}></i>
                                    </div>
                                    <h3 className="font-bold text-foreground mb-2">{method.label}</h3>
                                    <p className="text-muted-foreground text-sm group-hover:text-primary transition-colors break-all">
                                        {method.value}
                                    </p>
                                </Card>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </section>
    );
};
