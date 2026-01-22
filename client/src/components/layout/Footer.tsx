import { personalInfo } from "../../data/portfolio";

export const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground py-16 geospatial-grid relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                        <i className="fas fa-globe-americas text-accent floating-animation"></i>
                        {personalInfo.name}
                    </h3>
                    <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                        <i className="fas fa-satellite-dish mr-2 text-yellow-300"></i>
                        {personalInfo.role}
                    </p>

                    <div className="flex justify-center space-x-8 mb-10">
                        {[
                            { href: personalInfo.github, icon: "fab fa-github", label: "GitHub" },
                            { href: personalInfo.linkedin, icon: "fab fa-linkedin", label: "LinkedIn" },
                            { href: personalInfo.researchgate, icon: "fab fa-researchgate", label: "ResearchGate" },
                            { href: `mailto:${personalInfo.email}`, icon: "fas fa-envelope", label: "Email" }
                        ].map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
                                aria-label={social.label}
                            >
                                <i className={`${social.icon} text-2xl`}></i>
                            </a>
                        ))}
                    </div>

                    <div className="border-t border-primary-foreground/20 pt-8">
                        <p className="text-primary-foreground/60 text-sm flex items-center justify-center gap-2">
                            <i className="fas fa-map-pin text-accent"></i>
                            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved. | {personalInfo.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
        </footer>
    );
};
