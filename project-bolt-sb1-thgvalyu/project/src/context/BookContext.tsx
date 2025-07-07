import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  publishedYear: number;
  imageUrl?: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userEmail: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'issued' | 'returned' | 'overdue';
}

interface BookContextType {
  books: Book[];
  issuedBooks: IssuedBook[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  issueBook: (bookId: string, userId: string, userName: string, userEmail: string) => void;
  returnBook: (issueId: string) => void;
  searchBooks: (query: string) => Book[];
  getBookById: (id: string) => Book | undefined;
  getIssuedBooksByUser: (userId: string) => IssuedBook[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    isbn: '978-0-7432-7356-5',
    totalCopies: 5,
    availableCopies: 3,
    description: 'A classic American novel set in the Jazz Age.',
    publishedYear: 1925,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    isbn: '978-0-06-112008-4',
    totalCopies: 4,
    availableCopies: 2,
    description: 'A gripping tale of racial injustice and childhood innocence.',
    publishedYear: 1960,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    isbn: '978-0-262-03384-8',
    totalCopies: 3,
    availableCopies: 1,
    description: 'Comprehensive introduction to algorithms and data structures.',
    publishedYear: 2009,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    isbn: '978-0-13-235088-4',
    totalCopies: 6,
    availableCopies: 4,
    description: 'A handbook of agile software craftsmanship.',
    publishedYear: 2008,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Fiction',
    isbn: '978-0-316-76948-0',
    totalCopies: 3,
    availableCopies: 0,
    description: 'The controversial coming-of-age story of Holden Caulfield.',
    publishedYear: 1951,
    imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);

  useEffect(() => {
    // Load from localStorage or use sample data
    const savedBooks = localStorage.getItem('smartreads_books');
    const savedIssuedBooks = localStorage.getItem('smartreads_issued_books');
    
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      setBooks(sampleBooks);
    }
    
    if (savedIssuedBooks) {
      setIssuedBooks(JSON.parse(savedIssuedBooks).map((item: any) => ({
        ...item,
        issueDate: new Date(item.issueDate),
        dueDate: new Date(item.dueDate),
        returnDate: item.returnDate ? new Date(item.returnDate) : undefined
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smartreads_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('smartreads_issued_books', JSON.stringify(issuedBooks));
  }, [issuedBooks]);

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString()
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const issueBook = (bookId: string, userId: string, userName: string, userEmail: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies === 0) {
      throw new Error('Book not available');
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from now

    const newIssue: IssuedBook = {
      id: Date.now().toString(),
      bookId,
      userId,
      userName,
      userEmail,
      issueDate,
      dueDate,
      status: 'issued'
    };

    setIssuedBooks(prev => [...prev, newIssue]);
    updateBook(bookId, { availableCopies: book.availableCopies - 1 });
  };

  const returnBook = (issueId: string) => {
    const issue = issuedBooks.find(i => i.id === issueId);
    if (!issue) return;

    const book = books.find(b => b.id === issue.bookId);
    if (!book) return;

    setIssuedBooks(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, returnDate: new Date(), status: 'returned' as const }
        : issue
    ));
    updateBook(issue.bookId, { availableCopies: book.availableCopies + 1 });
  };

  const searchBooks = (query: string) => {
    if (!query.trim()) return books;
    
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    );
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getIssuedBooksByUser = (userId: string) => {
    return issuedBooks.filter(issue => issue.userId === userId);
  };

  return (
    <BookContext.Provider value={{
      books,
      issuedBooks,
      addBook,
      updateBook,
      deleteBook,
      issueBook,
      returnBook,
      searchBooks,
      getBookById,
      getIssuedBooksByUser
    }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};