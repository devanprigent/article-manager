import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
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

  return (
    <BrowserRouter>
      <div className="flex min-h-screen min-w-0 flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900 transition-colors dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <NavBar />
        <div className={`mx-auto w-full min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 ${isConnected ? 'max-w-6xl' : 'max-w-7xl xl:max-w-[80rem]'}`}>
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
        </div>
        <Footer />
        <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} richColors closeButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
