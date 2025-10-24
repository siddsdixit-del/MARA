import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Start with null user (not logged in)
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const switchRole = (newRole) => {
    if (!user) return;
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'admin' ? 'Admin User' : 'John Doe',
      email: newRole === 'admin' ? 'admin@mara.com' : 'john@acme.com',
      company: newRole === 'admin' ? 'MARA Holdings' : 'Acme Corporation',
    });
  };

  const login = (email, password, role) => {
    // Simple auth check (in real app, this would call an API)
    const validCredentials = {
      'admin@mara.com': { password: 'admin123', role: 'admin', name: 'Admin User', company: 'MARA Holdings' },
      'john@acme.com': { password: 'customer123', role: 'customer', name: 'John Doe', company: 'Acme Corporation' },
    };

    const userCreds = validCredentials[email];
    
    if (userCreds && userCreds.password === password) {
      setUser({
        name: userCreds.name,
        email: email,
        role: role || userCreds.role,
        company: userCreds.company,
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

