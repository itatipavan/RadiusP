import React, { createContext, useContext, useState, useEffect } from 'react';
import { userStorage } from '../utils/localStorage';
import { initializeData } from '../data/mockData';

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

  // Initialize app data and check for existing session
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize mock data if needed
        initializeData();
        
        // Check for existing user session
        const currentUser = userStorage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { email, password } = credentials;
      
      // Get users from localStorage
      const users = userStorage.getUsers();
      
      // Find user with matching email and password
      const foundUser = users.find(
        user => user.email === email && user.password === password && user.isActive
      );

      if (foundUser) {
        // Update last login time
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString()
        };
        
        // Update user in storage
        userStorage.updateUser(foundUser.id, { lastLogin: updatedUser.lastLogin });
        
        // Set current user (exclude password from stored session)
        const sessionUser = { ...updatedUser };
        delete sessionUser.password;
        
        userStorage.setCurrentUser(sessionUser);
        setUser(sessionUser);
        
        return { success: true, user: sessionUser };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      userStorage.clearCurrentUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: 'An error occurred during logout.' 
      };
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      
      // Update in localStorage
      userStorage.updateUser(user.id, userData);
      userStorage.setCurrentUser(updatedUser);
      
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: 'Failed to update profile. Please try again.' 
      };
    }
  };

  // Role-based permission checking
  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      admin: [
        'view_dashboard',
        'manage_students',
        'edit_students',
        'delete_students',
        'manage_employees',
        'edit_employees',
        'delete_employees',
        'manage_universities',
        'edit_universities',
        'delete_universities',
        'manage_applications',
        'edit_applications',
        'delete_applications',
        'view_reports',
        'manage_system'
      ],
      counselor: [
        'view_dashboard',
        'manage_students',
        'edit_students',
        'manage_applications',
        'edit_applications',
        'view_universities',
        'view_reports'
      ],
      employee: [
        'view_dashboard',
        'view_students',
        'view_applications',
        'view_universities',
        'view_reports'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrator',
      counselor: 'Counselor',
      employee: 'Employee'
    };
    return roleNames[role] || role;
  };

  // Check if user can access a specific route
  const canAccessRoute = (routeName) => {
    if (!user) return false;

    const routePermissions = {
      dashboard: ['admin', 'counselor', 'employee'],
      students: ['admin', 'counselor', 'employee'],
      applications: ['admin', 'counselor', 'employee'],
      universities: ['admin', 'counselor', 'employee'],
      employees: ['admin'],
      reports: ['admin', 'counselor', 'employee']
    };

    return routePermissions[routeName]?.includes(user.role) || false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    hasPermission,
    getRoleDisplayName,
    canAccessRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
