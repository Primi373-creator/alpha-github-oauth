import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button className="button button-blue" onClick={() => navigate("/auth")}>
        AUTH
      </button>
      <button
        className="button button-green"
        onClick={() => navigate("/plugins")}
      >
        PLUGINS
      </button>
      <button
        className="button button-purple"
        onClick={() => navigate("/deploy")}
      >
        DEPLOY
      </button>
    </div>
  );
};

export default Home;
