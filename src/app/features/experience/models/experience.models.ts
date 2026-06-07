export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  is_current: boolean;
  description: string;
  tags: string[];
  sort_order: number;
}
