import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { useIsDarkMode } from './contexts/ThemeContext';
import { HealthPoller } from './core/components/HealthPoller';
import HomePage from './core/components/HomePage';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import ReadingPage from './features/articles/components/ReadingPage';
import ArticlesPage from './features/articles/views/ArticlesPage';
import InboxPage from './features/inbox/InboxPage';
import StatsPage from './features/insights/StatsPage';
import LikesPage from './features/likes/LikesPage';
import ReadLaterPage from './features/read-later/ReadLaterPage';
import RssPage from './features/rss/RssPage';

function App() {
  const isDarkMode = useIsDarkMode();

  const routes = (
    <Routes>
      <Route path="home" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id" element={<ReadingPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="likes" element={<LikesPage />} />
        <Route path="read-later" element={<ReadLaterPage />} />
        <Route path="rss" element={<RssPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/read-later" replace />} />
      </Route>
    </Routes>
  );

  return (
    <BrowserRouter>
      <HealthPoller />
      {routes}

      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
