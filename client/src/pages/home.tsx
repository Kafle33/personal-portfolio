import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { GeospatialPreloader } from "@/components/ui/geospatial-preloader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RoshanImg from "../assets/roshan.png"
import precision1 from '../assets/precision_agriculture1.png';
import precision2 from '../assets/precision_agriculture2.png';
import precision3 from '../assets/precision_agriculture3.png';
import khaderi1 from '../assets/khaderi_alert1.png';
import khaderi2 from '../assets/khaderi_alert2.png';
import khaderi3 from '../assets/khaderi_alert3.png';
import khaderi4 from '../assets/khaderi_alert4.png';
import heatmap from '../assets/heatmap.gif';
import magicWand from '../assets/magic_wand.gif';
import multispec from '../assets/multispec.jpeg';
import multispec2 from '../assets/multispec_2.gif';
import polygonSplits from '../assets/polygon_splits.gif';
import randomForest from '../assets/random_forest.gif';
import randomForestSanky from '../assets/random_forest_sanky.gif';
import rasterStats from '../assets/raster_stats.jpeg';
import rasterStats2 from '../assets/raster_stats2.jpeg';
import satelliteBandCombo from '../assets/satellite_band_combo.jpeg';
import terrain from '../assets/terrain.gif';
import vectorStats from '../assets/vector_stats.gif';
import volume from '../assets/volume.gif';

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    description: string;
    images: string[];
    details: string[];
    technologies: string[];
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const experiencesData = [
    {
      id: "naxa",
      title: "NAXA Pvt. Ltd.",
      period: "2023 - Present",
      description: "WebGIS Developer & Backend Engineer specializing in geospatial solutions, Earth observation data processing, and AI-driven analytics.",
      images: [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      ],
      details: [
        "Architected and deployed WebGIS applications using React, Django, and GeoServer for multi-client geospatial data platforms",
        "Developed Docker-based microservices for Earth observation data processing, integrating Sentinel-2 and UAV imagery pipelines",
        "Implemented GeoAI solutions for automated land classification using Random Forest and pixel-based analysis on raster datasets",
        "Optimized PostGIS spatial queries and GeoServer tile services, reducing response times by 60% for large-scale datasets",
        "Collaborated on international projects including HOT's FMTM and digital addressing initiatives across Nepal"
      ],
      technologies: ["WebGIS", "Django", "FastAPI", "GeoServer", "PostGIS", "Docker", "AWS", "GeoAI", "React"]
    },
    {
      id: "geonadir",
      title: "GeoNadir",
      period: "Dec 2023 - Present",
      description: "International Earth Observation Platform - Backend Developer for real-time geospatial data processing and visualization.",
      images: [
        randomForest,
        randomForestSanky,
        volume,
        heatmap,
        terrain,
        magicWand,
        multispec,
        multispec2,
        polygonSplits,
        rasterStats,
        rasterStats2,
        satelliteBandCombo,
        vectorStats,
      ],
      details: [
        "Built high-performance backend for Cloud Optimized GeoTIFF (COG) processing and real-time visualization using FastAPI and AWS S3",
        "Integrated WebSocket infrastructure for live UAV data streaming and terrain model updates across distributed clients",
        "Developed DEM/DTM processing pipeline with GDAL for slope analysis, hillshade generation, and 3D terrain rendering",
        "Implemented Celery-based task queue for asynchronous processing of large-scale satellite and drone imagery",
        "Collaborated with international team on Copernicus data integration and multi-spectral analysis workflows"
      ],
      technologies: ["FastAPI", "WebSocket", "COG", "AWS S3", "Docker", "GDAL", "Celery", "DEM/DTM", "UAV Processing"]
    }
  ];

  const projectsData = [
    {
      id: "precision-farming",
      title: "Precision Agriculture AI (Tomato Nutrient Classification)",
      description: "Deep learning-based nutrient deficiency detection system achieving 92% accuracy, enabling data-driven fertilizer management for farmers.",
      images: [
        precision1,
        precision2,
        precision3
      ],
      details: [
        "Developed CNN-based deep learning model achieving 92% accuracy in classifying nitrogen, phosphorus, and potassium deficiencies in tomato leaves",
        "Curated and annotated custom dataset of 2000+ tomato leaf images representing various nutrient stress conditions",
        "Built production-ready Flask web application with Docker deployment for real-time image classification",
        "Implemented fertilizer recommendation engine with dosage calculations based on deficiency severity",
        "Reduced fertilizer waste by 30% through targeted nutrient management in pilot farms"
      ],
      technologies: ["TensorFlow", "CNN", "Flask", "Docker", "Computer Vision", "OpenCV", "NumPy"]
    },
    {
      id: "khaderi-alert",
      title: "Khaderi-Alert (Drought Monitoring System)",
      description: "Automated drought early warning system using SPI and SPEI indices for agricultural risk assessment across Nepal.",
      images: [
        khaderi1,
        khaderi2,
        khaderi3,
        khaderi4
      ],
      details: [
        "Developed automated drought monitoring system processing 20+ years of precipitation and evapotranspiration data",
        "Implemented Standardized Precipitation Index (SPI) and SPEI calculations using Python and GeoPandas for district-level analysis",
        "Built WebGIS dashboard with interactive maps showing drought severity classifications across agricultural zones",
        "Integrated automated alert system for stakeholders when drought thresholds are exceeded",
        "Deployed on AWS with PostGIS database for temporal-spatial drought pattern analysis"
      ],
      technologies: ["Python", "GeoPandas", "PostGIS", "Django", "Leaflet", "AWS", "Time-Series Analysis"]
    },
    {
      id: "dmaps",
      title: "DMAPS (AI & Urban Planning Analyst)",
      description: "Geospatial AI platform for urban analytics using machine learning on satellite imagery and cadastral data.",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1573164574472-797cdf4a583a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      ],
      details: [
        "Developed AI-powered urban planning analysis tool integrating Sentinel-2 satellite imagery with municipal cadastral data",
        "Implemented Random Forest classifier for automated land use classification achieving 87% accuracy across 8 urban categories",
        "Built FastAPI backend processing 50+ GB of raster data using GDAL and distributed computing with Celery",
        "Created interactive WebGIS interface for urban planners to visualize growth patterns and infrastructure gaps",
        "Contributed to evidence-based urban policy decisions for 5+ municipalities in Nepal"
      ],
      technologies: ["GeoAI", "Random Forest", "Sentinel-2", "FastAPI", "GDAL", "PostGIS", "React", "Celery"]
    },
    {
      id: "fmtm-hotosm",
      title: "FMTM - Field Mapping Tasking Manager (HOT)",
      description: "Contribution to Humanitarian OpenStreetMap Team's field mapping coordination platform for disaster response and development.",
      images: [
        "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      ],
      details: [
        "Contributed to HOT's open-source FMTM project for coordinating field data collection across multiple mappers",
        "Developed backend features for task assignment, validation workflows, and data sync with OpenStreetMap using FastAPI",
        "Implemented offline-first mobile data collection integration with ODK (Open Data Kit) forms",
        "Optimized PostGIS queries for spatial task grid generation reducing API response time by 40%",
        "Collaborated with international contributors on GitHub, participating in code reviews and documentation"
      ],
      technologies: ["FastAPI", "PostGIS", "OpenStreetMap", "ODK", "Docker", "PostgreSQL", "Python"]
    },

  ];

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

  useEffect(() => {
    if (selectedItem) {
      setCurrentImageIndex(0);
    }
  }, [selectedItem]);

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
                  className={`transition-all duration-300 hover:scale-105 ${activeSection === item.id
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
                    className={`text-left py-2 transition-all duration-300 hover:scale-105 ${activeSection === item.id
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
                  href="https://github.com/Kafle33"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[hsl(76,44%,15%)] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                  data-testid="link-github-hero"
                >
                  <i className="fab fa-github"></i>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/roshan-kafle-908101277/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[hsl(219,79%,36%)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                  data-testid="link-linkedin-hero"
                >
                  <i className="fab fa-linkedin"></i>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src={RoshanImg}
                  alt="GIS mapping and technology visualization"
                  className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -inset-1 rounded-2xl"></div>
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
              <img
                src={RoshanImg}
                alt="Geospatial data analysis and satellite imagery"
                className="rounded-xl shadow-lg w-full h-auto relative z-10 transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                <i className="fas fa-satellite mr-2 text-primary"></i>
                WebGIS and Backend Engineer specializing in scalable geospatial platforms, Earth observation data processing, and GeoAI solutions. Expert in integrating UAV imagery with Sentinel satellite data Fusion for multi-source Earth observation analytics and environmental monitoring.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <i className="fas fa-code mr-2 text-accent"></i>
                I architect production-ready backends using Django, FastAPI, and Docker, deploying on AWS infrastructure with PostGIS spatial databases and GeoServer tile services. My work spans international collaborations including HOT's humanitarian mapping platform (FMTM) and Copernicus Earth observation data integration with GeoNadir's real-time processing pipelines.
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
            {experiencesData.map((exp, index) => {
              const borderColors = ['border-primary', 'border-accent', 'border-emerald-custom', 'border-earth-gray'];
              const gradientColors = [
                'from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10',
                'from-accent/5 to-emerald-custom/5 dark:from-accent/10 dark:to-emerald-custom/10',
                'from-emerald-custom/5 to-primary/5 dark:from-emerald-custom/10 dark:to-primary/10',
                'from-earth-gray/5 to-primary/5 dark:from-earth-gray/10 dark:to-primary/10'
              ];
              const icons = ['fa-building', 'fa-satellite-dish', 'fa-exclamation-triangle', 'fa-home'];
              const iconColors = ['text-primary', 'text-accent', 'text-emerald-custom', 'text-earth-gray'];

              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedItem(exp)}
                  className="group cursor-pointer bg-card dark:bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row"
                  data-testid={`card-experience-${exp.id}`}
                >
                  {/* Thumbnail Section */}
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-muted/30">
                    <img
                      src={exp.images[0]}
                      alt={exp.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>

                    {/* Gallery Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/20">
                      <i className="fas fa-images"></i>
                      <span>{exp.images.length}</span>
                    </div>

                    {/* WebGIS Icon Overlay */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <i className={`fas ${icons[index]} ${iconColors[index]} text-lg`}></i>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative">
                    {/* Hover Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <i className="fas fa-external-link-alt text-primary"></i>
                    </div>

                    <div className="mb-1">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {exp.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
                        <span className="font-semibold text-muted-foreground">{exp.id === 'naxa' ? 'WebGIS Developer' : exp.id === 'geonadir' ? 'Backend Developer' : 'Role'}</span>
                        <span className="hidden sm:inline text-border">•</span>
                        <span className="text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded text-xs">
                          <i className="fas fa-calendar-alt mr-1.5 opacity-70"></i>
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-3 mb-4 line-clamp-2 text-sm md:text-base leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {exp.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/5 text-primary border border-primary/10 group-hover:border-primary/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 4 && (
                        <span className="px-2 py-1 rounded-md text-xs text-muted-foreground bg-secondary/50">
                          +{exp.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            {/* Main Project Cards */}
            {projectsData.map((project, index) => {
              const icons = ['fa-seedling', 'fa-map-signs', 'fa-globe', 'fa-map', 'fa-city'];
              const iconColors = ['text-emerald-custom', 'text-primary', 'text-accent', 'text-orange-500', 'text-blue-500'];

              return (
                <Card
                  key={project.id}
                  onClick={() => setSelectedItem(project)}
                  className="group bg-card dark:bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="relative h-48 overflow-hidden bg-muted/30">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>

                    {/* Gallery Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/20">
                      <i className="fas fa-images"></i>
                      <span>{project.images.length}</span>
                    </div>

                    {/* Project Icon Overlay */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <i className={`fas ${icons[index % icons.length]} ${iconColors[index % iconColors.length]} text-lg`}></i>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col relative">
                    {/* Hover Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <i className="fas fa-external-link-alt text-primary"></i>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.slice(0, 4).map((tech, i) => {
                        const colors = [
                          'bg-emerald-custom/10 text-emerald-custom border-emerald-custom/20',
                          'bg-accent/10 text-accent border-accent/20',
                          'bg-primary/10 text-primary border-primary/20',
                          'bg-earth-gray/10 text-earth-gray border-earth-gray/20'
                        ];
                        return (
                          <span key={i} className={`${colors[i % 4]} px-2.5 py-1 rounded-md text-xs font-medium border transition-colors`}>
                            {tech}
                          </span>
                        );
                      })}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 rounded-md text-xs text-muted-foreground bg-secondary/50">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Achievements */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400 h-fit">
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
                href="https://github.com/Kafle33"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-earth-gray transition-colors hover:underline"
                data-testid="link-github-contact"
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
                href="https://www.linkedin.com/in/roshan-kafle-908101277/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-emerald-custom transition-colors hover:underline"
                data-testid="link-linkedin-contact"
              >
                Connect
              </a>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-primary text-primary-foreground py-12 geospatial-grid" >
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
              <a href="https://github.com/Kafle33" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110" data-testid="link-github-footer">
                <i className="fab fa-github text-2xl"></i>
              </a>
              <a href="https://www.linkedin.com/in/roshan-kafle-908101277/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110" data-testid="link-linkedin-footer">
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a href="mailto:roshankafle33@gmail.com" className="text-primary-foreground/60 hover:text-white transition-all duration-300 transform hover:scale-110" data-testid="link-email-footer">
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
      </footer >

      {/* Details Dialog */}
      <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0 bg-card border-border">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center">
              <i className="fas fa-info-circle mr-3 text-primary"></i>
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6 pt-2">
            {/* Image Carousel */}
            <div className="relative rounded-xl overflow-hidden group bg-black/5 dark:bg-black/20 border border-border/50 aspect-video flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={selectedItem?.images[currentImageIndex]}
                  alt={`${selectedItem?.title} - Image ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {selectedItem && selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) =>
                      prev === 0 ? selectedItem.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground text-foreground p-3 rounded-full transition-all duration-300 shadow-lg border border-border/50 group-hover:opacity-100 opacity-0 translate-x-[-10px] group-hover:translate-x-0"
                    data-testid="button-prev-image"
                  >
                    <i className="fas fa-chevron-left text-lg"></i>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) =>
                      prev === selectedItem.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground text-foreground p-3 rounded-full transition-all duration-300 shadow-lg border border-border/50 group-hover:opacity-100 opacity-0 translate-x-[10px] group-hover:translate-x-0"
                    data-testid="button-next-image"
                  >
                    <i className="fas fa-chevron-right text-lg"></i>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium text-white border border-white/10 shadow-lg">
                    <i className="fas fa-images mr-2 text-primary"></i>
                    {currentImageIndex + 1} / {selectedItem.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {selectedItem && selectedItem.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide justify-center">
                {selectedItem.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-muted/30 relative ${idx === currentImageIndex
                      ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-md'
                      : 'border-transparent hover:border-primary/50 opacity-70 hover:opacity-100'
                      }`}
                    data-testid={`thumbnail-${idx}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentImageIndex && (
                      <div className="absolute inset-0 bg-primary/10"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8 mt-6">
              <div className="md:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <i className="fas fa-align-left mr-2 text-primary"></i>
                    Overview
                  </h3>
                  <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                    {selectedItem?.description}
                  </DialogDescription>
                </div>

                {/* Detailed Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <i className="fas fa-list-ul mr-2 text-accent"></i>
                    Key Highlights
                  </h3>
                  <ul className="space-y-3">
                    {selectedItem?.details.map((detail, index) => (
                      <li key={index} className="flex items-start text-muted-foreground group">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-custom mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                {/* Technologies Used */}
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <i className="fas fa-tools mr-2 text-primary"></i>
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem?.technologies.map((tech, index) => {
                      const colors = [
                        'bg-primary/10 text-primary border-primary/20',
                        'bg-accent/10 text-accent border-accent/20',
                        'bg-emerald-custom/10 text-emerald-custom border-emerald-custom/20',
                        'bg-purple-600/10 text-purple-600 border-purple-600/20',
                        'bg-earth-gray/10 text-earth-gray border-earth-gray/20'
                      ];
                      return (
                        <span
                          key={index}
                          className={`${colors[index % colors.length]} px-3 py-1.5 rounded-md text-xs font-medium border transition-all hover:scale-105 cursor-default`}
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
