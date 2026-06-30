import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import ArticlesPage from './components/pages/ArticlesPage';
import HomePage from './components/pages/HomePage';
import LikedPage from './components/pages/LikedPage';
import ReadingPage from './components/pages/ReadingPage';
import ReadLaterPage from './components/pages/ReadLaterPage';
import StatsPage from './components/pages/StatsPage';
import { useAuth } from './contexts/AuthContext';
import { useIsDarkMode } from './contexts/ThemeContext';
import { useHealth } from './hooks/queries';

function App() {
  const { isConnected } = useAuth();
  const isDarkMode = useIsDarkMode();
  useHealth();

  const routes = (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id" element={<ReadingPage />} />
        <Route path="likes" element={<LikedPage />} />
        <Route path="read-later" element={<ReadLaterPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );

  return (
    <BrowserRouter>
      {isConnected ? (
        <Sidebar>{routes}</Sidebar>
      ) : (
        <div className="flex min-h-screen min-w-0 flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900 transition-colors dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
          <div className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 xl:max-w-[80rem]">{routes}</div>
        </div>
      )}
      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
