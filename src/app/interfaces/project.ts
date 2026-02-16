export interface Project {
    id: number;
    title: string;
    category: 'accesibilidad' | 'sensores' | 'comunicacion' | 'educacion' | 'entretenimiento';
    description: string;
    author: string;
    tags: string[];
    downloads: number;
    likes: number;
    date: string;
    code: string;
}
