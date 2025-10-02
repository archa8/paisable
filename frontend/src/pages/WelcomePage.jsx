import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ThemeToggle from '../components/ThemeToggle';

const ChartIcon = () => <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

const ReceiptIcon = () => <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const CategoryIcon = () => <svg className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5z" /></svg>;

const FeatureCard = ({ icon, title, children }) => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center text-center">
    {icon}
    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-montserrat text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="py-4 px-8 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          Paisable
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
          >
            Contact Us
          </Link>

          <Link
            to="/login"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Sign Up
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center py-20 px-4">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
          Take Control of Your Finances
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The simple, smart, and secure way to manage your income and expenses,
          visualize your spending, and achieve your financial goals.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700"
        >
          Get Started for Free
        </Link>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-12">
            All The Tools You Need
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<ChartIcon />} title="Visualize Your Spending">
              See where your money goes with intuitive charts and graphs.
              Understand your habits and make smarter financial decisions.
            </FeatureCard>
            <FeatureCard
              icon={<ReceiptIcon />}
              title="Effortless Receipt Scanning"
            >
              Simply upload a photo of your receipt, and let our smart OCR
              technology extract the details for you.
            </FeatureCard>
            <FeatureCard icon={<CategoryIcon />} title="Smart Categorization">
              Organize your transactions with customizable categories to track
              spending across different areas of your life.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Paisable. All Rights Reserved.</p>
      </footer>
    </div>
  );
}