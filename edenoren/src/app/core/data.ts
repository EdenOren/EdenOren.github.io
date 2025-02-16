import { Experience, Project } from "./app.model";

export const about: string = 
  `Hi there! My name is Eden, and I’m a Frontnd Developer passionate about building smooth, user-friendly interfaces. 
  I enjoy learning new things, writing clean code, and creating intuitive experiences. 
  I’m constantly exploring new technologies and techniques to expand my skills and grow as a developer.`;

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Frontend Developer",
    name: "Lawyal",
    duration: "September 2023 - ",
    description: 
        `Developed features for a cloud-based platform, delivering seamless user experiences.
        Collaborated with cross-functional teams to implement features according to business requirements.
        Actively identified, debugged, and resolved issues to ensure smooth and stable functionality across the platform.`,
    
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
    skills: ["Angular", "TypeScript", "Standalone based"],
    link: 'https://github.com/EdenOren/EdenOren.github.io'
  },
  {
    id: 2,
    name: "Weather App",
    description: 
      `Developed a responsive real time weather app using Angular and the AccuWeather API. 
      Includes personalized experience with saved locations, Dynamic UI with themes and temperature unit conversion.`,
    skills: ["Angular", "TypeScript", "Module based, lazy-loading"],
    link: 'https://github.com/EdenOren/Weather-App'
  }
];