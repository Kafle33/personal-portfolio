import { SectionHeader } from "../layout/SectionHeader";
import { certificationCategories, PortfolioItem } from "../../data/portfolio";
import { PortfolioCard } from "../portfolio/PortfolioCard";

interface CertificationsProps {
    onItemClick: (item: PortfolioItem) => void;
}

export const Certifications = ({ onItemClick }: CertificationsProps) => {
    return (
        <section id="certifications" className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Professional Development"
                    icon="fa-graduation-cap"
                    iconColor="text-primary"
                    subtitle="Continuous learning and certifications in advanced geospatial technologies."
                />

                <div className="grid md:grid-cols-2 gap-8">
                    {certificationCategories.map((category, index) => (
                        <PortfolioCard
                            key={category.id}
                            item={category}
                            index={index}
                            type="certification"
                            onClick={() => onItemClick(category)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
