export const profile = {
  name: "Dhairya Tiwari",
  firstName: "Dhairya",
  role: "Computer Science Engineering Student",
  location: "Uttar Pradesh, India",
  email: "dhairyatiwatig2005@gmail.com",
  github: "https://github.com/Dhairya-Dev-18", // Add your GitHub profile URL here.
  linkedin: "https://www.linkedin.com/in/dhairya-tiwari-dsa", // Add your LinkedIn profile URL here.
  leetcode: "https://leetcode.com/tiwariji_05", // Add your coding profile URL here.
  resumePath:"../../public/Resume.pdf",
  education: "B.Tech in Computer Science and Engineering",
  college: "ABES Engineering College",
  university: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
  intro:
    "I’m a computer science student interested in how good software works from the interface all the way down to the data. I learn by building, breaking things, and making them a little better each time.",
};

export type Project = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  problem: string;
  contribution: string;
  stack: string[];
  features: string[];
  challenge: string;
  learned: string;
  next: string;
  repo: string;
  live: string;
  accent: string;
};
export const projects: Project[] = [
  {
    id: "campus-connect",
    name: "Campus Connect",
    eyebrow: "COMMUNITY PLATFORM · FULL STACK",
    description:
      "A college-focused home for student communities, campus events, useful resources, and the everyday things that connect a campus.",
    problem:
      "Campus information and student conversations can become scattered across disconnected channels.",
    contribution:
      "A featured project concept in active development. Add your specific contribution and implementation details here.",
    stack: ["React", "Node.js", "Express.js", "MySQL"],
    features: [
      "Student communities",
      "Campus events",
      "Lost and found",
      "Academic resources",
      "Placement information",
    ],
    challenge:
      "Designing a useful information structure for several kinds of campus activity.",
    learned:
      "How product decisions shape data models and the way people find information.",
    next: "Document implemented chat, authentication, and access controls as they are completed.",
    repo: "https://github.com/Dhairya-dev-18/Campus-Connect",
    live: "https://campus-connect.vercel.app/",
    accent: "mint",
  },
  {
    id: "warranty-wave",
    name: "Warranty Wave",
    eyebrow: "CLAIMS MANAGEMENT · WEB APP",
    description:
      "A warranty and claims management application connecting an Angular experience to a Spring Boot service and MySQL data.",
    problem:
      "Warranty details and claim progress need a clear place to be recorded and followed.",
    contribution:
      "Project details are intentionally editable. Add your actual feature ownership and implementation status before publishing.",
    stack: ["Angular", "Spring Boot", "Java", "MySQL"],
    features: [
      "Warranty records",
      "Claim workflow",
      "REST API integration",
      "Dashboard",
    ],
    challenge:
      "Keeping frontend, API, and relational data responsibilities clear.",
    learned:
      "How a structured backend API supports a maintainable application.",
    next: "Add screenshots and describe which claim and dashboard flows are implemented.",
    repo: "https://github.com/Dhairya-dev-18/Warranty-Wave",
    live: "https://warranty-wave.vercel.app/",
    accent: "violet",
  },
];

export type Skill = {
  name: string;
  category: string;
  level: "Regularly used" | "Familiar" | "Learning";
  note: string;
  url: string;
};
export const skills: Skill[] = [
  {
    name: "C++",
    category: "Programming",
    level: "Regularly used",
    note: "Primary language for programming fundamentals and problem solving.",
    url: "https://en.cppreference.com/",
  },
  {
    name: "Java",
    category: "Programming",
    level: "Familiar",
    note: "An object-oriented language used in backend development.",
    url: "https://dev.java/",
  },
  {
    name: "JavaScript",
    category: "Programming",
    level: "Familiar",
    note: "The language behind interactive web experiences.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    name: "TypeScript",
    category: "Programming",
    level: "Learning",
    note: "Typed JavaScript for clearer application code.",
    url: "https://www.typescriptlang.org/docs/",
  },
  {
    name: "HTML",
    category: "Frontend",
    level: "Familiar",
    note: "Semantic building blocks for the web.",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    name: "CSS",
    category: "Frontend",
    level: "Familiar",
    note: "Layouts, responsive design, and visual systems.",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    name: "React",
    category: "Frontend",
    level: "Learning",
    note: "Component-driven interfaces and interactive experiences.",
    url: "https://react.dev/learn",
  },
  {
    name: "Angular",
    category: "Frontend",
    level: "Learning",
    note: "A structured framework for building web applications.",
    url: "https://angular.dev/overview",
  },
  {
    name: "Node.js",
    category: "Backend",
    level: "Learning",
    note: "JavaScript runtime for server-side applications.",
    url: "https://nodejs.org/en/learn",
  },
  {
    name: "Express.js",
    category: "Backend",
    level: "Learning",
    note: "Minimal routing and middleware for Node APIs.",
    url: "https://expressjs.com/",
  },
  {
    name: "Spring Boot",
    category: "Backend",
    level: "Learning",
    note: "Java framework for building backend services.",
    url: "https://spring.io/projects/spring-boot",
  },
  {
    name: "MySQL",
    category: "Databases",
    level: "Learning",
    note: "Relational data modeling and SQL.",
    url: "https://dev.mysql.com/doc/",
  },
  {
    name: "PostgreSQL",
    category: "Databases",
    level: "Learning",
    note: "Open source relational database.",
    url: "https://www.postgresql.org/docs/",
  },
  {
    name: "Supabase",
    category: "Databases",
    level: "Learning",
    note: "Hosted Postgres platform and developer tools.",
    url: "https://supabase.com/docs",
  },
  {
    name: "Git",
    category: "Tools",
    level: "Familiar",
    note: "Version control for tracking software changes.",
    url: "https://git-scm.com/doc",
  },
  {
    name: "GitHub",
    category: "Tools",
    level: "Familiar",
    note: "Code hosting and collaboration workflows.",
    url: "https://docs.github.com/",
  },
  {
    name: "Postman",
    category: "Tools",
    level: "Learning",
    note: "Exploring and testing HTTP APIs.",
    url: "https://learning.postman.com/docs/introduction/overview/",
  },
  {
    name: "Docker",
    category: "Tools",
    level: "Learning",
    note: "Packaging applications into containers.",
    url: "https://docs.docker.com/",
  },
];
