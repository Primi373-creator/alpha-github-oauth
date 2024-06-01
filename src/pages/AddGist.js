import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddGist = () => {
  const [newGistUrl, setNewGistUrl] = useState("");
  const [newGistDescription, setNewGistDescription] = useState("");
  const navigate = useNavigate();

  const handleAddGist = async () => {
    if (!newGistUrl || !newGistDescription) return;
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
      navigate("/");
    } catch (error) {
      console.error("Error adding Gist: ", error);
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
      <button onClick={handleAddGist}>Add Gist</button>
      <button onClick={() => navigate("/")}>Cancel</button>
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
    like: 0,
    dislike: 0,
  };
};

export default AddGist;
