import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";
import Copyright from "./copyright";

const Auth = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button className="button button-blue" onClick={() => navigate("/auth/qr")}>
        QR CODE
      </button>
      <button className="button button-green"onClick={() => navigate("/auth/pair")}>PAIR</button>
      <div className="w-full flex justify-center">
        <Copyright />
      </div>
    </div>
  );
};

export default Auth;