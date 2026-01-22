import { SectionHeader } from "../layout/SectionHeader";
import { experiencesData, PortfolioItem } from "../../data/portfolio";
import { PortfolioCard } from "../portfolio/PortfolioCard";

interface ExperienceProps {
    onItemClick: (item: PortfolioItem) => void;
}

export const Experience = ({ onItemClick }: ExperienceProps) => {
    return (
        <section id="experience" className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Professional Experience"
                    icon="fa-briefcase"
                    iconColor="text-primary"
                    subtitle="My journey through geospatial engineering and software development."
                />

                <div className="grid md:grid-cols-2 gap-8">
                    {experiencesData.map((exp, index) => (
                        <PortfolioCard
                            key={exp.id}
                            item={exp}
                            index={index}
                            type="experience"
                            onClick={() => onItemClick(exp)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
