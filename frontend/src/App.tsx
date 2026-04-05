import { Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import FavoritesPage from "./components/features/FavoritesPage";
import ArticlesPage from "./components/features/ArticlesPage";
import useLoadConfig from "./hooks/useLoadConfig";
import NotificationBox from "./components/layout/NotificationBox";

function App() {
  useLoadConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Routes>
          <Route path="/" element={<ArticlesPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="*" element={<ArticlesPage />} />
        </Routes>
      </div>
      <NotificationBox />
    </div>
  );
}

export default App;
