import React, { useState, useEffect } from "react";
import { signInWithGithub } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft as faArrowLeftSolid } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import "../css/signin.css";

const SignIn = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds
  }, []);

  return (
    <div className="login">
      {loading ? (
        <div className="loader">
          <div className="ripple"></div>
          <div className="ripple"></div>
        </div>
      ) : (
        <div className="button-container">
          <button
            onClick={() => signInWithGithub(navigate)}
            className="github-button"
          >
            <FontAwesomeIcon icon={faGithub} /> Sign in{" "}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="small-button"
              onClick={() => (window.location.href = "/")}
            >
              <FontAwesomeIcon icon={faArrowLeftSolid} /> Back
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <button className="small-button">
                <FontAwesomeIcon icon={faGithub} /> Repo
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
