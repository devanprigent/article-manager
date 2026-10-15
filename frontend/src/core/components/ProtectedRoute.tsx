import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { LoadingIcon } from '../ui/LoadingIcon';
import { RssRefresher } from './RssRefresher';
import { Sidebar } from './Sidebar';

export function ProtectedRoute() {
  const { isConnected, isFetching } = useAuth();

  if (!isConnected && !isFetching) {
    return <Navigate to="/home" replace />;
  }

  if (!isConnected && isFetching) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
      >
        <LoadingIcon width={40} height={40} />
        <p className="text-sm font-medium">Currently fetching your session…</p>
      </div>
    );
  }

  return (
    <Sidebar>
      <RssRefresher />
      <Outlet />
    </Sidebar>
  );
}
