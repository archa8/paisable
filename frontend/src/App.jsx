import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import ReceiptsPage from './pages/ReceiptsPage';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import SetupProtectedRoute from './components/SetupProtectedRoute';
import Layout from './components/Layout';
import SettingsPage from './pages/SettingsPage';
import RecurringTransactions from './pages/RecurringTransactions';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
      
      {/* Protected Routes Wrapper */}
      <Route
        element={
          <SetupProtectedRoute>
            <Layout />
          </SetupProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/recurring-transactions"
          element={<RecurringTransactions />}
        />
      </Route>
    </Routes>
  );
}

export default App;
