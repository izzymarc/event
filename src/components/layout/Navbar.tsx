import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, MessageSquare, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">EventWork</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>

            <Link
              to="/messages"
              className="p-2 text-gray-400 hover:text-gray-500 relative"
            >
              <MessageSquare className="h-6 w-6" />
            </Link>

            <Link
              to="/profile" // Correct link to /profile
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
            >
              <div className="relative">
                {user?.full_name ? (
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {user.full_name.charAt(0)}
                  </div>
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
              </div>
              <span className="font-medium">{user?.full_name || 'Profile'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
