import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../css/addg.css"; // Import the CSS file for styling

const AddGist = () => {
  const [newGistUrl, setNewGistUrl] = useState("");
  const [newGistDescription, setNewGistDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddGist = async () => {
    if (!newGistUrl || !newGistDescription) return;
    setLoading(true);
    try {
      const gistData = await fetchGistData(newGistUrl);
      await addDoc(collection(db, "gists"), {
        ...gistData,
        description: newGistDescription,
        like: 0,
        dislike: 0,
        owner: {
          login: gistData.owner.login,
          avatar_url: gistData.owner.avatar_url,
        },
      });
      setNewGistUrl("");
      setNewGistDescription("");
      navigate("/plugins");
    } catch (error) {
      console.error("Error adding Gist: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-gist">
      <h2>Add a New Gist</h2>
      <input
        type="text"
        placeholder="Gist URL"
        value={newGistUrl}
        onChange={(e) => setNewGistUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={newGistDescription}
        onChange={(e) => setNewGistDescription(e.target.value)}
      />
      <button onClick={handleAddGist} disabled={loading}>
        {loading ? "Adding..." : "Add Gist"}
      </button>
      <button onClick={() => navigate("/plugins")}>Cancel</button>
      {loading && (
        <div className="loader">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const fetchGistData = async (gistUrl) => {
  const response = await fetch(gistUrl);
  const data = await response.json();
  return {
    id: data.id,
    url: gistUrl,
    description: data.description,
    owner: {
      login: data.owner.login,
      avatar_url: data.owner.avatar_url,
    },
  };
};

export default AddGist;
