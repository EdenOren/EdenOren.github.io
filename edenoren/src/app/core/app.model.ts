import { MainRoutes } from "./app.enum";

export interface NavbarItem {
    title: string;
    icon: string;
    route?: MainRoutes;
    url?: string;
}

export interface Experience {
    id: number;
    title: string;
    name: string;
    duration: string;
    description: string;
    skills: string[];
}

export interface Project {
    id: number;
    name: string;
    description: string;
    skills: string[];
    link: string;
}