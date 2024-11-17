import React, { useState } from 'react';
import { useBookStore } from '../store/bookStore';
import { Plus, Trash, Bell, BookOpen, Users, AlertCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddBookForm {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  coverUrl: string;
  pdfUrl: string;
}

const initialFormState: AddBookForm = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  description: '',
  price: 0,
  quantity: 1,
  coverUrl: '',
  pdfUrl: ''
};

export default function AdminDashboard() {
  const { books, addBook, removeBook } = useBookStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddBookForm>(initialFormState);
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'borrowed'

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = {
      ...formData,
      id: Date.now().toString(),
      publishedDate: new Date().toISOString(),
      available: true,
      borrowedBy: [],
      reservedBy: []
    };
    addBook(newBook);
    setShowAddForm(false);
    setFormData(initialFormState);
    toast.success('Book added successfully!');
  };

  const handleRemoveBook = (id: string) => {
    removeBook(id);
    toast.success('Book removed successfully!');
  };

  const handleSendNotification = (userId: string) => {
    toast.success('Return reminder sent to user!');
  };

  const borrowedBooks = books.filter(book => book.borrowedBy.length > 0);

  const stats = [
    {
      title: 'Total Books',
      value: books.reduce((acc, book) => acc + book.quantity, 0),
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: new Set(books.flatMap(book => book.borrowedBy)).size,
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Overdue Books',
      value: borrowedBooks.length,
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      title: 'Total Revenue',
      value: `$${books.reduce((acc, book) => acc + book.price * (book.quantity), 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="mt-2 text-gray-500">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'books'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('books')}
            >
              Manage Books
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'borrowed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('borrowed')}
            >
              Borrowed Books
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'books' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{book.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveBook(book.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrowed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {borrowedBooks.map((book) =>
                    book.borrowedBy.map((borrower) => (
                      <tr key={`${book.id}-${borrower.userId}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{borrower.userId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(borrower.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleSendNotification(borrower.userId)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Bell className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ISBN</label>
                <input
                  type="text"
                  required
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PDF URL</label>
                <input
                  type="url"
                  required
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="https://example.com/book.pdf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}