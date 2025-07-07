import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'staff';
  studentId?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'student' | 'staff';
  studentId?: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('smartreads_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo users
    const demoUsers = [
      { id: '1', email: 'admin@smartreads.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
      { id: '2', email: 'student@smartreads.com', password: 'student123', name: 'John Doe', role: 'student' as const, studentId: 'ST001', department: 'Computer Science' },
      { id: '3', email: 'staff@smartreads.com', password: 'staff123', name: 'Jane Smith', role: 'staff' as const, department: 'Mathematics' }
    ];

    const foundUser = demoUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const userWithoutPassword = { ...foundUser };
    delete (userWithoutPassword as any).password;
    
    setUser(userWithoutPassword);
    localStorage.setItem('smartreads_user', JSON.stringify(userWithoutPassword));
  };

  const register = async (userData: RegisterData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      studentId: userData.studentId,
      department: userData.department
    };

    setUser(newUser);
    localStorage.setItem('smartreads_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartreads_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext }