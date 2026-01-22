import { SectionHeader } from "../layout/SectionHeader";
import { projectsData, PortfolioItem } from "../../data/portfolio";
import { PortfolioCard } from "../portfolio/PortfolioCard";

interface ProjectsProps {
    onItemClick: (item: PortfolioItem) => void;
}

export const Projects = ({ onItemClick }: ProjectsProps) => {
    return (
        <section id="projects" className="py-24 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Research & Projects"
                    icon="fa-rocket"
                    iconColor="text-emerald-custom"
                    subtitle="Innovative solutions combining AI, Earth Observation, and WebGIS."
                />

                <div className="grid md:grid-cols-2 gap-8">
                    {projectsData.map((project, index) => (
                        <PortfolioCard
                            key={project.id}
                            item={project}
                            index={index}
                            type="project"
                            onClick={() => onItemClick(project)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
