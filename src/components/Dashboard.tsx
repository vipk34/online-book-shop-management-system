import React from 'react';
import { useAuthStore } from '../store/authStore';
import {
  BookOpen,
  Users,
  AlertCircle,
  DollarSign,
  BookMarked,
} from 'lucide-react';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    {
      title: 'Total Books',
      value: '1,234',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: '567',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Overdue Books',
      value: '23',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'Total Fines',
      value: '$890',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Books Borrowed',
      value: '89',
      icon: BookMarked,
      color: 'bg-purple-500',
    },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-lg shadow-md space-y-2"
          >
            <div className="flex items-center justify-between">
              <div
                className={`${stat.color} p-3 rounded-full text-white`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Activity items would go here */}
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            System Notifications
          </h2>
          <div className="space-y-4">
            {/* Notifications would go here */}
            <p className="text-gray-600">No new notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
}