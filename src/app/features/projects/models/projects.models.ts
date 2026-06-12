export interface Project {
  id: string;
  name: string;
  description: string;
  github_url: string | null;
  image_url: string | null;
  tags: string[];
  sort_order: number;
}
