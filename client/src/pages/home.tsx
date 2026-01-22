import { useState, useEffect } from "react";
import { GeospatialPreloader } from "@/components/ui/geospatial-preloader";
import { PortfolioItem } from "../data/portfolio";

// Layout Components
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "contact"];
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
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  if (isLoading) {
    return <GeospatialPreloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <Hero />
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
