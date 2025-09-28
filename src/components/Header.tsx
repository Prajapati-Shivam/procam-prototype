import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, UserPlus, Settings } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Organization } from '../types';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const [organization] = useLocalStorage<Organization>('organization', {
    name: 'ProCam',
    tagline: 'Volunteer Management System',
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280'
  });

  const navItems = [
    { to: '/', label: 'Register Group', icon: UserPlus },
    { to: '/join', label: 'Join Group', icon: Users },
    { to: '/dashboard', label: 'Managing Dashboard', icon: Shield },
    { to: '/admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {organization.logo ? (
              <img src={organization.logo} alt={organization.name} className="h-8 w-8" />
            ) : (
              <Users className="h-8 w-8" style={{ color: organization.primaryColor }} />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{organization.name}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{organization.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === to
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;