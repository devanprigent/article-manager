// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Structure/NavBar";
import FavoritesPage from "./components/Pages/FavoritesPage";
import ArticlesPage from "./components/Pages/ArticlesPage";
import useLoadConfig from "./components/Hooks/useLoadConfig";
import NotificationBox from "./components/Structure/NotificationBox";

function App() {
  useLoadConfig();

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="h-96 flex-grow m-4">
        <Routes>
          <Route exact path="/" element={<ArticlesPage />} />
          <Route exact path="/favoris" element={<FavoritesPage />} />
          <Route path="*" element={<ArticlesPage />} />
        </Routes>
      </div>
      <NotificationBox />
    </div>
  );
}

// Exportation
export default App;
