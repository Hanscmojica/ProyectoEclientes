import React, { createContext, useState, useEffect } from 'react';
import { loginService, renewTokenService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      if (token) {
        try {
          const response = await renewTokenService();
          
          if (response.ok) {
            setUser({
              id: response.id,
              perfil: response.perfil
            });
            setToken(response.token);
            localStorage.setItem('token', response.token);
          } else {
            // Token invalid or expired
            logout();
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logout();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginService(email, password);
      
      if (response.ok) {
        setUser({
          id: response.id,
          perfil: response.perfil
        });
        setToken(response.token);
        localStorage.setItem('token', response.token);
        return true;
      } else {
        setError(response.message || 'Error de autenticación');
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || 'Error de conexión al servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        loading,
        error, 
        login, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 