export interface RepositoryItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  author: string;
  level: string;
  materials: string[];
  tags: string[];
  downloads: number;
  likes: number;
  date: string;
  code: string; // Stored directly as a string in Firestore
}
