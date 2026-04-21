import { Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import FavoritesPage from './components/pages/FavoritesPage';
import ArticlesPage from './components/pages/ArticlesPage';
import StatsPage from './components/pages/StatsPage';
import { Toaster } from 'sonner';
import { useIsDarkMode } from './theme/ThemeContext';

function App() {
  const isDarkMode = useIsDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900 transition-colors dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Routes>
          <Route path="/" element={<ArticlesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<ArticlesPage />} />
        </Routes>
      </div>
      <Toaster position="top-center" theme={isDarkMode ? 'dark' : 'light'} richColors closeButton />
    </div>
  );
}

export default App;
