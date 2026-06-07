export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  description: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface AdminSkillGroup {
  id: string;
  label: string;
  skills: string[];
}
