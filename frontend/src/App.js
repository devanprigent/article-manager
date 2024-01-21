// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Structure/NavBar";
import Accounts from "./components/Pages/Accounts";
import ArticleManager from "./components/Pages/ArticleManager";
import Footer from "./components/Structure/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<ArticleManager />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/articles" element={<ArticleManager />} />
      </Routes>
      <Footer />
    </div>
  );
}

// Exportation
export default App;
