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
import CV from '../assets/CV.pdf';
import dmsps1 from '../assets/dmaps1.png';
import dmaps2 from '../assets/dmaps2.png';
import dmaps3 from '../assets/dmaps3.png';
import naxa1 from '../assets/naxa1.png';
import naxa2 from '../assets/naxa2.png';
import naxa3 from '../assets/naxa3.png';
import hot1 from '../assets/hot1.png';
import hot2 from '../assets/hot2.png';

// Certificate imports - Online Courses
import eoUrbanC from '../assets/eo_college_urban_spaces.png';
import eoMlC from '../assets/eo_college_ml_eo.png';
import udemyAiC from '../assets/udemy_ai_gee.png';
import udemyDlC from '../assets/udemy_deep_learning_eo.png';
import esriSarC from '../assets/esri_sar_notebooks.png';
import esriMultiC from '../assets/esri_multidimensional_data.png';
import esriDlC from '../assets/esri_deep_learning_pro.png';

// Certificate imports - Workshops & Seminars
import campus_3d_modelling from '../assets/3d_modelling.png';
import geodataScoutC from '../assets/geodata_scout_appreciation.png';
import mathathonC from '../assets/hackathon_field_mapping.png';
import gnssC from '../assets/gnss_training.png';
import ngesC from '../assets/nges_membership.png';

export interface PortfolioItem {
    id: string;
    title: string;
    period?: string;
    link?: string;
    description: string;
    images: string[];
    details: string[];
    technologies: string[];
}

export const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" }
];

export const experiencesData: PortfolioItem[] = [
    {
        id: "naxa",
        title: "NAXA Pvt. Ltd.",
        period: "May 2023 - Dec 2023",
        link: "https://naxa.com.np",
        description: "WebGIS Developer & Backend Engineer specializing in geospatial solutions, Earth observation data processing, and AI-driven analytics.",
        images: [naxa1, naxa3, naxa2],
        details: [
            "Khaderi-Alert (Drought Monitoring System): Integrated multi-source Earth Observation and meteorological data for real-time drought modeling; developed modular systems for drought severity assessment, hotspot mapping, and risk ranking; created interactive Web-GIS platform with real-time alerts.",
            "AI & Urban Planning Analyst – DMAPS: Used AI and EO data to digitize urban landscapes and generate spatial models; engineered backend systems using PostGIS and GIST indexing; developed geospatial tools for sustainable urban planning including Janakpur (8,932 buildings) and Bheemdatta (36,139 buildings).",
            "FMTM-HOTSOM (Open Source Contribution): Integrated geospatial data using Python and PostGIS; collaborated with international teams to improve system usability, reliability, and scalability for urban and disaster mapping.",
            "Website: https://naxa.com.np"
        ],
        technologies: ["WebGIS", "Django", "FastAPI", "GeoServer", "PostGIS", "Docker", "AWS", "GeoAI", "React"]
    },
    {
        id: "geonadir",
        title: "GeoNadir – Queensland, Australia",
        period: "1 Jan 2024 – Current",
        link: "https://geonadir.com/",
        description: "Integrated Copernicus satellite data in GeoNadir’s drone mapping platform for a globally accessible EO system.",
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
            "Applied AI-based classification using Object-Based and Pixel-Based Image Analysis for precise land cover mapping.",
            "Developed features using zero-shot image segmentation (Segment Anything Model & Grounding DINO) to digitize features.",
            "Predicted feature density in Sentinel-2 imagery using heatmaps and linear regression.",
            "Performed geospatial processing and analysis on AWS (S3, EC2, Lambda, RDS) ensuring scalability and secure data handling.",
            "Supported FAIR data mission by enabling scalable, interoperable drone-to-satellite datasets with open access and reproducible pipelines.",
            "Website: https://geonadir.com/"
        ],
        technologies: ["FastAPI", "WebSocket", "COG", "AWS S3", "Docker", "GDAL", "Celery", "DEM/DTM", "UAV Processing"]
    }
];

export const projectsData: PortfolioItem[] = [
    {
        id: "precision-farming",
        title: "Precision Agriculture",
        period: "1 May 2022 – 3 Apr 2023",
        link: "https://github.com/Kafle33/fastapi-tomato-classifier",
        description: "Developed an image classification model using TensorFlow and MobileNetV2 to detect nutrient deficiencies in tomato leaves, trained with 1,500+ labeled images.",
        images: [precision1, precision2, precision3],
        details: [
            "Used transfer learning, CNNs, and dropout layers to enhance model performance and reduce overfitting.",
            "Model deployed for real-world smart agriculture applications.",
            "GitHub link: https://github.com/Kafle33/fastapi-tomato-classifier"
        ],
        technologies: ["TensorFlow", "CNN", "Flask", "Docker", "Computer Vision", "OpenCV", "NumPy"]
    },
    {
        id: "khaderi-alert",
        title: "Khaderi-Alert (Drought Monitoring System)",
        link: "https://khaderi.anticipatoryaction.org/",
        description: "Integrated multi-source Earth Observation and meteorological data for real-time drought modeling; developed modular systems for drought severity assessment, hotspot mapping, and risk ranking.",
        images: [khaderi1, khaderi2, khaderi3, khaderi4],
        details: [
            "Integrated multi-source Earth Observation and meteorological data for real-time drought modeling.",
            "Developed modular systems for drought severity assessment, hotspot mapping, and risk ranking.",
            "Created interactive Web-GIS platform with real-time alerts.",
            "Website: https://khaderi.anticipatoryaction.org/"
        ],
        technologies: ["Python", "GeoPandas", "PostGIS", "Django", "Leaflet", "AWS", "Time-Series Analysis"]
    },
    {
        id: "dmaps",
        title: "DMAPS (AI & Urban Planning Analyst)",
        link: "https://dmaps.org/",
        description: "Used AI and EO data to digitize urban landscapes and generate spatial models; engineered backend systems using PostGIS and GIST indexing.",
        images: [dmsps1, dmaps2, dmaps3],
        details: [
            "Used AI and EO data to digitize urban landscapes and generate spatial models.",
            "Engineered backend systems using PostGIS and GIST indexing.",
            "Developed geospatial tools for sustainable urban planning including Janakpur (8,932 buildings) and Bheemdatta (36,139 buildings).",
            "Website: https://dmaps.org/"
        ],
        technologies: ["GeoAI", "Random Forest", "Sentinel-2", "FastAPI", "GDAL", "PostGIS", "React", "Celery"]
    },
    {
        id: "fmtm-hotosm",
        title: "FMTM-HOTSOM (Open Source Contribution)",
        link: "https://fmtm.hotosm.org/",
        description: "Integrated geospatial data using Python and PostGIS; collaborated with international teams to improve system usability, reliability, and scalability.",
        images: [hot1, hot2],
        details: [
            "Integrated geospatial data using Python and PostGIS.",
            "Collaborated with international teams to improve system usability, reliability, and scalability for urban and disaster mapping.",
            "Website: https://fmtm.hotosm.org/"
        ],
        technologies: ["FastAPI", "PostGIS", "OpenStreetMap", "ODK", "Docker", "PostgreSQL", "Python"]
    }
];

