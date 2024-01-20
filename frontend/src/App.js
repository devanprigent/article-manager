// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Structure/NavBar";
import Accounts from "./components/Pages/Accounts";
import Articles from "./components/Pages/Articles";
import WebSites from "./components/Pages/WebSites";
import Footer from "./components/Structure/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Articles />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/websites" element={<WebSites />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
