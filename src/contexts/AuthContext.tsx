import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, validate token with backend
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, make API call to authenticate
      // This is a mock implementation
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        isPremium: false,
      };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      navigate('/');
    } catch (error) {
      throw new Error('Authentication failed');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // In a real app, make API call to register
      const mockUser = {
        id: '1',
        email,
        name,
        isPremium: false,
      };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      navigate('/');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 