export const certificationCategories: PortfolioItem[] = [
    {
        id: 'online-courses',
        title: 'Online Courses',
        description: 'Esri, Udemy, EO and AI Certifications',
        images: [udemyAiC, udemyDlC, esriSarC, esriMultiC, esriDlC, eoUrbanC, eoMlC],
        details: [
            'Automated Sentinel-1 SAR workflows in ArcGIS Notebooks using Python for preprocessing, filtering, and feature extraction.',
            'Used deep learning methods in ArcGIS Pro for object detection and image classification with CNN and transfer learning.',
            'Did predictive modeling and spatiotemporal trend analysis of raster data in ArcGIS Online using harmonic regression and Mann-Kendall trend model.',
            'Completed Udemy courses on Deep Learning Applications for Earth Observation and Mastering Earth Observation with AI and Google Earth Engine, focused on AI-based EO analysis and Google Earth Engine automation.'
        ],
        technologies: ['Deep Learning', 'AI', 'Google Earth Engine', 'ArcGIS Pro', 'SAR', 'Python']
    },
    {
        id: 'workshops',
        title: 'Workshops & Seminars',
        description: 'Attended workshops on advanced surveying techniques and participated in technical seminars and hackathons on GeoAI and Earth observation.',
        images: [geodataScoutC, campus_3d_modelling, mathathonC, gnssC, ngesC],
        details: [
            'Practical training on Differential GPS (DGPS) and Terrestrial LiDAR Scanner for high-resolution terrain mapping and accurate surveying.',
            'Collected, processed, and interpreted data using DGPS receiver, LiDAR scanner, and point cloud processing software for 3D model creation.',
            'Improved skills in using DGPS and LiDAR workflow for field geomatics work and spatial data analysis.',
            'Learned principles of GNSS, satellite constellations (GPS, GLONASS, Galileo, BeiDou, QZSS, IRNSS), positioning methods (Absolute, DGNSS, RTK, PPP), and error mitigation techniques.',
            'Field data collection with GNSS receivers, post-processing workflows, accuracy assessment, and integration with GIS, remote sensing, and geodetic reference frames (ITRF, WGS84).',
            'Emerging trends: multi-frequency and multi-constellation systems, GNSS–IMU integration, and applications in autonomous systems, precision mapping, and disaster management.'
        ],
        technologies: ['GNSS', 'Field Mapping', 'GeoAI', 'Surveying', 'OpenStreetMap']
    }
];

export const skillsData = [
    {
        category: "Programming",
        icon: "fa-code",
        color: "text-primary",
        skills: ["Python", "Django", "FastAPI", "Flask", "JavaScript", "React"]
    },
    {
        category: "Geospatial Tools",
        icon: "fa-globe",
        color: "text-accent",
        skills: ["ArcGIS", "QGIS", "GeoServer", "PostGIS", "UAV", "SAR"]
    },
    {
        category: "Cloud & DevOps",
        icon: "fa-cloud",
        color: "text-emerald-custom",
        skills: ["AWS S3", "AWS EC2", "Docker", "PostgreSQL", "Git", "GitHub"]
    },
    {
        category: "AI/ML",
        icon: "fa-brain",
        color: "text-purple-600",
        skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "CNN", "LiDAR"]
    },
    {
        category: "Drone & Mapping",
        icon: "fa-helicopter",
        color: "text-earth-gray",
        skills: ["Photogrammetry", "DEM/DTM", "Drone Mapping", "GDAL", "ODM", "WebGIS"]
    }
];

export const personalInfo = {
    name: "Roshan Kafle",
    role: ["Geospatial Engineer", "WebGIS & Backend Developer"],
    location: "Pokhara, Gandaki, Nepal",
    coordinates: "28.2096°N, 83.9856°E",
    email: "roshankafle33@gmail.com",
    phone: "+977 9766453290",
    github: "https://github.com/Kafle33",
    linkedin: "https://www.linkedin.com/in/roshan-kafle-908101277/",
    researchgate: "https://www.researchgate.net/profile/Roshan-Kafle-2",
    cv: CV,
    profileImg: RoshanImg
};
