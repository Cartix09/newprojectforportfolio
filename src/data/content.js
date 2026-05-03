// All editable portfolio content lives here.
// Update names, copy, projects, links — no HTML changes needed.

export const profile = {
  name: 'Mursal Hajiyev',
  tagline: 'Data Analyst · AI & Digital Product Builder',
  intro:
    'I build data projects, websites, and startup tools that help turn rough ideas into something people can actually use.',
  location: 'Warsaw · Remote',
  status: 'Open to data, AI, web, and product opportunities',
};

export const links = {
  github: 'https://github.com/Cartix09',
  email: 'mailto:mursalhaciyev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mursal-haciyev/',
};

export const about = [
  'I am a Data Analyst and digital product builder, currently finishing a Master’s in Advanced Analytics — Big Data at SGH Warsaw School of Economics.',
  'My day-to-day moves between three things: working with data (analysis, machine learning, computer vision), building on the web (WordPress, WooCommerce, custom front-ends, e-commerce analytics), and helping early-stage product or startup ideas turn into something concrete.',
  'I like projects where the goal is not just a model or a page, but a clearer answer — something a business, a team, or a user can act on. I’m comfortable jumping between Python, R, SQL, dashboards, web tools, and the messy bits in between.',
  'Right now I’m focused on combining analytics with product thinking, especially around startup, e-commerce, and digital platform work.',
];

