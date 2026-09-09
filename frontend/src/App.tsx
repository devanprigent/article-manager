import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/layout/ProtectedRoute';
import ArticlesPage from './components/pages/ArticlesPage';
import HomePage from './components/pages/HomePage';
import LikedPage from './components/pages/LikedPage';
import ReadingPage from './components/pages/ReadingPage';
import ReadLaterPage from './components/pages/ReadLaterPage';
import StatsPage from './components/pages/StatsPage';
import { useIsDarkMode } from './contexts/ThemeContext';
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
