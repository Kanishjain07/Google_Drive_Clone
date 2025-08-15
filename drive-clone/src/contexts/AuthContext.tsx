import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is already logged in (persisted in localStorage)
    const savedUser = localStorage.getItem('drive-clone-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Store the token
        localStorage.setItem('auth_token', data.access_token);
        
        // Get user info
        const userResponse = await fetch('http://localhost:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const loggedInUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          };
          
          setUser(loggedInUser);
          localStorage.setItem('drive-clone-user', JSON.stringify(loggedInUser));
          setIsLoading(false);
          return true;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        const newUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.name,
          avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        
        setUser(newUser);
        localStorage.setItem('drive-clone-user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('drive-clone-user');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};