export const projects = [
  {
    id: 'yolo-poker-card-detection',
    name: 'YOLOv8 Poker Card Detection System',
    type: 'Computer Vision',
    summary:
      'Computer vision system for detecting and classifying poker cards in images and live webcam footage. Uses YOLOv8 for object detection and supports annotation visualisation, training, prediction testing, ground-truth comparison, and real-time webcam detection.',
    role:
      'Built the detection pipeline, trained and evaluated the YOLOv8 model, tested predictions against ground truth, and prepared the live detection workflow for academic presentation.',
    tags: ['Computer Vision', 'YOLOv8', 'Python', 'OpenCV', 'PyTorch', 'Real-time Detection'],
    accent: '#5eead4',
    year: '2025',
  },
  {
    id: 'magnexus',
    name: 'MagNexus — Global Trade & Investment Platform',
    type: 'Trade & Investment',
    summary:
      'Digital and business platform focused on global trade, energy, and strategic investment. MagNexus positions itself as a bridge between industries, markets, and innovation — built around international commerce and long-term opportunity building.',
    role:
      'Worked on digital presence, website and product direction, brand positioning, and business communication for a trade and investment-focused platform.',
    tags: ['Global Trade', 'Investment', 'Energy', 'Web', 'Business Strategy', 'Digital Platform'],
    accent: '#fbbf24',
    year: '2025–Present',
    url: 'https://magnexus.pl/',
  },
  {
    id: 'theqloud-analytics',
    name: 'TheQloud — E-commerce Analytics & UX Optimization',
    type: 'E-commerce Analytics',
    summary:
      'E-commerce optimization project on WordPress + WooCommerce: Elementor, custom CSS, multilingual setup, search/product page improvements, and mobile UX fixes. Focused on using user behaviour insights to improve the customer journey.',
    role:
      'Web Developer, IT Consultant, and Web Analyst. Analysed user behaviour, fixed mobile and layout issues, monitored performance, and translated analytics findings into concrete site changes.',
    tags: ['Web Analytics', 'WooCommerce', 'WordPress', 'Elementor', 'UX', 'Conversion Optimization'],
    accent: '#34d399',
    year: '2025–Present',
  },
  {
    id: 'ecovoltcharge',
    name: 'EcoVoltCharge — Startup Platform Development',
    type: 'Startup Platform',
    summary:
      'Startup project around scalable EV charging infrastructure — modular charging units, solar integration, and the digital platforms needed for future mobility services.',
    role:
      'Led technical direction across website, mobile app, and internal tooling. Coordinated developers, analysts, and UI/UX work, and connected technical decisions with product and business needs.',
    tags: ['Startup', 'EV Charging', 'Product Development', 'Team Leadership', 'Sustainability', 'Platform'],
    accent: '#22d3ee',
    year: '2024–2025',
  },
  {
    id: 'ev-charging-warsaw-simulation',
    name: 'EV Charging Demand & Warsaw Simulation',
    type: 'Data Simulation',
    summary:
      'Data-driven study tied to EcoVoltCharge: explores EV charging infrastructure needs, service coverage, and business feasibility in Warsaw. Combines mobility logic, demand assumptions, and digital product thinking.',
    role:
      'Defined the project, structured the analytical workflow, set assumptions, and connected data analysis with infrastructure and product decisions.',
    tags: ['Data Analysis', 'Simulation', 'EV Charging', 'Mobility', 'Business Analytics', 'Python'],
    accent: '#60a5fa',
    year: '2025',
  },
  {
    id: 'llm-synthetic-data',
    name: 'LLM-Generated Synthetic Data for Classification',
    type: 'ML Research',
    summary:
      'Research-oriented ML project exploring how synthetic data generated by large language models affects classification performance, class imbalance, and model interpretability.',
    role:
      'Designed the research direction across real, synthetic, and combined datasets. Focused on accuracy, F1, AUC, class balance, and trade-offs against classical augmentation methods like SMOTE.',
    tags: ['Machine Learning', 'Synthetic Data', 'LLMs', 'Classification', 'F1 Score', 'AUC'],
    accent: '#facc15',
    year: '2025–2026',
  },
  {
    id: 'retail-bank-segmentation',
    name: 'Retail Bank Customer Segmentation',
    type: 'Business Analytics',
    summary:
      'Business analytics project segmenting retail bank customers using exploratory analysis, feature engineering, and clustering methods such as K-means.',
    role:
      'Prepared the analytical dataset, explored customer patterns, engineered useful variables, tested clustering logic, and translated segments into business recommendations.',
    tags: ['Customer Segmentation', 'K-means', 'R', 'EDA', 'Feature Engineering', 'Business Analytics'],
    accent: '#a78bfa',
    year: '2025',
  },
  {
    id: 'missing-data-imputation',
    name: 'Missing Data Imputation & Treatment Effect Analysis',
    type: 'Statistical Analysis',
    summary:
      'Statistical analysis project evaluating missing data mechanisms and estimating treatment effects using ANCOVA, MAR/MNAR assumptions, and multiple imputation methods.',
    role:
      'Analysed missing data patterns, tested assumptions, implemented imputation workflows, compared models, and prepared interpretation under different missing-data scenarios.',
    tags: ['Missing Data', 'Multiple Imputation', 'ANCOVA', 'R', 'SAS', 'Statistical Modelling'],
    accent: '#fb7185',
    year: '2025',
  },
  {
    id: 'bizim-sklep',
    name: 'Bizim.pl — E-commerce Launch & Data Support',
    type: 'E-commerce Project',
    summary:
      'Client e-commerce project covering website launch, project coordination, payment functionality, customer data analysis, data cleaning, and post-launch improvements.',
    role:
      'Coordinated the launch, communicated with the client, supported data quality work, and helped translate business needs into platform features.',
    tags: ['E-commerce', 'Project Management', 'Data Cleaning', 'Client Work', 'UX', 'Reporting Logic'],
    accent: '#f472b6',
    year: '2023–2024',
  },
];

