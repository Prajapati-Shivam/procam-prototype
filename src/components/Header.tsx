import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, UserPlus } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Register Group', icon: UserPlus },
    { to: '/join', label: 'Join Group', icon: Users },
    { to: '/dashboard', label: 'Managing Dashboard', icon: Shield },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ProCam</h1>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === to
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;