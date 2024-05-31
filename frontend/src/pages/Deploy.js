import React from "react";
import "../css/deploy.css";

const Deploy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <button className="button button-red">HEROKU</button>
      <button className="button button-orange">KOYEB</button>
      <button className="button button-indigo">VPS</button>
    </div>
  );
};

export default Deploy;
