import React, { useState, useEffect } from "react";
import { signInWithGithub } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft as faArrowLeftSolid } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../css/signin.css";

const SignIn = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className={loading ? "loader" : "login"}>
      {loading ? (
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      ) : (
        <div className="button-container">
          <button
            onClick={() => signInWithGithub(navigate)}
            className="github-button"
          >
            <FontAwesomeIcon icon={faGithub} /> Sign in{" "}
          </button>
          <div className="button-group">
            <button
              className="small-button"
              onClick={() => (window.location.href = "/")}
            >
              <FontAwesomeIcon icon={faArrowLeftSolid} /> Back
            </button>
            <a
              href="https://github.com/C-iph3r/alpha-md"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <button className="small-button repo-button">
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
