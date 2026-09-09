import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { useIsDarkMode } from './contexts/ThemeContext';
import HomePage from './core/components/HomePage';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import ArticlesPage from './features/articles/ArticlesPage';
import ReadingPage from './features/articles/ReadingPage';
import StatsPage from './features/insights/StatsPage';
import LikedPage from './features/liked/LikedPage';
import ReadLaterPage from './features/read-later/ReadLaterPage';
import { useHealth } from './hooks/queries';

function App() {
  const isDarkMode = useIsDarkMode();
  useHealth();

  const routes = (
    <Routes>
      <Route index element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id" element={<ReadingPage />} />
        <Route path="likes" element={<LikedPage />} />
        <Route path="read-later" element={<ReadLaterPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/articles" replace />} />
      </Route>
    </Routes>
  );

  return (
    <BrowserRouter>
      {routes}

      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
