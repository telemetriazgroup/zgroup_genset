import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { getDefaultRouteForRole } from '../auth/permissions';

export default function GuestOnly() {
  const { isAuthenticated, session } = useAuth();

  if (isAuthenticated && session) {
    return <Navigate to={getDefaultRouteForRole(session.role)} replace />;
  }

  return <Outlet />;
}
