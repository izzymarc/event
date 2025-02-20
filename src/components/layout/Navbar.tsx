import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, MessageSquare, User, Search } from 'lucide-react';
import { ROUTES } from '../../lib/constants';

export default function Navbar() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement header search functionality here, e.g., navigate to jobs page with search query
    console.log('Header Search query:', searchQuery);
    // For now, let's just navigate to the jobs page (you can modify this)
    window.location.href = `/jobs?search=${searchQuery}`;
  };


  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center font-bold text-indigo-600">
              <span className="text-xl font-bold text-indigo-600">EventWork</span>
            </Link>
            <div className="hidden md:flex md:space-x-6 ml-8">
              <Link to={ROUTES.JOBS} className="text-gray-700 hover:text-gray-900">
                Find Talent
              </Link>
              <Link to={ROUTES.JOBS} className="text-gray-700 hover:text-gray-900">
                Find Work
              </Link>
              <Link to={ROUTES.HOME} className="text-gray-700 hover:text-gray-900">
                Why EventWork?
              </Link>
            </div>
          </div>

          {/* Center - Search Bar (visible on larger screens) */}
          <div className="hidden lg:flex lg:items-center lg:ml-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search for jobs or professionals"
                  className="block w-full rounded-full border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right side - Auth or User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
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
                  to="/profile"
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
              </>
            ) : (
              <div className="hidden md:flex md:space-x-4">
                <Link to={ROUTES.SIGN_IN} className="text-gray-700 hover:text-gray-900 font-medium">
                  Log In
                </Link>
                <Link
                  to={ROUTES.SIGN_UP}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Search Bar (visible on smaller screens) */}
      <div className="block lg:hidden p-4 bg-gray-50">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search for jobs or professionals"
              className="block w-full rounded-full border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </nav>
  );
}
