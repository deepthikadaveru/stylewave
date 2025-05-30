// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute (v6): Wrap your protected components as children.
 * Usage:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Otherwise render children
  return <>{children}</>;
};

export default ProtectedRoute;
