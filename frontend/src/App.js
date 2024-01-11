// Bibliothèques
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Articles from "./components/Articles";
import Tags from "./components/Tags";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Articles />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/tags" element={<Tags />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
