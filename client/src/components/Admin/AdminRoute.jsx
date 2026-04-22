/**
 * @file client/src/components/Admin/AdminRoute.jsx
 * @description Route guard for admin-only pages.
 * Checks user role from AuthContext and redirects non-admins to home.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6FC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8C99A] border-t-[#F96D00] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
