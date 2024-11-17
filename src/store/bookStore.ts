import { create } from 'zustand';
import { Book } from '../types';

interface BookState {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  borrowBook: (bookId: string, userId: string, dueDate: string) => void;
  returnBook: (bookId: string, userId: string) => void;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    category: 'Fiction',
    publishedDate: '1925-04-10',
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    available: true,
    quantity: 3,
    borrowedBy: [],
    reservedBy: [],
    pdfUrl: '/books/great-gatsby.pdf',
    price: 9.99
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    category: 'Fiction',
    publishedDate: '1960-07-11',
    description: 'The story of racial injustice and the loss of innocence in the American South.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    available: true,
    quantity: 2,
    borrowedBy: [],
    reservedBy: [],
    pdfUrl: '/books/to-kill-a-mockingbird.pdf',
    price: 12.99
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    category: 'Romance',
    publishedDate: '1813-01-28',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    available: true,
    quantity: 4,
    borrowedBy: [],
    reservedBy: [],
    pdfUrl: '/books/pride-and-prejudice.pdf',
    price: 8.99
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    category: 'Science Fiction',
    publishedDate: '1949-06-08',
    description: 'A dystopian social science fiction novel that follows the life of Winston Smith.',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400',
    available: true,
    quantity: 3,
    borrowedBy: [],
    reservedBy: [],
    pdfUrl: '/books/1984.pdf',
    price: 11.99
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928227',
    category: 'Fantasy',
    publishedDate: '1937-09-21',
    description: 'A fantasy novel about the adventures of Bilbo Baggins.',
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&q=80&w=400',
    available: true,
    quantity: 5,
    borrowedBy: [],
    reservedBy: [],
    pdfUrl: '/books/the-hobbit.pdf',
    price: 14.99
  }
];

export const useBookStore = create<BookState>((set) => ({
  books: INITIAL_BOOKS,
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  removeBook: (id) => set((state) => ({
    books: state.books.filter((book) => book.id !== id)
  })),
  borrowBook: (bookId, userId, dueDate) => set((state) => ({
    books: state.books.map((book) =>
      book.id === bookId
        ? {
            ...book,
            available: book.quantity <= 1,
            quantity: book.quantity - 1,
            borrowedBy: [...book.borrowedBy, { userId, dueDate }]
          }
        : book
    )
  })),
  returnBook: (bookId, userId) => set((state) => ({
    books: state.books.map((book) =>
      book.id === bookId
        ? {
            ...book,
            available: true,
            quantity: book.quantity + 1,
            borrowedBy: book.borrowedBy.filter((b) => b.userId !== userId)
          }
        : book
    )
  })),
}));