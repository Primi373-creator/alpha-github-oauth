import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DeleteGist = () => {
  const [gists, setGists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGists = async () => {
      const snapshot = await getDocs(collection(db, "gists"));
      const gistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGists(gistsData);
    };
    fetchGists();
  }, []);

  const handleDeleteGist = async (gistId) => {
    await deleteDoc(doc(db, "gists", gistId));
    setGists(gists.filter((gist) => gist.id !== gistId));
  };

  return (
    <div className="delete-gist">
      <h2>Delete a Gist</h2>
      {gists.length === 0 ? (
        <div className="no-plugins">
          <h2>No Gists to delete</h2>
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
                <button
                  onClick={() => handleDeleteGist(gist.id)}
                  className="delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default DeleteGist;
