import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Check if the token is valid by fetching user data
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          // Clear invalid token
          toast.error("Token verification failed");
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false); // Finished checking
    };
    
    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, ...userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await api.post('/auth/signup', { email, password });
      const { token: newToken, ...userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Signup failed');
      throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;