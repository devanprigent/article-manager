import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { useIsDarkMode } from './contexts/ThemeContext';
import { HealthPoller } from './core/components/HealthPoller';
import HomePage from './core/components/HomePage';
import { ProtectedRoute } from './core/components/ProtectedRoute';
import InboxPage from './features/inbox/InboxPage';
import StatsPage from './features/insights/StatsPage';
import ReadingPage from './features/library/components/ReadingPage';
import ArticlesPage from './features/library/views/ArticlesPage';
import LikesPage from './features/likes/LikesPage';
import ReadLaterPage from './features/read-later/ReadLaterPage';
import RssPage from './features/rss/RssPage';

function App() {
  const isDarkMode = useIsDarkMode();

  const routes = (
    <Routes>
      <Route path="home" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="inbox" element={<InboxPage />} />
        <Route path="read-later" element={<ReadLaterPage />} />
        <Route path="likes" element={<LikesPage />} />

        <Route path="library" element={<ArticlesPage />} />
        <Route path="rss" element={<RssPage />} />
        <Route path="stats" element={<StatsPage />} />

        <Route path="library/:id" element={<ReadingPage />} />
        <Route path="*" element={<Navigate to="/inbox" replace />} />
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
