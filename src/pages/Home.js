import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import Copyright from "./copyright";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div className="flex flex-col items-center justify-center flex-grow">
        <button
          className="button button-blue"
          onClick={() => navigate("/auth")}
        >
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
      <div className="w-full flex justify-center">
        <Copyright /> {/* Add the Copyright component here */}
      </div>
    </div>
  );
};

export default Home;
