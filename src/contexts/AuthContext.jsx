import React, { createContext, useContext, useState, useEffect } from "react";
import { userStorage } from "../utils/localStorage";
import { initializeData } from "../data/mockData";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        initializeData();
        const currentUser = userStorage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
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
      const users = userStorage.getUsers();
      const foundUser = users.find(
        (user) =>
          user.email === email && user.password === password && user.isActive
      );

      if (foundUser) {
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
        };
        userStorage.updateUser(foundUser.id, {
          lastLogin: updatedUser.lastLogin,
        });
        const sessionUser = { ...updatedUser };
        delete sessionUser.password;
        userStorage.setCurrentUser(sessionUser);
        localStorage.setItem("token", `${sessionUser.id}.${Date.now()}`);
        setUser(sessionUser);
        return { success: true, user: sessionUser };
      } else {
        return {
          success: false,
          error: "Invalid email or password. Please check your credentials.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An error occurred during login. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      userStorage.clearCurrentUser();
      localStorage.removeItem("token");
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "An error occurred during logout." };
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) {
        return { success: false, error: "No user logged in" };
      }
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      userStorage.updateUser(user.id, userData);
      userStorage.setCurrentUser(updatedUser);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: "Failed to update profile. Please try again.",
      };
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      super_user: [
        'view_dashboard','manage_system','manage_employees','manage_universities','manage_applications','manage_students','edit_students','delete_students','view_reports','assign_support'
      ],
      admin: [
        'view_dashboard','manage_system','manage_employees','manage_universities','manage_applications','manage_students','edit_students','delete_students','view_reports','assign_support'
      ],
      ceo: [
        'view_dashboard','manage_employees','manage_universities','manage_applications','manage_students','edit_students','view_reports','view_salary','manage_salary','manage_paysheets'
      ],
      head: [
        'view_dashboard','manage_employees','manage_universities','manage_applications','manage_students','edit_students','view_reports','assign_support','view_salary','manage_salary','manage_paysheets'
      ],
      accountant: [
        'view_dashboard','view_reports','manage_finance'
      ],
      customer_support: [
        'view_dashboard','view_reports'
      ],
      receptionist: [
        'view_dashboard','walk_in_entry'
      ],
      instructor: [
        'view_dashboard','view_reports','instructor_update'
      ],
      counselor: [
        'view_dashboard','manage_students','edit_students','manage_applications','edit_applications','view_universities','view_reports'
      ],
      employee: [
        'view_dashboard','view_students','view_applications','view_universities','view_reports'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      super_user: 'Super User',
      admin: 'Administrator',
      ceo: 'CEO',
      head: 'Head',
      accountant: 'Accountant',
      customer_support: 'Customer Support',
      receptionist: 'Receptionist',
      instructor: 'Instructor',
      counselor: 'Counselor',
      employee: 'Employee'
    };
    return roleNames[role] || role;
  };

  const canAccessRoute = (routeName) => {
    if (!user) return false;

    const routePermissions = {
      dashboard: ['super_user','admin','ceo','head','accountant','customer_support','receptionist','instructor','counselor','employee'],
      students: ['super_user','admin','ceo','head','accountant','customer_support','instructor','counselor','employee'],
      applications: ['super_user','admin','ceo','head','accountant','customer_support','instructor','counselor','employee'],
      universities: ['super_user','admin','ceo','head','accountant','customer_support','receptionist','instructor','counselor','employee'],
      employees: ['super_user','admin','ceo','head'],
      reports: ['super_user','admin','ceo','head','instructor'],
      walkin: ['receptionist'],
      assignments: ['super_user','admin','head'],
      instructor: ['instructor'],
      finance: ['accountant'],
      pay_details: ['ceo','head'],
      paysheets: ['ceo','head']
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
    canAccessRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
