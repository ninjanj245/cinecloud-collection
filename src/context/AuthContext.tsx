
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (name: string, password: string, remember: boolean) => boolean;
  signup: (name: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const login = (name: string, password: string, remember: boolean) => {
    // In a real app, we would validate credentials against a backend
    // For demo purposes, we'll just check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[name] && users[name].password === password) {
      setUser({ name });
      if (remember) {
        localStorage.setItem('user', JSON.stringify({ name }));
      }
      return true;
    }
    
    return false;
  };

  const signup = (name: string, password: string) => {
    // In a real app, this would create a user in a backend database
    // For demo purposes, we'll just store users in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[name]) {
      return false; // User already exists
    }
    
    users[name] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser({ name });
    localStorage.setItem('user', JSON.stringify({ name }));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: user !== null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
