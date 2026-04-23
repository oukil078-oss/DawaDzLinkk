import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'admin' | 'pharmacy' | 'supplier';
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface UserDetails {
  id: string;
  pharmacy_name?: string;
  company_name?: string;
  registry_number: string;
  address: string;
  wilaya: string;
}

interface AuthContextType {
  user: User | null;
  details: UserDetails | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      if (!authApi.isLoggedIn()) {
        setUser(null);
        setDetails(null);
        setLoading(false);
        return;
      }

      const data = await authApi.getMe();
      setUser(data.user);
      setDetails(data.details);
    } catch (error) {
      console.error('Error loading user:', error);
      // Token might be invalid, clear it
      authApi.logout();
      setUser(null);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    setDetails(data.details);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setDetails(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, details, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
