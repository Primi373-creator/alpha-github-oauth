import React from "react";
import "../css/auth.css";

const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button className="button button-blue">QR CODE</button>
      <button className="button button-green">PAIR</button>
    </div>
  );
};

export default Auth;
