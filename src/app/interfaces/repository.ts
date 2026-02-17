export interface RepositoryItem {
  id?: string; // Firestore document ID is a string, and it's optional for new items
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
  code: string; // URL to the code file in Firebase Storage
}
