import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      current: location.pathname === '/jobs'
    },
    {
      name: 'Proposals',
      href: '/proposals',
      icon: FileText,
      current: location.pathname === '/proposals'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      current: location.pathname === '/messages'
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      current: location.pathname === '/payments'
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
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 text-base font-normal rounded-lg ${
                  item.current
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${item.current ? 'text-indigo-600' : 'text-gray-500'}`} />
                <span className="ml-3">{item.name}</span>
              </Link>
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
