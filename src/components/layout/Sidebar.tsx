import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Schedule',
      href: '/schedule', // Changed from /jobs
      icon: Calendar, // Changed icon
      current: location.pathname === '/schedule' // Updated path
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      current: location.pathname === '/messages'
    },
    {
      name: 'Earnings',
      href: '/earnings', // Changed from /payments
      icon: TrendingUp,  // Changed icon
      current: location.pathname === '/earnings' // Updated path
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm min-h-screen">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                
                className={({ isActive }) =>
                  `flex items-center p-3 text-base font-normal rounded-lg ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className={`w-6 h-6 ${item.current ? 'text-indigo-600' : 'text-gray-500'}`} />
                <span className="ml-3">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center p-3 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 w-full"
          >
            <LogOut className="w-6 h-6 text-gray-500" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
