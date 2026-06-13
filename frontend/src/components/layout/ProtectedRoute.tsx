import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute() {
  const { isConnected, isFetching } = useAuth();

  if (!isConnected && !isFetching) {
    return <Navigate to="/" replace />;
  }

  if (!isConnected && isFetching) {
    return null;
  }

  return <Outlet />;
}
