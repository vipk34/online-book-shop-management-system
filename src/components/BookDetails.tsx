import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { Download, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface BorrowFormData {
  days: number;
}

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [formData, setFormData] = useState<BorrowFormData>({
    days: 7,
  });

  const user = useAuthStore((state) => state.user);
  const updateBalance = useAuthStore((state) => state.updateBalance);
  const book = useBookStore((state) =>
    state.books.find((b) => b.id === id)
  );

  const isBookBorrowed = book?.borrowedBy.some(b => b.userId === user?.id);

  if (!book || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Book not found</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = calculatePrice();
    
    if (user.balance < totalPrice) {
      toast.error('Insufficient funds. Please add money to your balance.');
      return;
    }

    try {
      updateBalance(-totalPrice);
      useBookStore.getState().borrowBook(book.id, user.id, new Date(Date.now() + formData.days * 24 * 60 * 60 * 1000).toISOString());
      toast.success('Book borrowed successfully!');
      setShowBorrowForm(false);
    } catch (error) {
      toast.error('Failed to borrow book');
    }
  };

  const handleDownload = async () => {
    if (!isBookBorrowed) {
      toast.error('You need to borrow the book first!');
      return;
    }

    try {
      // Create a simple PDF with book content
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text(book.title, 20, 20);
      doc.setFontSize(12);
      doc.text(`By ${book.author}`, 20, 30);
      doc.text(book.description, 20, 40, { maxWidth: 170 });
      
      doc.save(`${book.title}.pdf`);
      toast.success('Book downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download book');
    }
  };

  const calculatePrice = () => {
    const basePrice = book.price;
    const daysPrice = formData.days * 0.5; // $0.50 per day
    return basePrice + daysPrice;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-64 w-full object-cover md:w-64"
            src={book.coverUrl}
            alt={book.title}
          />
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {book.title}
            </h1>
            <button
              onClick={() => navigate('/catalog')}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
            By {book.author}
          </p>
          <div className="mt-4 flex items-center">
            <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
              {book.category}
            </span>
            <span className="ml-4 text-gray-500 dark:text-gray-400">
              ISBN: {book.isbn}
            </span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {book.description}
          </p>
          <div className="mt-6 flex items-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${book.price}
            </span>
            <span className="ml-2 text-sm text-gray-500">per book</span>
          </div>
          <div className="mt-6 flex space-x-4">
            {!isBookBorrowed && book.available && (
              <button
                onClick={() => setShowBorrowForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Clock className="h-5 w-5 mr-2" />
                Borrow Book
              </button>
            )}
            <button
              onClick={handleDownload}
              className={`flex items-center px-4 py-2 ${
                isBookBorrowed 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white rounded-md`}
              disabled={!isBookBorrowed}
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {showBorrowForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Borrow Book
            </h2>
            <form onSubmit={handleBorrow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Borrow Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={formData.days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      days: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold dark:text-white">
                  Total Price: ${calculatePrice().toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your Balance: ${user.balance?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBorrowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={user.balance < calculatePrice()}
                >
                  Confirm Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}