// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Structure/NavBar";
import PageArticles from "./components/Pages/PageArticles";
import WebSites from "./components/Pages/PageWebSites";
import PageFavoris from "./components/Pages/PageFavoris";
import Footer from "./components/Structure/Footer";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="h-96 flex-grow m-4">
        <Routes>
          <Route exact path="/" element={<PageArticles />} />
          <Route exact path="/websites" element={<WebSites />} />
          <Route exact path="/favoris" element={<PageFavoris />} />
          <Route path="*" element={<PageArticles />} />
        </Routes>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// Exportation
export default App;
