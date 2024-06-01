import React from "react";
import "../css/deploy.css";
import Copyright from "./copyright";
import { useNavigate } from "react-router-dom";

const Deploy = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button
        className="button button-heroku"
        onClick={() => navigate("/deploy/heroku")}
      >
        HEROKU
      </button>
      <button
        className="button button-koyeb"
        onClick={() => navigate("/deploy/koyeb")}
      >
        KOYEB
      </button>
      <button
        className="button button-vps"
        onClick={() => navigate("/deploy/vps")}
      >
        VPS
      </button>
      <div className="w-full flex justify-center">
        <Copyright />
      </div>
    </div>
  );
};

export default Deploy;
