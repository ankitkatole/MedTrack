import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const API_BASE_URL = 'https://medtrack-i6zm.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('🔄 User state changed:', user);
  }, [user]);

  const verifyToken = async () => {
    try {
      console.log('🔍 Verifying token...');
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      console.log('✅ Token verified successfully:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('❌ Token verification failed:', error.response?.data || error.message);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      console.log('🔐 Attempting login for:', identifier);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        identifier,
        password,
      });
      
      console.log('✅ Login successful:', response.data);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      console.log('👤 User state set:', userData);
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('📝 Attempting signup for:', userData.email);
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData);
      
      console.log('✅ Signup successful:', response.data);
      const { token, user: newUser } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      console.log('👤 User state set:', newUser);
      return { success: true };
    } catch (error) {
      console.error('❌ Signup failed:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    darkMode,
    toggleDarkMode,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