export const experience = [
  {
    role: 'Web Developer',
    company: 'TheQloud.pl',
    period: '04/2025 – Present',
    points: [
      'Redesigned and optimized an e-commerce platform with a focus on speed, mobile usability, and customer journey improvements.',
      'Analysed user behaviour, funnels, traffic, and bottlenecks, turning analytics findings into UX and conversion improvements.',
      'Worked with WordPress, WooCommerce, Elementor, custom CSS, multilingual setup, search/product pages, and mobile layout fixes.',
      'Monitored site performance and translated business needs into concrete digital improvements.',
    ],
  },
  {
    role: 'CTO',
    company: 'EcoVoltCharge',
    period: '10/2024 – 10/2025',
    points: [
      'Led the technical direction for the startup platform across website, mobile app, and internal tooling.',
      'Coordinated developers, analysts, and UI/UX work to keep product execution aligned and on schedule.',
      'Supported website and mobile app development direction connected to EV charging services.',
      'Built up analytics and monitoring processes used for internal decision-making and performance tracking.',
      'Connected technical decisions with product and business needs across an early-stage startup.',
    ],
  },
  {
    role: 'Project Management Intern',
    company: 'Bizim Sklep / Bizim.pl',
    period: '10/2023 – 02/2024',
    points: [
      'Coordinated the launch of Bizim.pl end-to-end, aligning website scope with business goals and client expectations.',
      'Analysed customer and platform data to support design, functionality, and reporting decisions.',
      'Maintained and cleaned datasets used for business analysis, improving data quality and reliability.',
      'Worked directly with stakeholders to translate business needs into platform features and e-commerce functionality.',
      'Supported payment integration, transaction flow improvements, and post-launch website updates.',
    ],
  },
  {
    role: 'Vice President',
    company: 'Kozminski Data Science Club',
    period: '10/2023 – 06/2024',
    points: [
      'Led student initiatives and helped organize events on data science, analytics, and business applications.',
      'Connected data-science topics with practical business use cases.',
      'Supported collaboration between students working on learning sessions, events, and technical discussions.',
    ],
  },
  {
    role: 'Student Ambassador',
    company: 'Kozminski University',
    period: '02/2023 – 07/2023',
    points: [
      'Supported prospective students through the application process and helped explain university programmes clearly.',
      'Assisted with Open Days, webinars, and on-campus events.',
      'Built communication, presentation, and stakeholder-facing experience through regular contact with students and staff.',
    ],
  },
];

export const skillGroups = [
  {
    title: 'Data & AI',
    items: [
      'Python', 'SQL', 'R', 'Machine Learning', 'Computer Vision', 'YOLOv8',
      'Data Analysis', 'Data Cleaning', 'Data Preparation',
      'Statistical Analysis', 'Predictive Modelling', 'Data Visualization',
    ],
  },
  {
    title: 'Analytics & BI',
    items: [
      'KPI Definition', 'Reporting Logic', 'Dashboard Thinking',
      'Power BI', 'Excel', 'User Behaviour Analysis',
      'Funnel Analysis', 'Metric Tracking', 'Business Analytics',
    ],
  },
  {
    title: 'Web & Digital Tools',
    items: [
      'HTML', 'CSS', 'JavaScript', 'Git',
      'WordPress', 'WooCommerce', 'Elementor',
      'Website Optimization', 'UX Improvements', 'E-commerce Platforms',
    ],
  },
  {
    title: 'Business & Product',
    items: [
      'Project Management', 'Client Communication', 'Requirement Gathering',
      'Startup Development', 'Business Research', 'Product Thinking',
      'Stakeholder Communication', 'Team Coordination',
    ],
  },
  {
    title: 'Soft Skills',
    items: [
      'Communication', 'Responsibility', 'Independence',
      'Problem-Solving', 'Attention to Detail', 'Collaboration',
      'Adaptability', 'Clear Explanation',
    ],
  },
];

export const education = [
  {
    school: 'SGH Warsaw School of Economics',
    degree: 'Master’s in Advanced Analytics — Big Data',
    period: '2024 – 2026',
    note: 'Focus on big data, predictive modelling, data preparation, business analytics, optimization, and applied machine learning.',
  },
  {
    school: 'Kozminski University',
    degree: 'Bachelor’s in Business Management and Artificial Intelligence',
    period: '2021 – 2024',
    note: 'Focus on machine learning, data analysis, business management, and practical applications of artificial intelligence.',
  },
];

export const certificates = [
  'Google BigQuery — SQL fundamentals',
  'DataCamp — Python',
  'DataCamp — RStudio',
  'DataCamp — Power BI',
  'DataCamp — Shell',
  'DataCamp — Scala',
  'Recorded Future — Threat Intelligence Modules',
  'EPAM Student Ambassador',
];

export const languages = [
  { name: 'English', level: 'C1 / Professional' },
  { name: 'Turkish', level: 'C1 / Professional' },
  { name: 'Azerbaijani', level: 'C1 / Native/Bilingual' },
  { name: 'Russian', level: 'B1 / Working Knowledge' },
  { name: 'Polish', level: 'A2–B1 / Elementary to Limited Working' },
];
