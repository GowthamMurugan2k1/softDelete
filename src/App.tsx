import { Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playlist" element={<Playlist />} />
    </Routes>
  );
}

export default App;
