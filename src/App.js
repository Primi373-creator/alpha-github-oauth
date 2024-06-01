import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AddGist from "./pages/AddGist";
import DeleteGist from "./pages/DeleteGist";
import Plugins from "./pages/Plugins";
import Deploy from "./pages/Deploy";
import Authqr from "./pages/qr";
import SignIn from "./pages/Sigin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/deploy" element={<Deploy />} />
        <Route path="/qr" element={<Authqr />} />
        <Route path="/plugins" element={<Plugins />} />
        <Route path="/plugins/add" element={<AddGist />} />
        <Route path="/plugins/delete" element={<DeleteGist />} />
      </Routes>
    </Router>
  );
}

export default App;
