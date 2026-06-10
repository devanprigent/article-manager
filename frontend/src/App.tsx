import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import Footer from './components/layout/Footer';
import NavBar from './components/layout/NavBar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import ArticlesPage from './components/pages/ArticlesPage';
import GridPage from './components/pages/GridPage';
import HomePage from './components/pages/HomePage';
import ReadingPage from './components/pages/ReadingPage';
import StatsPage from './components/pages/StatsPage';
import { Article } from './constants/types';
import { useAuth } from './contexts/AuthContext';
import { useIsDarkMode } from './contexts/ThemeContext';
import { useHealth } from './hooks/queries';

function App() {
  const { isConnected } = useAuth();
  const isDarkMode = useIsDarkMode();
  useHealth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900 transition-colors dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <NavBar />
        <div className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${isConnected ? 'max-w-6xl' : 'max-w-7xl xl:max-w-[80rem]'}`}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/:id" element={<ReadingPage />} />
              <Route
                path="likes"
                element={
                  <GridPage
                    title="Liked"
                    description="Quickly find the articles you have marked as liked."
                    emptyMessage="No liked articles yet. Mark articles as liked from the Articles page."
                    filter={(article: Article) => article.liked}
                    badge={(count) => (
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        {count} liked
                      </span>
                    )}
                    clearPatch={(article) => ({ ...article, liked: false })}
                    cardAction="liked"
                  />
                }
              />
              <Route
                path="read-again"
                element={
                  <GridPage
                    title="Read later"
                    description="Articles you plan to revisit—clear the flag when you are done."
                    emptyMessage="No read-later articles yet. Enable it when editing an article from the Articles page."
                    filter={(article: Article) => article.read_later}
                    badge={(count) => (
                      <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                        {count} marked
                      </span>
                    )}
                    clearPatch={(article) => ({ ...article, read_later: false })}
                    cardAction="readLater"
                  />
                }
              />
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
