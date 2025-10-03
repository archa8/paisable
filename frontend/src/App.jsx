import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import WelcomePage from "./pages/WelcomePage";
import ContactUs from "./pages/ContactUS";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactUs />} />{" "}
        {/* Add Contact Us route */}
        {/* Protected Routes Wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
        </Route>
      </Routes>

      {/* Global Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm",
          success: {
            className: "bg-green-600 text-white px-4 py-2 rounded-lg",
          },
          error: {
            className: "bg-red-600 text-white px-4 py-2 rounded-lg",
          },
        }}
      />
    </>
  );
}

export default App;
