import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { RssRefresher } from './RssRefresher';
import { Sidebar } from './Sidebar';

export function ProtectedRoute() {
  const { isConnected, isFetching } = useAuth();

  if (!isConnected && !isFetching) {
    return <Navigate to="/home" replace />;
  }

  if (!isConnected && isFetching) {
    return null;
  }

  return (
    <Sidebar>
      <RssRefresher />
      <Outlet />
    </Sidebar>
  );
}
