import { lazy, Suspense, useRef } from "react";
import { useInView } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { projectsData, PortfolioItem } from "../../data/portfolio";
import { PortfolioCard } from "../portfolio/PortfolioCard";
import { usePerformanceTier } from "../../hooks/use-performance-tier";

const ProjectMap = lazy(() => import("../portfolio/ProjectMap"));

interface ProjectsProps {
    onItemClick: (item: PortfolioItem) => void;
}

export const Projects = ({ onItemClick }: ProjectsProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const tier = usePerformanceTier();
    // Mount the map shortly before the section scrolls into view; keep it mounted after
    const nearView = useInView(sectionRef, { margin: "600px", once: true });

    return (
        <section ref={sectionRef} id="projects" className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Research & Projects"
                    icon="fa-rocket"
                    iconColor="text-emerald-custom"
                    subtitle="Innovative solutions combining AI, Earth Observation, and WebGIS."
                />

                {tier === "high" && nearView && (
                    <Suspense fallback={<div className="h-24" aria-hidden />}>
                        <ProjectMap items={projectsData} onItemClick={onItemClick} />
                    </Suspense>
                )}

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
