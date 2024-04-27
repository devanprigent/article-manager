// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Structure/NavBar";
import PageArticles from "./components/Pages/PageArticles";
import PageFavoris from "./components/Pages/PageFavoris";
import NotificationBox from "./components/Structure/NotificationBox";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="h-96 flex-grow m-4">
        <Routes>
          <Route exact path="/" element={<PageArticles />} />
          <Route exact path="/favoris" element={<PageFavoris />} />
          <Route path="*" element={<PageArticles />} />
        </Routes>
      </div>
      <NotificationBox />
    </div>
  );
}

// Exportation
export default App;
