import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/auth.css";

const Auth = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button className="button button-blue" onClick={() => navigate("/qr")}>
        QR CODE
      </button>
      <button className="button button-green">PAIR</button>
    </div>
  );
};

export default Auth;
