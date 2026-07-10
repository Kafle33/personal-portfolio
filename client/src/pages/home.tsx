import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { GeospatialPreloader } from "@/components/ui/geospatial-preloader";
import { PortfolioItem } from "../data/portfolio";
import { GeospatialBackground } from "@/components/ui/geospatial-background";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

// Layout Components
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { FlightPathProgress } from "../components/layout/FlightPathProgress";
import { CommandPalette } from "../components/layout/CommandPalette";

// Section Components
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Skills } from "../components/sections/Skills";
import { Experience } from "../components/sections/Experience";
import { Projects } from "../components/sections/Projects";
import { Certifications } from "../components/sections/Certifications";
import { Contact } from "../components/sections/Contact";

// Portfolio Components
import { DetailsDialog } from "../components/portfolio/DetailsDialog";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "certifications", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`, -80);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      {/* Page renders beneath the globe preloader; exit zoom reveals a ready hero. */}
      <AnimatePresence>
        {isLoading && (
          <GeospatialPreloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <GeospatialBackground />
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      <FlightPathProgress activeSection={activeSection} scrollToSection={scrollToSection} />
      <CommandPalette scrollToSection={scrollToSection} />

      <main>
        <Hero start={!isLoading} />
        <About />
        <Skills />
        <Experience onItemClick={setSelectedItem} />
        <Projects onItemClick={setSelectedItem} />
        <Certifications onItemClick={setSelectedItem} />
        <Contact />
      </main>

      <Footer />

      <DetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
