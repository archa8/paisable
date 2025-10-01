import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';

/* // Demo user credentials
const DEMO_EMAIL = 'test@example.com';
const DEMO_PASSWORD = 'password123'; */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  /* const handleFillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }; */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Link to="/" className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-montserrat mb-8">
        Paisable
      </Link>

      <div className="px-8 py-6 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
              <input type="email" placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <button type="submit" className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Login</button>
              {/*<button 
                type="button" 
                onClick={handleFillDemoCredentials} 
                className="w-full px-6 py-2 text-blue-600 dark:text-blue-400 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Fill Demo Credentials
              </button>*/}
            </div>
            <div className="mt-6 text-gray-600 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline ml-2">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}