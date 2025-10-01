import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest'; 
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import AuthContext from '../contexts/AuthContext';

// Mock the AuthContext to provide necessary values
const MockAuthProvider = ({ children }) => {
  const mockAuth = { login: () => {} }; // Mock login function
  return (
    <AuthProvider value={mockAuth}>
      {children}
    </AuthProvider>
  );
};


describe('LoginPage', () => {
  it('should render the login form correctly', () => {
    const mockAuthContextValue = {
      login: () => {},
    };

    render(
      <BrowserRouter>
        {}
        <AuthContext.Provider value={mockAuthContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Fill Demo Credentials' })).toBeInTheDocument();
  });
});