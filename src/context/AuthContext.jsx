import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('whatabod_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('whatabod_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whatabod_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
