export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  borrowedBooks: string[];
  fines: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedDate: string;
  description: string;
  coverUrl: string;
  available: boolean;
  quantity: number;
  borrowedBy: string[];
  reservedBy: string[];
}