import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import dotenv from "dotenv";
import "tailwindcss/tailwind.css";

dotenv.config({ path: "../../.env" });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
