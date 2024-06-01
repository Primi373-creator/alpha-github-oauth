import React, { useState, useEffect } from "react";
import { auth, db, increment } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Plugins = () => {
  const [gists, setGists] = useState([]);
  const [user, setUser] = useState(null);
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
            <span>{user?.displayName}</span>
          </div>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
        <button onClick={() => navigate("/plugins/add")}>Add Gist</button>
        <button onClick={() => navigate("/plugins/delete")}>Delete Gist</button>
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
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-bold">{gist.owner.login}</div>
                    <div className="text-sm text-gray-500">
                      {gist.description}
                    </div>
                  </div>
                </div>
                <div className="buttons">
                  <button onClick={() => handleLike(gist.id)} className="like">
                    Like ({gist.like})
                  </button>
                  <button
                    onClick={() => handleDislike(gist.id)}
                    className="dislike"
                  >
                    Dislike ({gist.dislike})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plugins;
