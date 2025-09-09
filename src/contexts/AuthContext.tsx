import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'worker' | 'doctor') => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User>, password: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'राम कुमार',
    email: 'ram@example.com',
    password: 'worker123',
    role: 'worker',
    phone: '+91 9876543210',
    workerDetails: {
      healthId: 'HID-2024-001',
      dateOfBirth: '1990-05-15',
      nationality: 'Indian',
      emergencyContact: '+91 9876543211',
      bloodGroup: 'B+',
      allergies: ['Dust', 'Pollen']
    }
  },
  {
    id: '2',
    name: 'Dr. प्रिया शर्मा',
    email: 'priya@example.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '+91 9876543212',
    doctorDetails: {
      licenseNumber: 'MED-2020-456',
      specialization: 'General Medicine',
      hospital: 'City General Hospital',
      experience: 8
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('healthUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'worker' | 'doctor'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('healthUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'worker',
      phone: userData.phone,
      workerDetails: userData.role === 'worker' ? {
        healthId: `HID-2024-${Date.now().toString().slice(-3)}`,
        dateOfBirth: '',
        nationality: 'Indian',
        emergencyContact: '',
        bloodGroup: '',
        allergies: []
      } : undefined,
      doctorDetails: userData.role === 'doctor' ? {
        licenseNumber: '',
        specialization: '',
        hospital: '',
        experience: 0
      } : undefined
    };

    setUser(newUser);
    localStorage.setItem('healthUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      isLoading
    }}>
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