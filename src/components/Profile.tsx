import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';
import { format } from 'date-fns';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const books = useBookStore((state) => state.books);
  const updateBalance = useAuthStore((state) => state.updateBalance);

  const borrowedBooks = books.filter(book => 
    book.borrowedBy.some(b => b.userId === user?.id)
  );

  const handleDeposit = () => {
    const amount = parseFloat(prompt('Enter amount to deposit:') || '0');
    if (amount > 0) {
      updateBalance(amount);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(prompt('Enter amount to withdraw:') || '0');
    if (amount > 0 && user?.balance && user.balance >= amount) {
      updateBalance(-amount);
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Balance:</span> ${user.balance?.toFixed(2)}</p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleDeposit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Deposit Funds
            </button>
            <button
              onClick={handleWithdraw}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>

      {borrowedBooks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Borrowed Books</h3>
          <div className="space-y-4">
            {borrowedBooks.map(book => (
              <div key={book.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">Due: {
                    format(new Date(book.borrowedBy.find(b => b.userId === user.id)?.dueDate || ''), 'PP')
                  }</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}