import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Plugins from "./pages/Plugins";
import Deploy from "./pages/Deploy";
import Authqr from "./pages/qr";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/qr" element={<Authqr />} />
      </Routes>
    </Router>
  );
}

export default App;
