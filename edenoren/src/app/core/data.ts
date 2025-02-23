import { Experience, Project } from "./app.model";

export const about: string = 
  `Hi there! My name is Eden, and I’m a Frontnd Developer passionate about building smooth, user-friendly interfaces. 
  \nI enjoy learning new things, writing efficient, performance-optimized code.
  \nI’m constantly exploring new technologies and techniques to expand my skills and grow as a developer.`;

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Frontend Developer",
    name: "Lawyal",
    duration: "September 2023 - Current",
    description: 
        `Developed features for a cloud-based platform, delivering seamless user experiences.
        \nCollaborated with cross-functional teams to implement features according to business requirements.
        \nActively identified, debugged, and resolved issues to ensure smooth and stable functionality across the platform.`,
    
    skills:["Angular", "TypeScript", "Git", "Jira", "Agile"]
  }
];
  
export const projects: Project[] = [
  {
    id: 1,
    name: "Portfolio (this)",
    description: 
    `A Single Page Application built with Angular and TypeScript,
    featuring smooth navigation, SEO optimization, and responsive design.`,
    skills: ["Angular", "TypeScript", "Standalone components"],
    link: 'https://github.com/EdenOren/EdenOren.github.io'
  },
  {
    id: 2,
    name: "Weather App",
    description: 
      `Developed a responsive real time weather app using Angular and the AccuWeather API. 
      Includes personalized experience with saved locations, Dynamic UI with themes and temperature unit conversion.`,
    skills: ["Angular", "TypeScript", "Lazy-loaded modules"],
    link: 'https://github.com/EdenOren/Weather-App'
  }
];