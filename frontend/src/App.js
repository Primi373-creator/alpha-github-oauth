import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Plugins from "./pages/Plugins";
import Deploy from "./pages/Deploy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/deploy" element={<Deploy />} />
      </Routes>
    </Router>
  );
}

export default App;
