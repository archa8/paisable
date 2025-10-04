import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom'; // 1. Import Link
import useAuth from '../hooks/useAuth';
import CurrencySelector from './CurrencySelector';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const { logout } = useAuth();

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium';
    if (isActive) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* 2. Wrap the span in a Link to the dashboard */}
              <Link
                to="/dashboard"
                className="font-bold text-xl text-blue-600 dark:text-blue-400"
              >
                Paisable
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={getNavLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/transactions" className={getNavLinkClass}>
                    Transactions
                  </NavLink>
                  <NavLink to="/receipts" className={getNavLinkClass}>
                    Receipts
                  </NavLink>
                  <NavLink to="/settings" className={getNavLinkClass}>
                    Settings
                  </NavLink>
                  <NavLink to="/budgets" className={getNavLinkClass}>
                    Budgets
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <CurrencySelector />
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
