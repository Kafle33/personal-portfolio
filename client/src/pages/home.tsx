import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { GeospatialPreloader } from "@/components/ui/geospatial-preloader";


export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
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
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" }
  ];

  if (isLoading) {
    return <GeospatialPreloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-sm z-50 border-b border-border geospatial-grid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-primary floating-animation">
              <i className="fas fa-globe-americas mr-2 text-accent"></i>
              Roshan Kafle
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-all duration-300 hover:scale-105 ${
                    activeSection === item.id
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left py-2 transition-all duration-300 hover:scale-105 ${
                      activeSection === item.id
                        ? "font-semibold text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="gradient-bg geospatial-grid min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Enhanced Floating elements with geospatial themes */}
        <div className="absolute inset-0">
          {/* Satellites */}
          <div className="absolute top-20 left-10 w-6 h-6 text-white/40 floating-animation">
            <i className="fas fa-satellite text-xl"></i>
          </div>
          <div className="absolute top-40 right-20 w-5 h-5 text-yellow-300/50 floating-animation" style={{ animationDelay: '0.5s' }}>
            <i className="fas fa-broadcast-tower text-lg"></i>
          </div>
          {/* Drones */}
          <div className="absolute bottom-32 left-1/4 w-4 h-4 text-blue-300/60 floating-animation" style={{ animationDelay: '1s' }}>
            <i className="fas fa-helicopter text-sm"></i>
          </div>
          <div className="absolute top-1/3 right-1/3 w-5 h-5 text-green-300/40 floating-animation" style={{ animationDelay: '1.5s' }}>
            <i className="fas fa-plane text-lg"></i>
          </div>
          {/* AI and Data nodes */}
          <div className="absolute top-1/2 left-1/6 w-3 h-3 text-purple-300/50 floating-animation" style={{ animationDelay: '2s' }}>
            <i className="fas fa-brain text-xs"></i>
          </div>
          <div className="absolute bottom-1/4 right-1/6 w-4 h-4 text-cyan-300/40 floating-animation" style={{ animationDelay: '2.5s' }}>
            <i className="fas fa-microchip text-sm"></i>
          </div>
          {/* GPS and Navigation */}
          <div className="absolute top-3/4 left-1/3 w-3 h-3 text-orange-300/50 floating-animation" style={{ animationDelay: '3s' }}>
            <i className="fas fa-location-dot text-xs"></i>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="animate-fade-in">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
                  Roshan Kafle
                </h1>
                <h2 className="text-xl lg:text-2xl mb-6 text-white pulse-slow drop-shadow-xl">
                  <i className="fas fa-satellite-dish mr-2 text-yellow-300"></i>
                  Geospatial Engineer | WebGIS & Backend Developer
                </h2>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 hover:translate-x-1 transition-transform duration-300">
                  <i className="fas fa-map-marker-alt text-lg text-red-300"></i>
                  <span className="text-white drop-shadow-lg">Pokhara, Gandaki, Nepal</span>
                  <span className="text-xs text-white/90 font-mono drop-shadow-lg">28.2096°N, 83.9856°E</span>
                </div>
                <div className="flex items-center space-x-3 hover:translate-x-1 transition-transform duration-300">
                  <i className="fas fa-envelope text-lg text-blue-300"></i>
                  <a 
                    href="mailto:roshankafle33@gmail.com" 
                    className="text-white hover:text-blue-200 transition-colors hover:underline drop-shadow-lg"
                  >
                    roshankafle33@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 hover:translate-x-1 transition-transform duration-300">
                  <i className="fas fa-phone text-lg text-green-300"></i>
                  <a 
                    href="tel:+9779806520880" 
                    className="text-white hover:text-green-200 transition-colors hover:underline drop-shadow-lg"
                  >
                    +977 9806520880
                  </a>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-white text-[hsl(76,44%,15%)] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                >
                  <i className="fab fa-github"></i>
                  <span>GitHub</span>
                </a>
                <a 
                  href="#" 
                  className="bg-[hsl(219,79%,36%)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                >
                  <i className="fab fa-linkedin"></i>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D5603AQE9XlaQy9wBiA/profile-displayphoto-shrink_400_400/B56ZSniMOEHwAk-/0/1737977546506?e=1756944000&v=beta&t=MVBs8BVjRq7SSKwB6nEpgQ3UCaybskyi6nVfLYIkuYg" 
                  alt="RoshanKafle_profile_picture" 
                  className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute -inset-1 rounded-2xl blur-sm opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <i className="fas fa-user-astronaut mr-3 text-accent"></i>
              About Me
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-emerald-custom/20 rounded-xl blur-lg opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Geospatial data analysis and satellite imagery" 
                className="rounded-xl shadow-lg w-full h-auto relative z-10 transform hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                <i className="fas fa-satellite mr-2 text-primary"></i>
                Geomatics Engineer with expertise in WebGIS, backend development, and Earth observation data processing. Passionate about integrating AI/ML in geospatial solutions for environmental monitoring and sustainable development.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <i className="fas fa-helicopter mr-2 text-accent"></i>
                I specialize in creating innovative solutions that bridge the gap between complex geospatial data and user-friendly web applications. My experience spans from real-time data visualization to advanced machine learning implementations in agriculture and environmental monitoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="text-primary font-medium relative z-10">
                    <i className="fas fa-globe mr-1"></i>
                    WebGIS Development
                  </span>
                </div>
                <div className="bg-accent/10 dark:bg-accent/20 px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="text-accent font-medium relative z-10">
                    <i className="fas fa-satellite-dish mr-1"></i>
                    Earth Observation
                  </span>
                </div>
                <div className="bg-emerald-custom/10 dark:bg-emerald-custom/20 px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="text-emerald-custom font-medium relative z-10">
                    <i className="fas fa-brain mr-1"></i>
                    AI/ML Integration
                  </span>
                </div>
                <div className="bg-purple-500/10 dark:bg-purple-500/20 px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="text-purple-600 dark:text-purple-400 font-medium relative z-10">
                    <i className="fas fa-helicopter mr-1"></i>
                    Drone Surveying
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <i className="fas fa-cogs mr-3 text-primary"></i>
              Technical Skills
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Programming */}
            <Card className="bg-card dark:bg-card p-6 rounded-xl shadow-md card-hover border border-border">
              <div className="flex items-center mb-4">
                <i className="fas fa-code text-2xl text-primary mr-3 floating-animation"></i>
                <h3 className="text-xl font-semibold text-card-foreground">Programming</h3>
              </div>
              <div className="space-y-2">
                {["Python", "Django", "FastAPI", "Flask", "JavaScript", "HTML", "CSS"].map((skill) => (
                  <span 
                    key={skill}
                    className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm mr-2 mb-2 skill-badge"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            
            {/* Geospatial Tools */}
            <Card className="bg-card dark:bg-card p-6 rounded-xl shadow-md card-hover border border-border">
              <div className="flex items-center mb-4">
                <i className="fas fa-globe text-2xl text-accent mr-3 floating-animation" style={{ animationDelay: '0.5s' }}></i>
                <h3 className="text-xl font-semibold text-card-foreground">Geospatial Tools</h3>
              </div>
              <div className="space-y-2">
                {["ArcGIS", "QGIS", "GeoServer", "PostGIS", "UAV", "SAR", "LiDAR"].map((skill) => (
                  <span 
                    key={skill}
                    className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm mr-2 mb-2 skill-badge"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            
            {/* Cloud */}
            <Card className="bg-card dark:bg-card p-6 rounded-xl shadow-md card-hover border border-border">
              <div className="flex items-center mb-4">
                <i className="fas fa-cloud text-2xl text-emerald-custom mr-3 floating-animation" style={{ animationDelay: '1s' }}></i>
                <h3 className="text-xl font-semibold text-card-foreground">Cloud</h3>
              </div>
              <div className="space-y-2">
                {["AWS EC2", "AWS ECS", "AWS S3", "AWS Lambda", "AWS RDS"].map((skill) => (
                  <span 
                    key={skill}
                    className="inline-block bg-emerald-custom text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 skill-badge"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            
            {/* Version Control */}
            <Card className="bg-card dark:bg-card p-6 rounded-xl shadow-md card-hover border border-border">
              <div className="flex items-center mb-4">
                <i className="fas fa-code-branch text-2xl text-earth-gray mr-3 floating-animation" style={{ animationDelay: '1.5s' }}></i>
                <h3 className="text-xl font-semibold text-card-foreground">Version Control</h3>
              </div>
              <div className="space-y-2">
                {["Git", "GitHub"].map((skill) => (
                  <span 
                    key={skill}
                    className="inline-block bg-earth-gray text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 skill-badge"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
            
            {/* AI/ML & Drone Technologies */}
            <Card className="bg-card dark:bg-card p-6 rounded-xl shadow-md card-hover border border-border lg:col-span-2 xl:col-span-1">
              <div className="flex items-center mb-4">
                <i className="fas fa-robot text-2xl text-purple-600 mr-3 floating-animation" style={{ animationDelay: '2s' }}></i>
                <h3 className="text-xl font-semibold text-card-foreground">AI/ML & Drones</h3>
              </div>
              <div className="space-y-2">
                {["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "UAV Photogrammetry", "Drone Mapping", "Computer Vision"].map((skill) => (
                  <span 
                    key={skill}
                    className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 skill-badge"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section id="experience" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <i className="fas fa-briefcase mr-3 text-primary"></i>
              Professional Experience
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>
          <div className="space-y-8">
            {/* Naxa GeoICT Company */}
            <div className="experience-card bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 p-8 rounded-xl border-l-4 border-primary card-hover relative">
              <div className="experience-tooltip">Click to expand details</div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <i className="fas fa-building mr-3 text-primary"></i>
                  Naxa GeoICT Company
                </h3>
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-calendar mr-1"></i>
                  2023 - Present
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                <i className="fas fa-map mr-2 text-accent"></i>
                WebGIS development, GeoServer tile services, AI-based classification on raster datasets.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-globe mr-1"></i>WebGIS
                </span>
                <span className="bg-emerald-custom/20 text-emerald-custom px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-server mr-1"></i>GeoServer
                </span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-brain mr-1"></i>AI Classification
                </span>
              </div>
            </div>

            {/* Geonadir Project */}
            <div className="experience-card bg-gradient-to-r from-accent/5 to-emerald-custom/5 dark:from-accent/10 dark:to-emerald-custom/10 p-8 rounded-xl border-l-4 border-accent card-hover relative">
              <div className="experience-tooltip">Real-time geospatial visualization project</div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <i className="fas fa-satellite-dish mr-3 text-accent"></i>
                  Geonadir Project
                </h3>
                <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-calendar mr-1"></i>
                  Dec 2023 - Present
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                <i className="fas fa-chart-line mr-2 text-emerald-custom"></i>
                Real-time COG visualization, WebSocket integration, DEM/DTM processing.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-eye mr-1"></i>Real-time Visualization
                </span>
                <span className="bg-emerald-custom/20 text-emerald-custom px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-plug mr-1"></i>WebSocket
                </span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-mountain mr-1"></i>DEM/DTM
                </span>
              </div>
            </div>

            {/* Khaderi-Alert */}
            <div className="experience-card bg-gradient-to-r from-emerald-custom/5 to-primary/5 dark:from-emerald-custom/10 dark:to-primary/10 p-8 rounded-xl border-l-4 border-emerald-custom card-hover relative">
              <div className="experience-tooltip">Environmental monitoring system</div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <i className="fas fa-exclamation-triangle mr-3 text-emerald-custom"></i>
                  Khaderi-Alert
                </h3>
                <span className="bg-emerald-custom text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-calendar mr-1"></i>
                  2023
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                <i className="fas fa-cloud-rain mr-2 text-primary"></i>
                Drought monitoring system using SPI & SPEI indices.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-thermometer-empty mr-1"></i>Drought Monitoring
                </span>
                <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-chart-bar mr-1"></i>SPI & SPEI
                </span>
              </div>
            </div>

            {/* Changu-Metric Addressing */}
            <div className="experience-card bg-gradient-to-r from-earth-gray/5 to-primary/5 dark:from-earth-gray/10 dark:to-primary/10 p-8 rounded-xl border-l-4 border-earth-gray card-hover relative">
              <div className="experience-tooltip">Digital addressing solution</div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground flex items-center">
                  <i className="fas fa-home mr-3 text-earth-gray"></i>
                  Changu-Metric Addressing
                </h3>
                <span className="bg-earth-gray text-white px-4 py-2 rounded-full text-sm font-medium">
                  <i className="fas fa-calendar mr-1"></i>
                  2023
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                <i className="fas fa-hashtag mr-2 text-accent"></i>
                Developed a digital house numbering system using Django and FastAPI.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fab fa-python mr-1"></i>Django
                </span>
                <span className="bg-emerald-custom/20 text-emerald-custom px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-rocket mr-1"></i>FastAPI
                </span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform duration-300">
                  <i className="fas fa-map-signs mr-1"></i>Digital Addressing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research & Projects Section */}
      <section id="projects" className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <i className="fas fa-rocket mr-3 text-emerald-custom"></i>
              Research & Projects
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Research Project */}
            <Card className="bg-card dark:bg-card p-8 rounded-xl shadow-lg card-hover border border-border">
              <div className="flex items-center mb-6">
                <i className="fas fa-seedling text-3xl text-emerald-custom mr-4 floating-animation"></i>
                <h3 className="text-2xl font-bold text-card-foreground">Precision Farming Research</h3>
              </div>
              <div className="relative mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Precision farming technology in agricultural field" 
                  className="rounded-lg w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-custom/20 to-transparent rounded-lg"></div>
              </div>
              <p className="text-muted-foreground mb-6">
                <i className="fas fa-leaf mr-2 text-emerald-custom"></i>
                Developed a deep learning model to classify nutrient levels in tomato leaves with a Flask web application interface.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-emerald-custom/20 text-emerald-custom px-3 py-1 rounded-full text-sm skill-badge">
                  <i className="fas fa-brain mr-1"></i>Deep Learning
                </span>
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm skill-badge">
                  <i className="fas fa-flask mr-1"></i>Flask
                </span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm skill-badge">
                  <i className="fas fa-tractor mr-1"></i>Agriculture
                </span>
                <span className="bg-earth-gray/20 text-earth-gray px-3 py-1 rounded-full text-sm skill-badge">
                  <i className="fas fa-eye mr-1"></i>Computer Vision
                </span>
              </div>
            </Card>

            {/* Featured Projects */}
            <div className="space-y-8">
              <Card className="bg-white p-6 rounded-xl shadow-md card-hover">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Changu-Metric Addressing</h4>
                <p className="text-gray-700 mb-4">
                  Digital house numbering system for efficient urban planning and logistics.
                </p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-[hsl(76,44%,15%)] font-semibold hover:text-[hsl(76,44%,25%)] transition-colors"
                >
                  <i className="fab fa-github mr-2"></i>
                  View on GitHub
                </a>
              </Card>

              <Card className="bg-white p-6 rounded-xl shadow-md card-hover">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Geonadir Platform</h4>
                <p className="text-gray-700 mb-4">
                  Real-time geospatial data visualization and analysis platform.
                </p>
                <a 
                  href="https://geonadir.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[hsl(219,79%,36%)] font-semibold hover:text-[hsl(219,79%,46%)] transition-colors"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Visit geonadir.com
                </a>
              </Card>

              {/* Achievements */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Achievements & Certifications</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <i className="fas fa-award text-yellow-500 mr-3 mt-1"></i>
                    Merit-based Scholarship for Bachelors in Geomatics Engineering
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-certificate text-blue-500 mr-3 mt-1"></i>
                    Trainings in GNSS, DGPS, LiDAR (University of Tokyo & CSSGS)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background dark:bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              <i className="fas fa-handshake mr-3 text-accent"></i>
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              <i className="fas fa-satellite mr-2 text-emerald-custom"></i>
              Ready to collaborate on innovative geospatial solutions? Let's discuss how we can work together.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center card-hover">
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 floating-animation">
                <i className="fas fa-envelope text-2xl text-primary"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <a 
                href="mailto:roshankafle33@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                roshankafle33@gmail.com
              </a>
            </div>
            <div className="text-center card-hover">
              <div className="bg-accent/10 dark:bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 floating-animation" style={{ animationDelay: '0.5s' }}>
                <i className="fas fa-phone text-2xl text-accent"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Phone</h3>
              <a 
                href="tel:+9779806520880" 
                className="text-muted-foreground hover:text-accent transition-colors hover:underline"
              >
                +977 9806520880
              </a>
            </div>
            <div className="text-center card-hover">
              <div className="bg-earth-gray/10 dark:bg-earth-gray/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 floating-animation" style={{ animationDelay: '1s' }}>
                <i className="fab fa-github text-2xl text-earth-gray"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">GitHub</h3>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-earth-gray transition-colors hover:underline"
              >
                View Projects
              </a>
            </div>
            <div className="text-center card-hover">
              <div className="bg-emerald-custom/10 dark:bg-emerald-custom/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 floating-animation" style={{ animationDelay: '1.5s' }}>
                <i className="fab fa-linkedin text-2xl text-emerald-custom"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">LinkedIn</h3>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-emerald-custom transition-colors hover:underline"
              >
                Connect
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 geospatial-grid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <i className="fas fa-globe-americas mr-3 text-accent floating-animation"></i>
              Roshan Kafle
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              <i className="fas fa-satellite-dish mr-2"></i>
              Geospatial Engineer | WebGIS & Backend Developer
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110">
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110">
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a href="mailto:roshankafle33@gmail.com" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110">
                <i className="fas fa-envelope text-2xl"></i>
              </a>
            </div>
            <div className="border-t border-primary-foreground/20 pt-6">
              <p className="text-primary-foreground/60 text-sm flex items-center justify-center">
                <i className="fas fa-map-pin mr-2"></i>
                © 2024 Roshan Kafle. All rights reserved. | Pokhara, Nepal
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
