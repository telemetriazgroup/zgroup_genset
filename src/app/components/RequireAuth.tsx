import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { getDefaultRouteForRole, getModuleFromPath } from '../auth/permissions';

export default function RequireAuth() {
  const { isAuthenticated, session, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const currentModule = getModuleFromPath(location.pathname);

  if (currentModule && !hasPermission(currentModule)) {
    return <Navigate to={getDefaultRouteForRole(session.role)} replace />;
  }

  return <Outlet />;
}
