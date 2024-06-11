import React, { useState, useEffect } from "react";
import { auth, db, increment } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../css/plugins.css";
import Copyright from "./copyright";

const Plugins = () => {
  const [gists, setGists] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchGists();
      } else {
        navigate("/signin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchGists = async () => {
    const snapshot = await getDocs(collection(db, "gists"));
    const gistsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGists(gistsData);
    setLoading(false);
  };

  const handleLike = async (gistId) => {
    const gistRef = doc(db, "gists", gistId);
    await updateDoc(gistRef, { like: increment(1) });
    fetchGists();
  };

  const handleDislike = async (gistId) => {
    const gistRef = doc(db, "gists", gistId);
    await updateDoc(gistRef, { dislike: increment(1) });
    fetchGists();
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="main">
        <div className="header">
          <div className="profile">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="avatar"
            />
            <span>
              Welcome, {user?.displayName} ({user?.reloadUserInfo?.screenName})
            </span>
          </div>
          <div className="menu">
            <button onClick={() => signOut(auth)} className="action-button">
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </button>
          </div>
        </div>
        {gists.length === 0 ? (
          <div className="no-plugins">
            <h2>Oops, no plugins found!</h2>
          </div>
        ) : (
          <div className="gist-grid">
            {gists.map((gist) => (
              <div key={gist.id} className="gist-card">
                <div className="gist-info">
                  <img
                    src={gist.owner.avatar_url}
                    alt={gist.owner.login}
                    className="gist-avatar"
                  />
                  <div>
                    <div className="gist-author">{gist.owner.login}</div>
                    <div className="gist-description">{gist.description}</div>
                  </div>
                </div>
                <div className="buttons">
                  <button
                    onClick={() => handleLike(gist.id)}
                    className="like-button"
                  >
                    Like ({gist.like})
                  </button>
                  <button
                    onClick={() => handleDislike(gist.id)}
                    className="dislike-button"
                  >
                    Dislike ({gist.dislike})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full flex justify-center">
        <Copyright />
      </div>
    </div>
  );
};

export default Plugins;
